"use client"

import type { AnalysisResult } from "@/lib/phishing-detector"
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  AlertTriangle,
  CheckCircle2,
  Info,
  ExternalLink,
  Loader2,
  Radar,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnalysisPanelProps {
  result: AnalysisResult
}

export function AnalysisPanel({ result }: AnalysisPanelProps) {
  const getBgClass = () => {
    switch (result.riskLevel) {
      case "dangerous":
        return "border-red-500/30 bg-red-500/5"
      case "suspicious":
        return "border-yellow-500/30 bg-yellow-500/5"
      case "safe":
        return "border-emerald-500/30 bg-emerald-500/5"
    }
  }

  const getScoreColor = () => {
    switch (result.riskLevel) {
      case "dangerous":
        return "text-red-400"
      case "suspicious":
        return "text-yellow-400"
      case "safe":
        return "text-emerald-400"
    }
  }

  const getScoreBarColor = () => {
    switch (result.riskLevel) {
      case "dangerous":
        return "bg-red-500"
      case "suspicious":
        return "bg-yellow-500"
      case "safe":
        return "bg-emerald-500"
    }
  }

  const getHeaderIcon = () => {
    switch (result.riskLevel) {
      case "dangerous":
        return <ShieldAlert className="h-6 w-6 text-red-400" />
      case "suspicious":
        return <ShieldQuestion className="h-6 w-6 text-yellow-400" />
      case "safe":
        return <ShieldCheck className="h-6 w-6 text-emerald-400" />
    }
  }

  const getDetailIcon = (status: string) => {
    switch (status) {
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
      case "warning":
        return <Info className="h-4 w-4 text-yellow-400 shrink-0" />
      case "safe":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
      default:
        return null
    }
  }

  const getDetailBg = (status: string) => {
    switch (status) {
      case "danger":
        return "border-red-500/20 bg-red-500/5"
      case "warning":
        return "border-yellow-500/20 bg-yellow-500/5"
      case "safe":
        return "border-emerald-500/20 bg-emerald-500/5"
      default:
        return "border-border"
    }
  }

  const vt = result.virusTotal

  return (
    <div
      className={`rounded-xl border p-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${getBgClass()}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {getHeaderIcon()}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">Analysis Report</h3>
          <p className="text-xs text-muted-foreground font-mono truncate max-w-xs sm:max-w-md">
            {result.url}
          </p>
        </div>
        {/* Risk Score Badge */}
        <div className={`text-right shrink-0`}>
          <div className={`text-2xl font-bold font-mono ${getScoreColor()}`}>
            {result.riskScore}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase font-mono">
            Risk Score
          </div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreBarColor()}`}
            style={{ width: `${result.riskScore}%` }}
          />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {result.details.map((detail) => (
          <div
            key={detail.label}
            className={`rounded-lg border p-3 ${getDetailBg(detail.status)}`}
          >
            <div className="flex items-center gap-2 mb-1">
              {getDetailIcon(detail.status)}
              <span className="text-xs font-medium text-foreground">
                {detail.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {detail.description}
            </p>
          </div>
        ))}
      </div>

      {/* VirusTotal Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Radar className="h-4 w-4 text-blue-400" />
          <h4 className="text-sm font-semibold text-foreground">
            VirusTotal Real-Time Scan
          </h4>
          {result.vtLoading && (
            <span className="flex items-center gap-1.5 text-xs text-blue-400 font-mono">
              <Loader2 className="h-3 w-3 animate-spin" />
              Scanning with 70+ engines...
            </span>
          )}
        </div>

        {/* VT Loading State */}
        {result.vtLoading && (
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-center">
            <Loader2 className="h-6 w-6 text-blue-400 animate-spin mx-auto mb-2" />
            <p className="text-xs text-blue-400 font-mono">
              Querying VirusTotal security engines...
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              This may take 10-30 seconds as engines analyze the URL in real-time
            </p>
          </div>
        )}

        {/* VT Error State */}
        {result.vtError && (
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-yellow-400 shrink-0" />
              <span className="text-xs font-medium text-yellow-400">
                VirusTotal Unavailable
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {result.vtError}. Results shown are from heuristic analysis only.
            </p>
          </div>
        )}

        {/* VT Results */}
        {vt && !result.vtLoading && (
          <div className="space-y-3">
            {/* VT Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div
                className={`rounded-lg border p-3 text-center ${
                  vt.stats.malicious > 0
                    ? "border-red-500/20 bg-red-500/5"
                    : "border-emerald-500/20 bg-emerald-500/5"
                }`}
              >
                <div
                  className={`text-lg font-bold font-mono ${
                    vt.stats.malicious > 0
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {vt.stats.malicious}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">
                  Malicious
                </div>
              </div>
              <div
                className={`rounded-lg border p-3 text-center ${
                  vt.stats.suspicious > 0
                    ? "border-yellow-500/20 bg-yellow-500/5"
                    : "border-emerald-500/20 bg-emerald-500/5"
                }`}
              >
                <div
                  className={`text-lg font-bold font-mono ${
                    vt.stats.suspicious > 0
                      ? "text-yellow-400"
                      : "text-emerald-400"
                  }`}
                >
                  {vt.stats.suspicious}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">
                  Suspicious
                </div>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                <div className="text-lg font-bold font-mono text-emerald-400">
                  {vt.stats.harmless}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">
                  Clean
                </div>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <div className="text-lg font-bold font-mono text-muted-foreground">
                  {vt.stats.total}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">
                  Total Engines
                </div>
              </div>
            </div>

            {/* Detection Bar */}
            {vt.stats.total > 0 && (
              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    Engine Detection Rate
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      vt.stats.malicious > 0
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {vt.stats.malicious + vt.stats.suspicious}/{vt.stats.total}{" "}
                    flagged
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden flex">
                  {vt.stats.malicious > 0 && (
                    <div
                      className="h-full bg-red-500 transition-all duration-700"
                      style={{
                        width: `${
                          (vt.stats.malicious / vt.stats.total) * 100
                        }%`,
                      }}
                    />
                  )}
                  {vt.stats.suspicious > 0 && (
                    <div
                      className="h-full bg-yellow-500 transition-all duration-700"
                      style={{
                        width: `${
                          (vt.stats.suspicious / vt.stats.total) * 100
                        }%`,
                      }}
                    />
                  )}
                  <div
                    className="h-full bg-emerald-500 transition-all duration-700"
                    style={{
                      width: `${
                        (vt.stats.harmless / vt.stats.total) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Flagged Engines List */}
            {vt.flaggedEngines.length > 0 && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <h5 className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Engines That Flagged This URL
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {vt.flaggedEngines.map((engine) => (
                    <div
                      key={engine.engine}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                          engine.category === "malicious"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <span className="text-foreground font-mono">
                        {engine.engine}
                      </span>
                      <span className="text-muted-foreground">
                        — {engine.result || engine.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reasons */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Findings
        </h4>
        <ul className="space-y-2">
          {result.reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-2 text-sm">
              <span
                className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${getScoreBarColor()}`}
              />
              <span className="text-muted-foreground">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Proceed Button */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {result.riskLevel === "dangerous"
            ? "This site appears to be a phishing attempt. Proceed with extreme caution."
            : result.riskLevel === "suspicious"
              ? "This site shows suspicious characteristics. Verify before proceeding."
              : "This site appears safe to visit."}
        </p>
        <Button
          onClick={() => window.open(result.url, "_blank")}
          variant={result.riskLevel === "safe" ? "default" : "outline"}
          className={`shrink-0 gap-2 ${
            result.riskLevel === "dangerous"
              ? "border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              : result.riskLevel === "suspicious"
                ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
                : "bg-emerald-500 hover:bg-emerald-600 text-background"
          }`}
        >
          {result.riskLevel === "dangerous" ? "Proceed Anyway" : "Visit Site"}
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
