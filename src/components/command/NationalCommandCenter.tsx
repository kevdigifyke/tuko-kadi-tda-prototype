"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import TelemetryFeed from "./TelemetryFeed";
import CommandSidebar from "./CommandSidebar";
import BottomReplayRail from "./BottomReplayRail";
import { StatusChip } from "../ui/StatusChip";
import { useSimulationStore } from "@/src/store/useSimulationStore";

const IEBCBoundaryMap = dynamic(() => import("../maps/IEBCBoundaryMap"), { ssr: false });

type CommandMode = "observatory" | "presentation";

export default function NationalCommandCenter({ embedded = false, mode = "observatory" }: { embedded?: boolean; mode?: CommandMode }) {
  const isPresentation = mode === "presentation";
  const [focusMode, setFocusMode] = useState(isPresentation);
  const [telemetryCollapsed, setTelemetryCollapsed] = useState(isPresentation);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isPresentation);
  const [replayCollapsed, setReplayCollapsed] = useState(false);
  const events = useSimulationStore((s) => s.telemetryEvents);
  const tick = useSimulationStore((s) => s.tick);
  const metrics = useMemo(() => ({
    anomalies: events.filter((e) => e.severity === "CRITICAL").length,
    active: events.filter((e) => e.status !== "LIVE").length,
    highRisk: new Set(events.filter((e) => e.aiRiskScore >= 70).map((e) => e.county)).size,
    volatility: Math.round(events.reduce((acc, e) => acc + Math.abs(60 - e.turnout), 0) / Math.max(1, events.length)),
    clusters: events.filter((e) => e.intelligenceSeverity === "MAGENTA" || e.intelligenceSeverity === "RED").length,
  }), [events]);
  const focusedEvent = events.find((event) => event.severity === "CRITICAL") ?? events[0];

  return (
    <div className={`${embedded ? "h-[calc(100svh-8rem)] md:h-[calc(100svh-4rem)] rounded-2xl border border-cyan-300/15" : "h-screen"} bg-black text-white flex flex-col overflow-hidden`}>
      <div className="flex flex-wrap items-center gap-3 border-b border-cyan-950/60 bg-zinc-950/82 px-3 py-2 text-[11px] text-zinc-400">
        <div className="shrink-0 border-r border-cyan-300/15 pr-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">KuraScope EOIS {isPresentation ? "Presentation" : "Observatory"}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Map → Replay → Telemetry → Intelligence</p>
        </div>
        <div className="grid min-w-[320px] flex-1 grid-cols-2 gap-2 md:grid-cols-5">
          <div>Critical: <span className="text-rose-300">{metrics.anomalies}</span></div>
          <div>Telemetry: <span className="text-cyan-300">{metrics.active}</span></div>
          <div>Risk counties: <span className="text-amber-300">{metrics.highRisk}</span></div>
          <div>Volatility: <span className="text-zinc-200">{metrics.volatility}</span></div>
          <div>Propagation: <span className="text-red-300">{metrics.clusters}</span></div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isPresentation && <StatusChip status="GREEN" label="DEMO READY" />}
          <button type="button" onClick={() => setSidebarCollapsed((current) => !current)} className="rounded-full border border-cyan-500/30 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-300 hover:border-cyan-300/60">
            {sidebarCollapsed ? "Show intel" : "Hide intel"}
          </button>
          <button type="button" onClick={() => setReplayCollapsed((current) => !current)} className="rounded-full border border-cyan-500/30 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-300 hover:border-cyan-300/60">
            {replayCollapsed ? "Show replay" : "Hide replay"}
          </button>
          <button
            type="button"
            onClick={() => setFocusMode((current) => !current)}
            className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em] transition ${focusMode ? "border-cyan-300/70 bg-cyan-400/15 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.14)]" : "border-cyan-500/30 bg-black/35 text-cyan-300 hover:border-cyan-300/60 hover:bg-cyan-400/10"}`}
            aria-pressed={focusMode}
          >
            ⌘ Focus
          </button>
        </div>
      </div>
      <div className="flex flex-1 gap-2 overflow-hidden bg-black p-2 transition-all duration-300 ease-out">
        <div className={`${focusMode || sidebarCollapsed ? "w-0 opacity-0" : "w-64 opacity-100"} shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-out`}><CommandSidebar focusMode={focusMode} /></div>
        <div className="relative min-w-0 flex-1 bg-black transition-all duration-300 ease-out">
          <IEBCBoundaryMap focusMode={focusMode || isPresentation} />
          {isPresentation && (
            <div className="pointer-events-none absolute inset-x-4 top-4 z-[500] mx-auto max-w-4xl rounded-2xl border border-cyan-300/20 bg-black/70 p-4 shadow-[0_0_60px_rgba(8,145,178,0.18)] backdrop-blur">
              <p className="panel-kicker text-cyan-200">Guided scenario playback</p>
              <h1 className="mt-1 text-2xl font-semibold text-white">Anomalies, propagation, replay cognition, and telemetry evolution</h1>
              <p className="mt-2 text-sm text-zinc-300">T+{tick} · {focusedEvent ? `${focusedEvent.county}: ${focusedEvent.title}` : "Synthetic telemetry initializing"}</p>
            </div>
          )}
        </div>
        <div className={`${focusMode ? "w-0 opacity-0" : telemetryCollapsed ? "w-14 opacity-100" : "w-72 opacity-100"} shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-out`}><TelemetryFeed collapsed={focusMode || telemetryCollapsed} onToggleCollapsed={() => setTelemetryCollapsed((current) => !current)} /></div>
      </div>
      <div className={`${replayCollapsed ? "h-0 opacity-0" : "h-32 opacity-100"} overflow-hidden transition-[height,opacity] duration-300 ease-out`}>
        <BottomReplayRail />
      </div>
    </div>
  );
}
