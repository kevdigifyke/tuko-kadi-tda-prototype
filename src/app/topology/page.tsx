"use client";

import { AppShell } from "@/src/components/shell/AppShell";
import { TopologyOverlay } from "@/src/components/maps/TopologyOverlay";
import { TopologyAnalysisPanel } from "@/src/components/tda/TopologyAnalysisPanel";
import { PersistenceBarcode } from "@/src/components/tda/PersistenceBarcode";
import { buildBettiFeatures, buildPersistenceGraph, calculatePersistence, detectTopologicalVoids, type PersistenceNode } from "@/src/lib/tda/persistentHomologyEngine";
import { useEffect, useMemo, useState } from "react";

const syntheticNodes: PersistenceNode[] = [
  { id: "nairobi", x: 0.62, y: 0.54, weight: 0.82, sync: 0.75 },
  { id: "kisumu", x: 0.2, y: 0.5, weight: 0.66, sync: 0.6 },
  { id: "mombasa", x: 0.7, y: 0.82, weight: 0.58, sync: 0.72 },
  { id: "nakuru", x: 0.45, y: 0.45, weight: 0.74, sync: 0.77 },
  { id: "eldoret", x: 0.38, y: 0.33, weight: 0.63, sync: 0.55 },
  { id: "garissa", x: 0.86, y: 0.37, weight: 0.5, sync: 0.49 },
  { id: "turkana", x: 0.12, y: 0.22, weight: 0.44, sync: 0.4 },
  { id: "meru", x: 0.64, y: 0.4, weight: 0.57, sync: 0.68 },
  { id: "machakos", x: 0.57, y: 0.66, weight: 0.68, sync: 0.7 },
];

export default function TopologyPage() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setPhase((p) => (p + 1) % 240), 120);
    return () => window.clearInterval(timer);
  }, []);

  const threshold = 0.26 + ((Math.sin(phase / 22) + 1) / 2) * 0.2;

  const model = useMemo(() => {
    const graph = buildPersistenceGraph(syntheticNodes, threshold);
    const intervals = calculatePersistence(graph);
    const voids = detectTopologicalVoids(syntheticNodes, intervals);
    const betti = buildBettiFeatures(intervals);
    return { graph, intervals, voids, betti };
  }, [threshold]);

  return (
    <AppShell>
      <section className="min-h-[calc(100svh-120px)] rounded-2xl border border-cyan-300/20 bg-[radial-gradient(circle_at_30%_18%,rgba(42,125,167,0.25),transparent_40%),radial-gradient(circle_at_70%_65%,rgba(162,108,255,0.2),transparent_35%),#040b10] p-4 md:p-6">
        <header className="mb-4 rounded-xl border border-cyan-300/25 bg-[#0a131a]/80 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">Persistent Homology Intelligence Engine</p>
          <h1 className="mt-2 text-xl font-semibold text-cyan-50">National Election Topology Intelligence</h1>
          <p className="mt-1 text-sm text-[#b3cdd8]">Animated replay: anomaly emergence, persistence evolution, and cluster collapse dynamics.</p>
        </header>

        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <PersistenceBarcode intervals={model.intervals} />
            <div className="rounded-xl border border-cyan-300/25 bg-[#08131a]/70 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">Persistence Landscape</p>
              <svg viewBox="0 0 900 230" className="mt-3 h-[210px] w-full rounded bg-[#040b10]">
                {[0, 1, 2].map((layer) => {
                  const points = model.intervals.slice(layer, layer + 8).map((interval, idx) => {
                    const x = 50 + idx * 98;
                    const y = 180 - interval.persistence * (130 - layer * 20);
                    return `${x},${y}`;
                  });
                  return <polyline key={layer} points={points.join(" ")} fill="none" stroke={layer === 0 ? "#8eeaff" : layer === 1 ? "#7ba8ff" : "#ffb88a"} strokeOpacity={0.8 - layer * 0.2} strokeWidth={2.8 - layer * 0.5} />;
                })}
              </svg>
            </div>
            <TopologyOverlay nodes={model.graph.nodes} edges={model.graph.edges} voids={model.voids} />
          </div>

          <TopologyAnalysisPanel {...model.betti} />
        </div>
      </section>
    </AppShell>
  );
}
