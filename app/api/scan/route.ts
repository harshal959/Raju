import { NextRequest, NextResponse } from "next/server"

const VT_API_BASE = "https://www.virustotal.com/api/v3"
const MAX_POLL_ATTEMPTS = 8
const POLL_INTERVAL_MS = 2500
const SUBMIT_TIMEOUT_MS = 15000
const POLL_TIMEOUT_MS = 10000

interface VTStats {
  malicious: number
  suspicious: number
  harmless: number
  undetected: number
  timeout: number
}

interface VTEngineResult {
  engine_name: string
  category: string
  result: string
  method: string
}

function createUnavailableResponse(reason: string) {
  return NextResponse.json({
    unavailable: true,
    reason,
    stats: {
      malicious: 0,
      suspicious: 0,
      harmless: 0,
      undetected: 0,
      timeout: 0,
      total: 0,
    },
    flaggedEngines: [],
    scanDate: new Date().toISOString(),
  })
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.VIRUSTOTAL_API_KEY

    if (!apiKey) {
      return createUnavailableResponse("VirusTotal API key not configured")
    }

    const body = await request.json()
    let { url } = body

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `http://${url}`
    }

    try {
      const parsedUrl = new URL(url)
      const hostname = parsedUrl.hostname

      // VirusTotal cannot scan local, private IPs, or localhost
      const isPrivateRegex = /^(localhost|127\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+|::1)$/
      if (isPrivateRegex.test(hostname)) {
        return createUnavailableResponse("Local or private IPs cannot be scanned by VirusTotal. Results shown are from heuristic analysis only.")
      }
    } catch {
      // If URL parsing fails, we'll let VirusTotal handle it and likely return a 400
    }

    // Step 1: Submit URL for scanning
    let submitResponse: Response
    try {
      submitResponse = await fetchWithTimeout(
        `${VT_API_BASE}/urls`,
        {
          method: "POST",
          headers: {
            "x-apikey": apiKey,
            "accept": "application/json",
            "content-type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ url }).toString(),
        },
        SUBMIT_TIMEOUT_MS
      )
    } catch (fetchError: unknown) {
      const errMsg = fetchError instanceof Error ? fetchError.message : "Unknown error"
      console.error("VT submit fetch failed:", errMsg)
      
      let userFriendlyMsg = `Could not reach VirusTotal: ${errMsg}.`
      if (errMsg.includes("fetch failed") || errMsg.includes("timeout") || errMsg.includes("ECONNREFUSED")) {
        userFriendlyMsg = "Could not reach VirusTotal. Your ISP, antivirus, or firewall may be blocking the API connection, or the network timed out."
      }
      
      return createUnavailableResponse(`${userFriendlyMsg} Results shown are from heuristic analysis only.`)
    }

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text()
      console.error("VT submit error:", submitResponse.status, errorText)

      if (submitResponse.status === 429) {
        return createUnavailableResponse(
          "VirusTotal rate limit exceeded. Please wait and try again."
        )
      }

      return createUnavailableResponse(
        `VirusTotal API error: ${submitResponse.status}`
      )
    }

    const submitData = await submitResponse.json()
    const analysisId = submitData?.data?.id

    if (!analysisId) {
      return createUnavailableResponse(
        "Failed to get analysis ID from VirusTotal"
      )
    }

    // Step 2: Poll for analysis results
    let analysisResult = null

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      // Wait before polling
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))

      let analysisResponse: Response
      try {
        analysisResponse = await fetchWithTimeout(
          `${VT_API_BASE}/analyses/${analysisId}`,
          {
            headers: {
              "x-apikey": apiKey,
              "accept": "application/json",
            },
          },
          POLL_TIMEOUT_MS
        )
      } catch {
        console.error("VT poll fetch failed on attempt", attempt + 1)
        continue
      }

      if (!analysisResponse.ok) {
        console.error("VT analysis poll error:", analysisResponse.status)
        continue
      }

      const analysisData = await analysisResponse.json()
      const status = analysisData?.data?.attributes?.status

      if (status === "completed") {
        const attrs = analysisData.data.attributes
        const stats: VTStats = attrs.stats || {}
        const results: Record<string, VTEngineResult> = attrs.results || {}

        // Extract the top flagging engines (malicious + suspicious only)
        const flaggedEngines = Object.values(results)
          .filter(
            (r) => r.category === "malicious" || r.category === "suspicious"
          )
          .map((r) => ({
            engine: r.engine_name,
            category: r.category,
            result: r.result,
          }))
          .slice(0, 15) // Limit to top 15 for UI

        const totalEngines =
          (stats.malicious || 0) +
          (stats.suspicious || 0) +
          (stats.harmless || 0) +
          (stats.undetected || 0) +
          (stats.timeout || 0)

        analysisResult = {
          stats: {
            malicious: stats.malicious || 0,
            suspicious: stats.suspicious || 0,
            harmless: stats.harmless || 0,
            undetected: stats.undetected || 0,
            timeout: stats.timeout || 0,
            total: totalEngines,
          },
          flaggedEngines,
          scanDate: new Date().toISOString(),
        }
        break
      }

      // If queued, keep polling
      if (status === "queued" || status === "in-progress") {
        continue
      }
    }

    if (!analysisResult) {
      return createUnavailableResponse(
        "Analysis timed out. VirusTotal may still be processing."
      )
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Scan API error:", error)
    return createUnavailableResponse("Internal server error during scan")
  }
}
