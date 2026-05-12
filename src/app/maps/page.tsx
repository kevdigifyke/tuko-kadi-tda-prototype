"use client";

import { AppShell } from "@/src/components/shell/AppShell";
import mapIntel from "@/src/data/generated/map-intelligence.json";
import { useEffect, useMemo, useState } from "react";

type ModeKey = "results" | "turnout" | "anomaly" | "disagreement" | "temporal";

const MODE_OPTIONS: { key: ModeKey; label: string }[] = [
  { key: "results", label: "Results" },
  { key: "turnout", label: "Turnout" },
  { key: "anomaly", label: "Anomaly" },
  { key: "disagreement", label: "Disagreement" },
  { key: "temporal", label: "Temporal" },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export default function Maps() {
  const [mode, setMode] = useState<ModeKey>("anomaly");
  const [timeIndex, setTimeIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedRegionId, setSelectedRegionId] = useState(mapIntel.regions[0]?.id ?? "");
  const [selectedClusterId, setSelectedClusterId] = useState(mapIntel.clusters[0]?.id ?? "");
  const [zoomLevel, setZoomLevel] = useState(1);

  const activeTime = mapIntel.timeSlices[timeIndex]?.id ?? mapIntel.timeSlices[0].id;
  const selectedRegion = useMemo(() => mapIntel.regions.find((r) => r.id === selectedRegionId) ?? mapIntel.regions[0], [selectedRegionId]);
  const selectedCluster = useMemo(() => mapIntel.clusters.find((c) => c.id === selectedClusterId) ?? mapIntel.clusters[0], [selectedClusterId]);

  const regionSnapshot = (regionId: string) => mapIntel.regions.find((r) => r.id === regionId)?.snapshots.find((s) => s.time === activeTime);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => setTimeIndex((v) => (v + 1) % mapIntel.timeSlices.length), 1400);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const linkedRegionIds = useMemo(() => {
    if (!selectedCluster) return new Set<string>();
    return new Set(selectedCluster.regionIds);
  }, [selectedCluster]);

  const linkedClusterIds = useMemo(() => {
    if (!selectedRegion) return new Set<string>();
    return new Set(selectedRegion.connectedClusters);
  }, [selectedRegion]);

  const mapFill = (regionId: string) => {
    const snapshot = regionSnapshot(regionId);
    if (!snapshot) return "rgba(111, 132, 141, 0.5)";
    if (mode === "results") return mapIntel.partyPalette[snapshot.winnerParty as keyof typeof mapIntel.partyPalette] ?? "#7b92a3";
    if (mode === "turnout") return `rgba(84, 191, 255, ${clamp(snapshot.turnout / 100, 0.15, 0.85)})`;
    if (mode === "disagreement") return `rgba(255, 132, 132, ${clamp(snapshot.disagreement, 0.2, 0.95)})`;
    return `rgba(255, 194, 82, ${clamp(snapshot.anomalySeverity, 0.2, 0.95)})`;
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-display">Map Intelligence Layer</h1>
          <p className="text-xs text-[#aebdc3]">Synthetic regional intelligence map. Not official IEBC GIS.</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,#13303a_0%,#090f14_45%,#06090c_100%)] p-3">
            <div className="pointer-events-auto absolute left-3 top-3 z-20 inline-flex rounded-2xl border border-white/10 bg-[#0d1a20]/80 p-1 backdrop-blur">
              {MODE_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setMode(option.key)}
                  className={`rounded-xl px-3 py-1.5 text-xs transition ${mode === option.key ? "bg-cyan-300/20 text-cyan-100" : "text-[#9fb4bb]"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="pointer-events-auto absolute right-3 top-3 z-20 grid gap-2">
              <button onClick={() => setZoomLevel((z) => clamp(z + 0.15, 1, 2.1))} className="rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm">+</button>
              <button onClick={() => setZoomLevel((z) => clamp(z - 0.15, 0.7, 2.1))} className="rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm">−</button>
            </div>

            <div className="h-[580px] overflow-hidden rounded-xl border border-white/10 bg-black/35">
              <svg viewBox="0 0 800 500" className="h-full w-full transition-transform duration-500" style={{ transform: `scale(${zoomLevel})` }}>
                <defs>
                  <filter id="glow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {mapIntel.regions.map((region) => {
                  const isSelected = selectedRegionId === region.id;
                  const isLinked = linkedRegionIds.has(region.id);
                  return (
                    <path
                      key={region.id}
                      d={region.geometry}
                      onClick={() => {
                        setSelectedRegionId(region.id);
                        const firstCluster = region.connectedClusters[0];
                        if (firstCluster) setSelectedClusterId(firstCluster);
                      }}
                      fill={mapFill(region.id)}
                      stroke={isSelected ? "#d6f8ff" : isLinked ? "#93f5ff" : "#27434f"}
                      strokeWidth={isSelected ? 4 : isLinked ? 3 : 2}
                      filter={(mode === "anomaly" || mode === "temporal") && isLinked ? "url(#glow)" : undefined}
                      className="cursor-pointer transition-all duration-500"
                    />
                  );
                })}
                {mode === "anomaly" && mapIntel.regions.map((region, idx) => {
                  const snapshot = regionSnapshot(region.id);
                  if (!snapshot) return null;
                  const alpha = clamp(snapshot.anomalySeverity, 0.2, 0.9);
                  return <circle key={region.id} cx={220 + idx * 180} cy={240 + (idx % 2) * 65} r={30 + snapshot.anomalySeverity * 25} fill={`rgba(255,120,55,${alpha * 0.25})`} className="animate-pulse" />;
                })}
              </svg>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-black/35 p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-[#aec0c8]">
                <span>Temporal replay</span>
                <button onClick={() => setIsPlaying((v) => !v)} className="rounded-md border border-white/15 px-2 py-1 text-[11px]">{isPlaying ? "Pause" : "Play"}</button>
              </div>
              <input type="range" min={0} max={mapIntel.timeSlices.length - 1} step={1} value={timeIndex} onChange={(e) => setTimeIndex(Number(e.target.value))} className="w-full" />
              <div className="mt-2 flex justify-between text-[11px] text-[#8ea1a8]">{mapIntel.timeSlices.map((slice) => <span key={slice.id}>{slice.label}</span>)}</div>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/75">Intelligence Panel</p>
              <h2 className="mt-2 text-lg font-semibold">{selectedRegion.name}</h2>
              <p className="text-sm text-[#9fb1b9]">{selectedRegion.constituencies.join(" • ")}</p>
              {(() => {
                const snapshot = selectedRegion.snapshots.find((s) => s.time === activeTime) ?? selectedRegion.snapshots[0];
                return (
                  <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="text-[#8ea2a9]">Turnout</dt><dd className="text-cyan-100">{snapshot.turnout}%</dd></div>
                    <div><dt className="text-[#8ea2a9]">Leader</dt><dd>{snapshot.winnerParty}</dd></div>
                    <div><dt className="text-[#8ea2a9]">Anomaly Severity</dt><dd>{Math.round(snapshot.anomalySeverity * 100)}%</dd></div>
                    <div><dt className="text-[#8ea2a9]">Mismatch Intensity</dt><dd>{Math.round(snapshot.disagreement * 100)}%</dd></div>
                    <div><dt className="text-[#8ea2a9]">Affected Stations</dt><dd>{selectedRegion.pollingStationsAffected}</dd></div>
                    <div><dt className="text-[#8ea2a9]">Connected Clusters</dt><dd>{selectedRegion.connectedClusters.length}</dd></div>
                  </dl>
                );
              })()}
              <p className="mt-3 text-xs text-[#a8bac1]">{selectedRegion.reviewerNotes}</p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/75">Graph Cluster Links</p>
              <div className="mt-3 space-y-2">
                {mapIntel.clusters.map((cluster) => {
                  const active = selectedClusterId === cluster.id;
                  const linked = linkedClusterIds.has(cluster.id);
                  return (
                    <button
                      key={cluster.id}
                      onClick={() => {
                        setSelectedClusterId(cluster.id);
                        const firstRegion = cluster.regionIds[0];
                        if (firstRegion) setSelectedRegionId(firstRegion);
                      }}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${active ? "border-cyan-300/60 bg-cyan-300/15" : linked ? "border-amber-200/40 bg-amber-200/10" : "border-white/10 bg-black/20"}`}
                    >
                      <div className="flex items-center justify-between"><span>{cluster.label}</span><span className="text-xs text-[#9cb2b9]">{Math.round(cluster.severity * 100)}%</span></div>
                      <p className="mt-1 text-xs text-[#89a0a8]">{cluster.regionIds.join(" • ")}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
