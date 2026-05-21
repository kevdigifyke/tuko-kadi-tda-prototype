"use client";

import type { PersistenceEdge, PersistenceNode } from "@/src/lib/tda/persistentHomologyEngine";

interface VoidShape { id: string; center: { x: number; y: number }; radius: number; persistence: number }

interface Props {
  nodes: PersistenceNode[];
  edges: PersistenceEdge[];
  voids: VoidShape[];
}

export function TopologyOverlay({ nodes, edges, voids }: Props) {
  const project = (x: number, y: number) => ({ x: 30 + x * 740, y: 20 + y * 300 });

  return <div className="rounded-xl border border-cyan-300/25 bg-[#08131a]/75 p-3">
    <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">Topological Cluster Overlay</p>
    <svg viewBox="0 0 780 340" className="mt-3 h-[250px] w-full rounded-lg border border-cyan-300/20 bg-[#040b10]">
      {edges.filter((e) => e.strength > 0.12).map((edge, idx) => {
        const source = nodes.find((n) => n.id === edge.source);
        const target = nodes.find((n) => n.id === edge.target);
        if (!source || !target) return null;
        const a = project(source.x, source.y);
        const b = project(target.x, target.y);
        return <line key={`${edge.source}-${idx}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#75cfff" strokeOpacity={0.2 + edge.strength * 0.5} strokeWidth={1.2 + edge.strength * 2.4} />;
      })}
      {voids.map((voidShape) => {
        const c = project(voidShape.center.x, voidShape.center.y);
        return <circle key={voidShape.id} cx={c.x} cy={c.y} r={22 + voidShape.radius * 95} fill="none" stroke="#ffbfa2" strokeDasharray="6 7" strokeOpacity={0.4 + voidShape.persistence * 0.4} />;
      })}
      {nodes.map((node) => {
        const p = project(node.x, node.y);
        return <circle key={node.id} cx={p.x} cy={p.y} r={4.2 + (node.weight ?? 0.4) * 8} fill="#9be7ff" fillOpacity={0.6 + (node.sync ?? 0.4) * 0.2} />;
      })}
    </svg>
    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-[#9cc0cd]"><span>Influence corridors</span><span>Topological loops</span><span>Anomaly basins</span><span>Synchronized structures</span></div>
  </div>;
}
