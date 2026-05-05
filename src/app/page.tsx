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
    <main className="min-h-screen p-4 text-[#dce4e5] sm:p-5">
      <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-4">
        <TopHud mode={mode} anomalies={anomalyCount} lastUpdated={lastUpdated} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[340px_1fr_370px]">
          <GesturePanel />
          <section className="panel-glow min-h-[560px] rounded-2xl border border-cyan-400/20 bg-[#121922] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-tech text-sm font-semibold uppercase tracking-[0.14em] text-[#00e5ff]">TDA Forensic Graph</h2>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="rounded-md border border-cyan-400/25 bg-cyan-500/10 px-2 py-1 text-[#8af1ff]">Nodes: {mockNodes.length}</span>
                <span className="rounded-md border border-red-400/25 bg-red-500/10 px-2 py-1 text-[#ff8a65]">Alerts: {anomalyCount}</span>
                <span className="rounded-md border border-purple-400/25 bg-purple-500/10 px-2 py-1 text-[#c2a7ff]">Mode: {mode}</span>
              </div>
            </div>
            <div className="h-[500px] rounded-xl border border-slate-700/80 bg-[#080f11] p-2">
              <TdaGraph selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </section>
          <EvidencePanel cluster={selectedCluster} />
        </div>
        <TimelineScrubber isPlaying={isPlaying} onToggle={() => setIsPlaying((s) => !s)} />
        <div className="fixed bottom-4 right-4 z-20 rounded-xl border border-slate-600 bg-[#121922]/95 p-3 text-xs text-[#bac9cc] shadow-[0_8px_24px_rgba(8,15,17,0.45)] backdrop-blur">
          <p className="font-tech mb-1 text-[#00e5ff]">Demo Shortcuts</p>
          <p>Space · Play/Pause</p><p>R · Reset View</p><p>1 · Live Pulse</p><p>2 · Forensic Cluster</p><p>3 · Time Machine</p>
        </div>
      </div>
    </main>
  );
}
