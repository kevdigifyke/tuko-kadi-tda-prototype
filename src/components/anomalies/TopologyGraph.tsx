"use client";

import { buildTopologyLayout, type TopologyMode } from "@/src/lib/topologyModes";
import type { ClusterEdge, ClusterNode } from "@/src/types/graph";
import { useEffect, useMemo, useRef, useState } from "react";

interface Props { selectedId: string; onSelect: (id: string) => void; nodes: ClusterNode[]; edges: ClusterEdge[]; topologyMode: TopologyMode; }
const project = (x: number, y: number) => ({ x: 800 + x * 400, y: 450 + y * 300 });

export function TopologyGraph({ selectedId, onSelect, nodes, edges, topologyMode }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const targetRef = useRef<Record<string, { x: number; y: number }>>({});

  const index = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  useEffect(() => { targetRef.current = buildTopologyLayout(nodes, edges, topologyMode); }, [nodes, edges, topologyMode]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setPositions((prev) => {
        const next = { ...prev };
        for (const n of nodes) {
          const target = targetRef.current[n.id] ?? { x: n.x, y: n.y };
          const current = prev[n.id] ?? { x: n.x, y: n.y };
          next[n.id] = { x: current.x + (target.x - current.x) * 0.08, y: current.y + (target.y - current.y) * 0.08 };
        }
        return next;
      });
      targetRef.current = buildTopologyLayout(nodes, edges, topologyMode);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [nodes, edges, topologyMode]);

  return <div className="absolute inset-0 overflow-hidden bg-[#080f11]"><svg viewBox="0 0 1600 900" className="h-full w-full">
    {edges.map((edge) => { const a = positions[edge.source]; const b = positions[edge.target]; if (!a || !b) return null; const p1 = project(a.x, a.y); const p2 = project(b.x, b.y); const mx = (p1.x + p2.x) / 2; const my = (p1.y + p2.y) / 2 - 24; return <path key={edge.id} d={`M${p1.x},${p1.y} Q${mx},${my} ${p2.x},${p2.y}`} stroke="#3f6e84" strokeWidth={1} strokeOpacity={0.32} fill="none" />; })}
    {nodes.map((node) => { const pos = positions[node.id]; if (!pos) return null; const p = project(pos.x, pos.y); const selected = node.id===selectedId; const hovered = node.id===hoveredId; const dim = selectedId && !selected && !hovered ? 0.5 : 1; const color = node.type === "anomaly" ? "#ff9387" : "#76e9ff"; return <g key={node.id} className="cursor-pointer" onMouseEnter={()=>setHoveredId(node.id)} onMouseLeave={()=>setHoveredId(null)} onClick={()=>onSelect(node.id)}>
      <circle cx={p.x} cy={p.y} r={node.size * 3.8} fill={color} fillOpacity={(hovered||selected?0.12:0.06)*dim} />
      <circle cx={p.x} cy={p.y} r={node.size * 1.2} fill={color} fillOpacity={0.9*dim} />
      {selected && <circle cx={p.x} cy={p.y} r={node.size*4.5} stroke="#ffb4ab" strokeDasharray="4 6" fill="none" />}
    </g>; })}
  </svg>
  <div className="pointer-events-none absolute bottom-4 right-4 z-20 w-56 rounded-lg border border-cyan-300/30 bg-[#0c1214]/70 p-3 text-xs text-[#c8d5d9] backdrop-blur">
    <p className="font-semibold text-cyan-100">Legend</p><p><span className="text-cyan-200">Blue</span> = stable clusters</p><p><span className="text-rose-200">Red</span> = high-risk clusters</p><p>Larger node = more affected stations</p><p>Glow = anomaly severity</p><p>Brighter edge = stronger relationship</p><p>Dashed ring = inspected cluster</p>
  </div></div>;
}
