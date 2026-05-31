"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import TelemetryFeed from "./TelemetryFeed";
import CommandSidebar from "./CommandSidebar";
import BottomReplayRail from "./BottomReplayRail";
import { useSimulationStore } from "@/src/store/useSimulationStore";

const IEBCBoundaryMap = dynamic(() => import("../maps/IEBCBoundaryMap"), { ssr: false });

export default function NationalCommandCenter({ embedded = false }: { embedded?: boolean }) {
  const [focusMode, setFocusMode] = useState(false);
  const [telemetryCollapsed, setTelemetryCollapsed] = useState(false);
  const events = useSimulationStore((s) => s.telemetryEvents);
  const metrics = useMemo(() => ({
    anomalies: events.filter((e) => e.severity === "CRITICAL").length,
    active: events.filter((e) => e.status !== "LIVE").length,
    highRisk: new Set(events.filter((e) => e.aiRiskScore >= 70).map((e) => e.county)).size,
    volatility: Math.round(events.reduce((acc, e) => acc + Math.abs(60 - e.turnout), 0) / Math.max(1, events.length)),
    clusters: events.filter((e) => e.intelligenceSeverity === "MAGENTA").length,
  }), [events]);

  return (
    <div className={`${embedded ? "h-[calc(100svh-8rem)] md:h-[calc(100svh-4rem)] rounded-2xl border border-cyan-300/15" : "h-screen"} bg-black text-white flex flex-col overflow-hidden`}>
      <div className="flex items-center gap-3 border-b border-cyan-950/60 bg-zinc-950/82 px-3 py-2 text-[11px] text-zinc-400">
        <div className="shrink-0 border-r border-cyan-300/15 pr-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">KuraScope EOIS Observatory</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Election Observatory Intelligence System</p>
        </div>
        <div className="grid flex-1 grid-cols-5 gap-2">
          <div>Live anomalies: <span className="text-rose-300">{metrics.anomalies}</span></div>
          <div>Active telemetry: <span className="text-cyan-300">{metrics.active}</span></div>
          <div>High-risk counties: <span className="text-amber-300">{metrics.highRisk}</span></div>
          <div>Turnout volatility: <span className="text-zinc-200">{metrics.volatility}</span></div>
          <div>Propagation clusters: <span className="text-fuchsia-300">{metrics.clusters}</span></div>
        </div>
        <button
          type="button"
          onClick={() => setFocusMode((current) => !current)}
          className={`shrink-0 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em] transition ${focusMode ? "border-cyan-300/70 bg-cyan-400/15 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.14)]" : "border-cyan-500/30 bg-black/35 text-cyan-300 hover:border-cyan-300/60 hover:bg-cyan-400/10"}`}
          aria-pressed={focusMode}
        >
          ⌘ Focus Mode
        </button>
      </div>
      <div className="flex flex-1 gap-2 overflow-hidden bg-black p-2 transition-all duration-300 ease-out">
        <div className={`${focusMode ? "w-0 opacity-0" : "w-64 opacity-100"} shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-out`}><CommandSidebar focusMode={focusMode} /></div>
        <div className="relative min-w-0 flex-1 bg-black transition-all duration-300 ease-out"><IEBCBoundaryMap focusMode={focusMode} /></div>
        <div className={`${focusMode ? "w-0 opacity-0" : telemetryCollapsed ? "w-14 opacity-100" : "w-72 opacity-100"} shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-out`}><TelemetryFeed collapsed={focusMode || telemetryCollapsed} onToggleCollapsed={() => setTelemetryCollapsed((current) => !current)} /></div>
      </div>
      <BottomReplayRail />
    </div>
  );
}
