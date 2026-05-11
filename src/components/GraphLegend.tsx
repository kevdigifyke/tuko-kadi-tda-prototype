import type { TopologyMode } from "@/src/lib/topologyLayouts";
import type { ClusterNode } from "@/src/types/graph";

export function GraphLegend({ mode, gravityCenter }: { mode: TopologyMode; gravityCenter?: ClusterNode }) {
  return (
    <div className="rounded border border-white/20 bg-[#151d1e]/90 p-3 text-xs text-[#bac9cc]">
      <p className="panel-kicker text-cyan-200">Graph Legend / Visual Language</p>
      <p className="mt-1">Node size = cluster mass with affected station weight.</p>
      <p>Glow strength = severity and review priority.</p>
      <p>Gravity center = highest-mass anomaly cluster in Centralized mode.</p>
      <p className="mt-1 text-[#dce4e5]">Topology: {mode}</p>
      {gravityCenter && <p className="text-[#ffdad6]">Gravity center: {gravityCenter.label} • Mass {gravityCenter.clusterMass}</p>}
    </div>
  );
}
