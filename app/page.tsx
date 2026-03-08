"use client"

import { useState, useCallback, useRef } from "react"
import { Header } from "@/components/header"
import { UrlScanner } from "@/components/url-scanner"
import { TrafficSignal } from "@/components/traffic-signal"
import { AnalysisPanel } from "@/components/analysis-panel"
import { DemoSites } from "@/components/demo-sites"
import { StatsBar } from "@/components/stats-bar"
import { analyzeUrl, type AnalysisResult, type VirusTotalResult } from "@/lib/phishing-detector"
import { Shield, Zap, Eye, Lock } from "lucide-react"

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [totalScans, setTotalScans] = useState(0)
  const [threatsDetected, setThreatsDetected] = useState(0)
  const [safeCount, setSafeCount] = useState(0)
  const [scanHistory, setScanHistory] = useState<AnalysisResult[]>([])
  const vtAbortRef = useRef<AbortController | null>(null)

  const handleScan = useCallback((url: string) => {
    setIsScanning(true)
    setResult(null)

    // Cancel any in-flight VT request
    if (vtAbortRef.current) {
      vtAbortRef.current.abort()
    }

    // Phase 1: Quick heuristic analysis (instant)
    setTimeout(() => {
      const heuristicResult = analyzeUrl(url)
      // Show heuristic results immediately with VT loading indicator
      const resultWithVtLoading: AnalysisResult = {
        ...heuristicResult,
        vtLoading: true,
        virusTotal: null,
        vtError: null,
      }
      setResult(resultWithVtLoading)
      setIsScanning(false)
      setTotalScans((prev) => prev + 1)

      if (heuristicResult.isPhishing) {
        setThreatsDetected((prev) => prev + 1)
      } else {
        setSafeCount((prev) => prev + 1)
      }

      setScanHistory((prev) => [resultWithVtLoading, ...prev].slice(0, 10))

      // Phase 2: VirusTotal API scan (async, takes a few seconds)
      const abortController = new AbortController()
      vtAbortRef.current = abortController

      fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: heuristicResult.url }),
        signal: abortController.signal,
      })
        .then((res) => res.json())
        .then((vtData) => {
          // Handle VT unavailable (graceful fallback)
          if (vtData.unavailable) {
            setResult((prev) => {
              if (!prev || prev.url !== heuristicResult.url) return prev
              return {
                ...prev,
                vtLoading: false,
                vtError: vtData.reason || "VirusTotal is currently unavailable",
              }
            })
            return
          }

          const typedVtData = vtData as VirusTotalResult
          // Merge VT results with heuristic results
          setResult((prev) => {
            if (!prev || prev.url !== heuristicResult.url) return prev

            // Adjust risk score based on VT results
            let adjustedScore = prev.riskScore
            const vtMalicious = typedVtData.stats?.malicious || 0
            const vtSuspicious = typedVtData.stats?.suspicious || 0
            const vtTotal = typedVtData.stats?.total || 1

            if (vtMalicious > 0) {
              // Scale VT malicious ratio into 0-50 boost
              const vtRatio = (vtMalicious + vtSuspicious * 0.5) / vtTotal
              adjustedScore = Math.min(100, adjustedScore + Math.round(vtRatio * 60))
            } else if (vtTotal > 10 && vtMalicious === 0 && vtSuspicious === 0) {
              // VT says it's clean — slightly lower the score
              adjustedScore = Math.max(0, adjustedScore - 10)
            }

            let riskLevel: AnalysisResult["riskLevel"]
            if (adjustedScore >= 50) {
              riskLevel = "dangerous"
            } else if (adjustedScore >= 25) {
              riskLevel = "suspicious"
            } else {
              riskLevel = "safe"
            }

            const vtReasons: string[] = []
            if (vtMalicious > 0) {
              vtReasons.push(
                `VirusTotal: ${vtMalicious}/${vtTotal} engines flagged as malicious`
              )
            }
            if (vtSuspicious > 0) {
              vtReasons.push(
                `VirusTotal: ${vtSuspicious}/${vtTotal} engines flagged as suspicious`
              )
            }
            if (vtMalicious === 0 && vtSuspicious === 0 && vtTotal > 0) {
              vtReasons.push(
                `VirusTotal: Clean — 0/${vtTotal} engines detected threats`
              )
            }

            const merged: AnalysisResult = {
              ...prev,
              riskScore: adjustedScore,
              riskLevel,
              isPhishing: adjustedScore >= 50,
              reasons: [...prev.reasons, ...vtReasons],
              virusTotal: typedVtData,
              vtLoading: false,
              vtError: null,
            }

            // Update scan history with merged result
            setScanHistory((hist) =>
              hist.map((h) =>
                h.url === merged.url && h.vtLoading ? merged : h
              )
            )

            // Update threat/safe counts if risk level changed
            if (prev.riskLevel !== merged.riskLevel) {
              if (merged.isPhishing && !prev.isPhishing) {
                setThreatsDetected((c) => c + 1)
                setSafeCount((c) => Math.max(0, c - 1))
              } else if (!merged.isPhishing && prev.isPhishing) {
                setSafeCount((c) => c + 1)
                setThreatsDetected((c) => Math.max(0, c - 1))
              }
            }

            return merged
          })
        })
        .catch((err) => {
          if (err.name === "AbortError") return
          console.error("VirusTotal scan error:", err)
          setResult((prev) => {
            if (!prev || prev.url !== heuristicResult.url) return prev
            return {
              ...prev,
              vtLoading: false,
              vtError: err.message || "VirusTotal scan failed",
            }
          })
        })
    }, 800)
  }, [])

  const getBgOverlay = () => {
    if (isScanning) return "bg-yellow-500/[0.02]"
    if (!result) return ""
    switch (result.riskLevel) {
      case "dangerous":
        return "bg-red-500/[0.03]"
      case "suspicious":
        return "bg-yellow-500/[0.02]"
      case "safe":
        return "bg-emerald-500/[0.02]"
    }
  }

  return (
    <div
      className={`min-h-screen bg-background transition-colors duration-1000 ${getBgOverlay()}`}
    >
      <Header />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <section className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            Detect Phishing Threats Instantly
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            Analyze any URL for phishing indicators using our intelligent detection engine.
            Protect yourself from malicious websites before they steal your data.
          </p>
        </section>

        {/* Scanner + Signal */}
        <section className="flex flex-col lg:flex-row items-start gap-8 mb-10">
          <div className="flex-1 w-full space-y-6">
            <UrlScanner onScan={handleScan} isScanning={isScanning} />

            {/* Analysis Result */}
            {result && !isScanning && <AnalysisPanel result={result} />}

            {/* Empty state */}
            {!result && !isScanning && (
              <div className="rounded-xl border border-border border-dashed p-8 text-center">
                <Shield className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Enter a URL above or try one of the demo sites below to see the analysis
                </p>
              </div>
            )}

            {/* Scanning state */}
            {isScanning && (
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-8 text-center animate-pulse">
                <div className="relative mx-auto mb-4 w-fit">
                  <div className="h-10 w-10 rounded-full border-2 border-yellow-500/30 border-t-yellow-400 animate-spin" />
                </div>
                <p className="text-sm text-yellow-400 font-mono">
                  Analyzing URL for threats...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Checking domain, SSL, patterns, and more
                </p>
              </div>
            )}
          </div>

          {/* Traffic Signal */}
          <div className="lg:sticky lg:top-24 shrink-0 mx-auto lg:mx-0">
            <TrafficSignal result={result} isScanning={isScanning} />
          </div>
        </section>

        {/* Stats */}
        {totalScans > 0 && (
          <section className="mb-10">
            <StatsBar
              totalScans={totalScans}
              threatsDetected={threatsDetected}
              safeCount={safeCount}
            />
          </section>
        )}

        {/* Scan History */}
        {scanHistory.length > 0 && (
          <section className="mb-10">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Scans
            </h3>
            <div className="space-y-2">
              {scanHistory.map((scan, i) => (
                <button
                  key={`${scan.url}-${i}`}
                  type="button"
                  onClick={() => handleScan(scan.url)}
                  className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-secondary/50 ${
                    scan.riskLevel === "dangerous"
                      ? "border-red-500/20"
                      : scan.riskLevel === "suspicious"
                        ? "border-yellow-500/20"
                        : "border-emerald-500/20"
                  }`}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      scan.riskLevel === "dangerous"
                        ? "bg-red-500"
                        : scan.riskLevel === "suspicious"
                          ? "bg-yellow-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <span className="text-sm font-mono text-foreground truncate flex-1">
                    {scan.url}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      scan.riskLevel === "dangerous"
                        ? "bg-red-500/20 text-red-400"
                        : scan.riskLevel === "suspicious"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {scan.riskLevel}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {scan.riskScore}/100
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Demo Sites */}
        <section className="mb-10">
          <DemoSites onSelect={handleScan} isScanning={isScanning} />
        </section>

        {/* Features */}
        <section className="mb-16">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            How It Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Eye,
                title: "URL Analysis",
                description:
                  "Examines domain patterns, subdomains, and URL structure for anomalies",
                color: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
              },
              {
                icon: Shield,
                title: "Brand Detection",
                description:
                  "Identifies attempts to impersonate trusted brands and services",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20",
              },
              {
                icon: Lock,
                title: "SSL Verification",
                description:
                  "Checks for HTTPS encryption and secure communication protocols",
                color: "text-yellow-400",
                bg: "bg-yellow-500/10 border-yellow-500/20",
              },
              {
                icon: Zap,
                title: "Instant Results",
                description:
                  "Get real-time threat assessment with detailed risk breakdown",
                color: "text-red-400",
                bg: "bg-red-500/10 border-red-500/20",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`rounded-xl border p-5 ${feature.bg}`}
              >
                <feature.icon className={`h-6 w-6 mb-3 ${feature.color}`} />
                <h4 className="font-semibold text-sm text-foreground mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            PhishGuard Threat Detection System
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Educational tool for phishing awareness. Always verify URLs independently.
          </p>
        </footer>
      </main>
    </div>
  )
}
