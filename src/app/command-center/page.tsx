"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { CommandHeader } from "@/src/components/command/CommandHeader";
import { CommandSidebar } from "@/src/components/command/CommandSidebar";
import { ElectionMetricsGrid } from "@/src/components/command/ElectionMetricsGrid";
import { IntelligenceFeed } from "@/src/components/command/IntelligenceFeed";
import { CountyRiskTable } from "@/src/components/command/CountyRiskTable";
import { ReplayControlPanel } from "@/src/components/command/ReplayControlPanel";
import { TelemetryPanel } from "@/src/components/command/TelemetryPanel";
import { AlertConsole } from "@/src/components/command/AlertConsole";
import { SystemHealthPanel } from "@/src/components/command/SystemHealthPanel";
import { buildNationalDashboardMetrics } from "@/src/lib/metrics/nationalMetricsEngine";
import { createLiveIntelligenceEvent, seedLiveIntelligenceFeed } from "@/src/lib/intelligence/liveIntelligenceFeed";
import { generateSystemHealthSnapshot } from "@/src/lib/system/systemHealthEngine";

const IEBCBoundaryMap = dynamic(() => import("@/src/components/maps/IEBCBoundaryMap"), { ssr: false });

export default function CommandCenterPage() {
  const [events, setEvents] = useState(seedLiveIntelligenceFeed(10));
  const [speed, setSpeed] = useState(1.5);
  const [phase, setPhase] = useState(0.5);
  const [playing, setPlaying] = useState(true);
  const [futureMode, setFutureMode] = useState(false);

  const metrics = useMemo(() => buildNationalDashboardMetrics(Date.now() / 26000 + phase), [phase, events]);
  const health = useMemo(() => generateSystemHealthSnapshot(Date.now() / 20000 + phase), [phase, events]);

  useEffect(() => {
    const timer = window.setInterval(() => setEvents((prev) => [...prev.slice(-29), createLiveIntelligenceEvent()]), 4000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setPhase((v) => (v + 0.01 * speed) % 1), 180);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  return <main className="min-h-screen bg-[#050b12] bg-[radial-gradient(circle_at_12%_18%,rgba(18,102,122,.26),transparent_38%),radial-gradient(circle_at_80%_8%,rgba(130,84,12,.2),transparent_35%)] p-4 text-white">
    <div className="mx-auto grid max-w-[1800px] gap-4 xl:grid-cols-[230px_minmax(0,1fr)]">
      <CommandSidebar />
      <section className="space-y-4">
        <CommandHeader />
        <ElectionMetricsGrid metrics={metrics} />
        <div className="grid gap-4 xl:grid-cols-3"><div className="xl:col-span-2"><IEBCBoundaryMap mode="command" /></div><TelemetryPanel anomalyCount={metrics.totalAnomalyCount} /></div>
        <ReplayControlPanel playing={playing} speed={speed} phase={phase} futureMode={futureMode} onTogglePlay={() => setPlaying((v) => !v)} onFuture={() => setFutureMode((v) => !v)} onSpeed={setSpeed} onPhase={setPhase} />
        <div className="grid gap-4 xl:grid-cols-3"><div className="xl:col-span-2"><CountyRiskTable rows={metrics.countyVolatilityScores} /></div><SystemHealthPanel health={health} /></div>
        <div className="grid gap-4 xl:grid-cols-2"><IntelligenceFeed events={events} /><AlertConsole events={events} /></div>
      </section>
    </div>
  </main>;
}
