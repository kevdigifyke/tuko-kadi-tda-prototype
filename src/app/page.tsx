"use client";

import { useEffect, useMemo, useState } from "react";
import { TopHud } from "@/src/components/TopHud";
import { GesturePanel } from "@/src/components/GesturePanel";
import { TdaGraph } from "@/src/components/TdaGraph";
import { EvidencePanel } from "@/src/components/EvidencePanel";
import { TimelineScrubber } from "@/src/components/TimelineScrubber";
import { mockNodes } from "@/src/data/mockGraph";

export default function Home() {
  const [selectedId, setSelectedId] = useState("ne-04");
  const [mode, setMode] = useState("Forensic Cluster View");
  const [isPlaying, setIsPlaying] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const selectedCluster = useMemo(() => mockNodes.find((n) => n.id === selectedId) ?? mockNodes[0], [selectedId]);
  const anomalyCount = useMemo(() => mockNodes.filter((n) => n.type === "anomaly").length, []);

  useEffect(() => {
    const syncClock = () => setLastUpdated(new Date().toLocaleTimeString());
    syncClock();
    const interval = setInterval(syncClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      if (event.key === "r" || event.key === "R") {
        setSelectedId("ne-04");
        setMode("Forensic Cluster View");
      }
      if (event.key === "1") setMode("Live Pulse");
      if (event.key === "2") setMode("Forensic Cluster View");
      if (event.key === "3") setMode("Time Machine");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0F14] p-4 text-slate-100">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <TopHud mode={mode} anomalies={anomalyCount} lastUpdated={lastUpdated} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr_350px]">
          <GesturePanel />
          <section className="panel-glow min-h-[520px] rounded-2xl border border-cyan-400/20 bg-[#121922] p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#00E5FF]">TDA Forensic Graph</h2>
            <div className="h-[460px] rounded-xl border border-slate-700">
              <TdaGraph selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </section>
          <EvidencePanel cluster={selectedCluster} />
        </div>
        <TimelineScrubber isPlaying={isPlaying} onToggle={() => setIsPlaying((s) => !s)} />
        <div className="fixed bottom-4 right-4 rounded-lg border border-slate-700 bg-[#121922]/95 p-3 text-xs text-slate-300">
          <p className="mb-1 text-[#00E5FF]">Demo Shortcuts</p>
          <p>Space = Play/Pause</p><p>R = Reset View</p><p>1 = Live Pulse</p><p>2 = Forensic Cluster</p><p>3 = Time Machine</p>
        </div>
      </div>
    </main>
  );
}
