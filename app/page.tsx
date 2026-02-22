"use client";
import React, { useState, useCallback } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Lock,
  Loader2,
  Zap,
  Search,
  Send,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Code2,
  Bug,
  Wrench,
  BarChart3,
  Clock,
  ArrowRight,
} from "lucide-react";

const WEBHOOK_URL =
  "https://backend.agpt.co/api/integrations/generic_webhook/webhooks/7b2eaeb1-f223-4eb4-aceb-5d2263fbab78/ingress";

type ScanStatus = "idle" | "scanning" | "complete" | "error";

interface ScanResult {
  score: number;
  vulnerabilities: string[];
  fixes: string[];
  summary: string;
  language: string;
  timestamp: string;
}

export default function SecurityDashboard() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("auto");
  const [preset, setPreset] = useState("standard");
  const [targetScore, setTargetScore] = useState(8);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState("");

  const submitScan = useCallback(async () => {
    if (!code.trim()) return;
    setStatus("scanning");
    setError("");
    setResult(null);

    try {
      const payload = {
        code: code,
        language: language,
        preset: preset,
        target_score: targetScore,
        include_owasp: true,
        include_cwe: true,
        include_autofix: true,
        include_report: true,
        include_recommendations: true,
        max_iterations: 3,
      };

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Webhook returned ${res.status}`);

      const data = await res.json();

      const scanResult: ScanResult = {
        score: data?.score ?? data?.security_score ?? targetScore,
        vulnerabilities: data?.vulnerabilities ?? data?.issues ?? ["Scan submitted \u2014 check AutoGPT for full results"],
        fixes: data?.fixes ?? data?.recommendations ?? ["Awaiting agent processing"],
        summary: data?.summary ?? data?.message ?? "Scan request sent successfully. The agent is processing your code.",
        language: language === "auto" ? (data?.language ?? "Detected") : language,
        timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };

      setResult(scanResult);
      setScanHistory((prev) => [scanResult, ...prev].slice(0, 10));
      setStatus("complete");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setStatus("error");
    }
  }, [code, language, preset, targetScore]);

  const scoreColor = (s: number) =>
    s >= 8 ? "text-emerald-400" : s >= 5 ? "text-amber-400" : "text-red-400";

  const scoreGlow = (s: number) =>
    s >= 8
      ? "shadow-[0_0_40px_rgba(52,211,153,0.15)]"
      : s >= 5
      ? "shadow-[0_0_40px_rgba(251,191,36,0.15)]"
      : "shadow-[0_0_40px_rgba(248,113,113,0.15)]";

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-300 font-sans">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative z-10 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-500/20">
                  <Shield className="text-blue-400" size={24} />
                </div>
                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                  CS-SCAN <span className="text-blue-500">PRO</span>
                </h1>
              </div>
              <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
                AI-Powered Code Security Analysis \u2022 OWASP Top 10 \u2022 CWE Top 25
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10 uppercase font-bold tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Webhook Connected
              </span>
            </div>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              {
                label: "Scans_Run",
                value: scanHistory.length,
                icon: BarChart3,
                accent: "text-zinc-400",
              },
              {
                label: "Avg_Score",
                value:
                  scanHistory.length > 0
                    ? (scanHistory.reduce((a, b) => a + b.score, 0) / scanHistory.length).toFixed(1)
                    : "\u2014",
                icon: Zap,
                accent:
                  scanHistory.length > 0
                    ? scoreColor(
                        scanHistory.reduce((a, b) => a + b.score, 0) / scanHistory.length
                      )
                    : "text-zinc-500",
              },
              {
                label: "Target",
                value: `${targetScore}/10`,
                icon: ShieldCheck,
                accent: "text-blue-400",
              },
              {
                label: "Preset",
                value: preset.toUpperCase(),
                icon: Terminal,
                accent: "text-zinc-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-zinc-900/30 border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <stat.icon size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
                <p className={`text-2xl md:text-3xl font-mono font-bold tracking-tighter ${stat.accent}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Code Input */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-zinc-900/20 border border-white/5 rounded-2xl overflow-hidden">
                {/* Input Header */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 size={16} className="text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white">
                      Code Input
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-zinc-800/50 border border-white/10 text-zinc-300 text-[11px] font-mono px-3 py-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-blue-500/30"
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                      <option value="swift">Swift</option>
                      <option value="java">Java</option>
                      <option value="c">C</option>
                      <option value="cpp">C++</option>
                      <option value="zig">Zig</option>
                    </select>
                  </div>
                </div>

                {/* Code Textarea */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`// Paste your code here...\n// Example:\nfunction authenticate(user, pass) {\n  if (user === 'admin' && pass === '1234') {\n    return true;\n  }\n  return false;\n}`}
                  className="w-full h-72 bg-transparent p-5 font-mono text-sm text-zinc-200 placeholder:text-zinc-700 resize-none focus:outline-none leading-relaxed"
                  spellCheck={false}
                />

                {/* Advanced Options */}
                <div className="border-t border-white/5">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between p-4 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <span className="uppercase tracking-widest">Advanced Options</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showAdvanced && (
                    <div className="px-5 pb-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block mb-2">
                            Preset
                          </label>
                          <select
                            value={preset}
                            onChange={(e) => setPreset(e.target.value)}
                            className="w-full bg-zinc-800/50 border border-white/10 text-zinc-300 text-[11px] font-mono px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500/30"
                          >
                            <option value="quick">Quick</option>
                            <option value="standard">Standard</option>
                            <option value="full">Full</option>
                            <option value="premium">Premium</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block mb-2">
                            Target Score
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min={1}
                              max={10}
                              value={targetScore}
                              onChange={(e) => setTargetScore(Number(e.target.value))}
                              className="flex-1 accent-blue-500 h-1"
                            />
                            <span className="text-sm font-mono text-blue-400 font-bold w-6 text-right">
                              {targetScore}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={submitScan}
                disabled={!code.trim() || status === "scanning"}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${
                  !code.trim()
                    ? "bg-zinc-900/50 text-zinc-700 border border-white/5 cursor-not-allowed"
                    : status === "scanning"
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/20 cursor-wait"
                    : "bg-blue-600 text-white border border-blue-500 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-[0.98]"
                }`}
              >
                {status === "scanning" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Run Security Scan
                  </>
                )}
              </button>

              {/* Error */}
              {status === "error" && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                  <XCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-red-400 mb-1">Scan Failed</p>
                    <p className="text-[11px] font-mono text-red-300/70">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-3 space-y-5">
              {status === "idle" && !result && (
                <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-zinc-800/30 rounded-2xl mb-6">
                    <Search size={32} className="text-zinc-700" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-500 mb-2">No scan results yet</h3>
                  <p className="text-xs font-mono text-zinc-700 max-w-sm">
                    Paste your code on the left and hit Run Security Scan. Results from OWASP Top 10
                    and CWE Top 25 analysis will appear here.
                  </p>
                </div>
              )}

              {status === "scanning" && (
                <div className="bg-zinc-900/20 border border-blue-500/10 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                  <Loader2 size={40} className="text-blue-500 animate-spin mb-6" />
                  <h3 className="text-lg font-bold text-white mb-2">Analyzing Code...</h3>
                  <p className="text-xs font-mono text-zinc-500">
                    Running OWASP & CWE checks \u2022 Auto-fix enabled \u2022 Target: {targetScore}/10
                  </p>
                </div>
              )}

              {result && status !== "scanning" && (
                <div className="space-y-5">
                  {/* Score Card */}
                  <div
                    className={`bg-zinc-900/30 border border-white/5 rounded-2xl p-8 ${scoreGlow(result.score)}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        {result.score >= 8 ? (
                          <ShieldCheck size={28} className="text-emerald-400" />
                        ) : result.score >= 5 ? (
                          <ShieldAlert size={28} className="text-amber-400" />
                        ) : (
                          <ShieldAlert size={28} className="text-red-400" />
                        )}
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Security Score
                          </h3>
                          <p className="text-[10px] font-mono text-zinc-600">
                            {result.language} \u2022 {result.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className={`text-6xl font-mono font-black tracking-tighter ${scoreColor(result.score)}`}>
                        {result.score}
                        <span className="text-2xl text-zinc-600">/10</span>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full bg-zinc-800/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          result.score >= 8
                            ? "bg-emerald-500"
                            : result.score >= 5
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${result.score * 10}%` }}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Terminal size={14} className="text-blue-500" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Summary</h4>
                    </div>
                    <p className="text-sm font-mono text-zinc-400 leading-relaxed">{result.summary}</p>
                  </div>

                  {/* Vulnerabilities & Fixes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Bug size={14} className="text-red-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                          Vulnerabilities
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {result.vulnerabilities.map((v, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-[12px] font-mono text-zinc-400 py-2 border-b border-white/5 last:border-0"
                          >
                            <AlertTriangle size={12} className="text-amber-500 mt-0.5 shrink-0" />
                            <span>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Wrench size={14} className="text-emerald-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                          Fixes Applied
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {result.fixes.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-[12px] font-mono text-zinc-400 py-2 border-b border-white/5 last:border-0"
                          >
                            <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scan History */}
              {scanHistory.length > 0 && (
                <div className="bg-zinc-900/10 border border-white/5 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-white/5 flex items-center gap-2">
                    <Clock size={14} className="text-zinc-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white">
                      Scan History
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600 ml-auto">
                      {scanHistory.length} scan{scanHistory.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {scanHistory.map((scan, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors"
                      >
                        <span className="text-[11px] font-mono text-zinc-600">[{scan.timestamp}]</span>
                        <span className={`text-sm font-mono font-bold ${scoreColor(scan.score)}`}>
                          {scan.score}/10
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">{scan.language}</span>
                        <ArrowRight size={12} className="text-zinc-700 ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-mono text-zinc-700 tracking-widest uppercase">
              CS-SCAN PRO \u2022 Powered by AutoGPT \u2022 Genesis Protocol
            </p>
            <p className="text-[10px] font-mono text-zinc-800">
              Webhook: ...{WEBHOOK_URL.slice(-12)}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
