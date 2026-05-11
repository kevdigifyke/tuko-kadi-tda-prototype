"use client";

import { useMemo, useRef, useState } from "react";
import type { ClusterEdge, ClusterNode } from "@/src/types/graph";

interface Props { selectedId: string; onSelect: (id: string) => void; nodes: ClusterNode[]; edges: ClusterEdge[]; }
const project = (x: number, y: number) => ({ x: 800 + x * 260, y: 360 + y * 200 });

export function TdaGraph({ selectedId, onSelect, nodes, edges }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const inspectedId = hoveredId ?? selectedId;
  const inspected = nodes.find((n) => n.id === inspectedId);
  const tooltipStyle = useMemo(() => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return { left: 12, top: 12 };
    const tooltipWidth = 340;
    const left = Math.min(Math.max(cursor.x - bounds.left + 16, 12), bounds.width - tooltipWidth - 12);
    const top = Math.min(Math.max(cursor.y - bounds.top - 26, 12), bounds.height - 240);
    return { left, top };
  }, [cursor.x, cursor.y]);

  return (
    <div ref={containerRef} className="pointer-events-auto absolute inset-0 overflow-hidden bg-[#080f11]" onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_40%,rgba(124,77,255,0.16),transparent_40%),radial-gradient(circle_at_66%_48%,rgba(255,180,171,0.2),transparent_24%),radial-gradient(circle_at_20%_15%,rgba(0,229,255,0.12),transparent_35%),linear-gradient(180deg,rgba(8,15,17,0.15),rgba(8,15,17,0.85))]" />
      <svg viewBox="0 0 1600 900" className="h-full w-full opacity-90 pointer-events-none">
        {edges.map((edge) => { const a = nodes.find((n) => n.id === edge.source)!; const b = nodes.find((n) => n.id === edge.target)!; const p1 = project(a.x, a.y); const p2 = project(b.x, b.y); const edgeBoost = Math.max(a.clusterMass, b.clusterMass) / 100; return <line key={edge.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#2e5f78" strokeWidth={1.3 + edgeBoost * 0.8} strokeOpacity={0.35 + edgeBoost * 0.2} />; })}
        {nodes.map((node) => {
          const p = project(node.x, node.y); const isSelected = node.id === selectedId; const isHovered = node.id === hoveredId;
          const color = node.massLabel === "critical" ? "#ff8a80" : node.type === "anomaly" ? "#ffb4ab" : "#7defff";
          const glowColor = node.massLabel === "critical" ? "rgba(255,100,90,0.7)" : node.type === "anomaly" ? "rgba(255,120,104,0.6)" : node.type === "warning" ? "rgba(255,214,102,0.55)" : "rgba(125,239,255,0.45)";
          const radius = node.visualRadius || node.size * 1.1;
          const glowOpacity = Math.min(0.35, node.glowStrength || 0.16);
          return <g key={node.id} onMouseEnter={() => setHoveredId(node.id)} onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })} onMouseLeave={() => setHoveredId(null)} onClick={() => onSelect(node.id)} className="pointer-events-auto cursor-pointer">
            <circle cx={p.x} cy={p.y} r={radius * 4.9} fill={glowColor} fillOpacity={isHovered || isSelected ? glowOpacity + 0.08 : glowOpacity} />
            <circle cx={p.x} cy={p.y} r={radius * 3.5} fill={color} fillOpacity={node.type === "anomaly" ? 0.21 : 0.11} />
            <circle cx={p.x} cy={p.y} r={radius * 1.28} fill={color} fillOpacity={0.95} />
            {isHovered && <circle cx={p.x} cy={p.y} r={radius * 5} fill="none" stroke="#7defff" strokeWidth={2.4} />}
            {isSelected && <circle cx={p.x} cy={p.y} r={radius * 5.8} fill="none" stroke="#ffb4ab" strokeDasharray="4 6" strokeWidth={2.2} />}
          </g>;
        })}
      </svg>
      {inspected && (
        <div className={`pointer-events-none absolute z-30 w-[340px] rounded-md border bg-[#151d1e]/95 p-3 backdrop-blur ${inspected.type === "anomaly" ? "border-[#ff8a80]/70" : "border-cyan-300/60"}`} style={tooltipStyle}>
          <p className="font-mono text-[11px] uppercase tracking-wide text-[#8fa6ad]">Cluster {inspected.label}</p>
          <p className="mt-1 text-xs text-[#dce4e5]">Cluster Mass: {inspected.clusterMass} / {inspected.massLabel[0].toUpperCase() + inspected.massLabel.slice(1)} gravity</p>
          <p className="mt-1 text-xs text-[#bac9cc]">{inspected.gravityReason}</p>
          <p className="mt-1 text-xs text-[#dce4e5]">Risk {inspected.riskLevel} • Severity {inspected.severity}% • Confidence {inspected.confidence}%</p>
          <p className="mt-1 text-xs text-[#bac9cc]">Affected stations {inspected.stations || 1} • Affected wards {inspected.wards || 1}</p>
          <p className="mt-1 text-xs text-[#bac9cc]">Primary issue: {inspected.primaryIssue || "Synthetic cluster"}</p>
          <p className="mt-2 font-mono text-[11px] text-cyan-200">Click to inspect</p>
        </div>
      )}
    </div>
  );
}
