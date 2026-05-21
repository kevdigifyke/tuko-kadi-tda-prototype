"use client";

interface Props {
  betti0: number;
  betti1: number;
  persistenceStrength: number;
  spatialEntropy: number;
  clusterDurability: number;
}

export function TopologyAnalysisPanel({ betti0, betti1, persistenceStrength, spatialEntropy, clusterDurability }: Props) {
  const rows = [
    ["Betti-0", String(betti0)],
    ["Betti-1", String(betti1)],
    ["Persistence Strength", persistenceStrength.toFixed(3)],
    ["Spatial Entropy", spatialEntropy.toFixed(3)],
    ["Cluster Durability", clusterDurability.toFixed(3)],
  ];

  return <aside className="rounded-xl border border-cyan-300/30 bg-[#0a141b]/80 p-4 backdrop-blur">
    <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">Topology Analysis</p>
    <div className="mt-3 space-y-2">
      {rows.map(([label, value]) => <div key={label} className="flex items-center justify-between rounded border border-cyan-300/20 bg-black/20 px-3 py-2 text-sm"><span className="text-[#9ab9c6]">{label}</span><span className="font-mono text-cyan-100">{value}</span></div>)}
    </div>
  </aside>;
}
