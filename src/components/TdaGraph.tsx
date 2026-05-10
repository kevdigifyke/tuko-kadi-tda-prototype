"use client";

import { useState } from "react";
import type { ClusterEdge, ClusterNode } from "@/src/types/graph";

interface Props { selectedId: string; onSelect: (id: string) => void; nodes: ClusterNode[]; edges: ClusterEdge[]; }
const project = (x: number, y: number) => ({ x: 800 + x * 260, y: 360 + y * 200 });

export function TdaGraph({ selectedId, onSelect, nodes, edges }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const inspectedId = hoveredId ?? selectedId;
  const inspected = nodes.find((n) => n.id === inspectedId);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#080f11]" onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_40%,rgba(124,77,255,0.16),transparent_40%),radial-gradient(circle_at_66%_48%,rgba(255,180,171,0.2),transparent_24%),radial-gradient(circle_at_20%_15%,rgba(0,229,255,0.12),transparent_35%),linear-gradient(180deg,rgba(8,15,17,0.15),rgba(8,15,17,0.85))]" />
      <svg viewBox="0 0 1600 900" className="h-full w-full opacity-90">
        {edges.map((edge) => { const a = nodes.find((n) => n.id === edge.source)!; const b = nodes.find((n) => n.id === edge.target)!; const p1 = project(a.x, a.y); const p2 = project(b.x, b.y); return <line key={edge.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#2e5f78" strokeWidth={1.5} strokeOpacity={0.45} />; })}
        {nodes.map((node) => {
          const p = project(node.x, node.y); const isSelected = node.id === selectedId; const isHovered = node.id === hoveredId;
          const color = node.type === "anomaly" ? "#ffb4ab" : "#7defff";
          const glow = node.type === "anomaly" ? "rgba(255,120,104,0.6)" : node.type === "warning" ? "rgba(255,214,102,0.55)" : "rgba(125,239,255,0.45)";
          return <g key={node.id} onMouseEnter={() => setHoveredId(node.id)} onMouseLeave={() => setHoveredId(null)} onClick={() => onSelect(node.id)} className="cursor-pointer">
            <circle cx={p.x} cy={p.y} r={node.size * 4.8} fill={glow} fillOpacity={isHovered || isSelected ? 0.18 : 0.08} />
            <circle cx={p.x} cy={p.y} r={node.size * 3.5} fill={color} fillOpacity={node.type === "anomaly" ? 0.18 : 0.09} />
            <circle cx={p.x} cy={p.y} r={node.size * 1.25} fill={color} fillOpacity={0.95} />
            {isHovered && <circle cx={p.x} cy={p.y} r={node.size * 4.3} fill="none" stroke="#7defff" strokeWidth={2} />}
            {isSelected && <circle cx={p.x} cy={p.y} r={node.size * 5.2} fill="none" stroke="#ffb4ab" strokeDasharray="4 6" />}
          </g>;
        })}
      </svg>
      {inspected && (
        <div className={`pointer-events-none fixed z-30 w-[280px] rounded-md border bg-[#151d1e]/95 p-3 backdrop-blur ${inspected.type === "anomaly" ? "border-[#ff8a80]/70" : "border-cyan-300/60"}`} style={{ left: Math.min(cursor.x + 16, (typeof window === "undefined" ? 1280 : window.innerWidth) - 300), top: Math.max(12, cursor.y - 24) }}>
          <p className="font-mono text-xs text-[#8fa6ad]">{inspected.label}</p>
          <p className="mt-1 text-xs text-[#dce4e5]">Risk {inspected.riskLevel} • Severity {inspected.severity}% • Confidence {inspected.confidence}%</p>
          <p className="mt-1 text-xs text-[#bac9cc]">Affected stations {inspected.stations} • wards {inspected.wards}</p>
          <p className="mt-1 text-xs text-[#bac9cc]">Primary issue: {inspected.primaryIssue}</p>
          <p className="mt-1 text-xs text-[#bac9cc]">Top class: {inspected.issue}</p>
          <p className="mt-1 text-xs text-[#bac9cc]">{inspected.explanation}</p>
          <p className="mt-2 font-mono text-[11px] text-cyan-200">Click to inspect</p>
        </div>
      )}
    </div>
  );
}
