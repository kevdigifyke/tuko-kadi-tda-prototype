"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import TelemetryFeed from "./TelemetryFeed";
import CommandSidebar from "./CommandSidebar";
import BottomReplayRail from "./BottomReplayRail";
import { useSimulationStore } from "@/src/store/useSimulationStore";

const IEBCBoundaryMap = dynamic(() => import("../maps/IEBCBoundaryMap"), { ssr: false });

export default function NationalCommandCenter({ embedded = false }: { embedded?: boolean }) {
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
      <div className="grid grid-cols-5 gap-2 border-b border-cyan-950/60 bg-zinc-950/82 px-3 py-2 text-[11px] text-zinc-400">
        <div>Live anomalies: <span className="text-rose-300">{metrics.anomalies}</span></div>
        <div>Active telemetry: <span className="text-cyan-300">{metrics.active}</span></div>
        <div>High-risk counties: <span className="text-amber-300">{metrics.highRisk}</span></div>
        <div>Turnout volatility: <span className="text-zinc-200">{metrics.volatility}</span></div>
        <div>Propagation clusters: <span className="text-fuchsia-300">{metrics.clusters}</span></div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 shrink-0"><CommandSidebar /></div>
        <div className="relative flex-1 bg-black"><IEBCBoundaryMap /></div>
        <div className="w-72 shrink-0"><TelemetryFeed /></div>
      </div>
      <BottomReplayRail />
    </div>
  );
}
