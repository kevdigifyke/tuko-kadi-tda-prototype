"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FlowFieldLayer } from "@/src/components/FlowFieldLayer";
import type { ClusterEdge, ClusterNode } from "@/src/types/graph";

interface Props { selectedId: string; onSelect: (id: string) => void; nodes: ClusterNode[]; edges: ClusterEdge[]; topologyMode: "centralized" | "decentralized" | "distributed"; }
const project = (x: number, y: number) => ({ x: 800 + x * 260, y: 360 + y * 200 });

export function TdaGraph({ selectedId, onSelect, nodes, edges, topologyMode }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inspectedId = hoveredId ?? selectedId;
  const inspected = nodes.find((n) => n.id === inspectedId);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 768px)");
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const tooltipStyle = useMemo(() => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return { left: 12, top: 12 };
    const tooltipWidth = 320;
    const left = Math.min(Math.max(cursor.x - bounds.left + 16, 12), bounds.width - tooltipWidth - 12);
    const top = Math.min(Math.max(cursor.y - bounds.top - 26, 12), bounds.height - 190);
    return { left, top };
  }, [cursor.x, cursor.y]);

  return (
    <div ref={containerRef} className="pointer-events-auto absolute inset-0 overflow-hidden bg-[#080f11]" onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}>
      <FlowFieldLayer nodes={nodes} edges={edges} topologyMode={topologyMode} motionScale={reducedMotion ? 0.45 : 1} reducedMotion={reducedMotion} />
      <svg viewBox="0 0 1600 900" className="h-full w-full opacity-90 pointer-events-none">
        {edges.map((edge) => {
          const a = nodes.find((n) => n.id === edge.source)!;
          const b = nodes.find((n) => n.id === edge.target)!;
          const p1 = project(a.x, a.y);
          const p2 = project(b.x, b.y);
          const severity = Math.max(a.severity, b.severity);
          const stroke = severity >= 85 ? "#ff8e7a" : severity >= 65 ? "#ffd68f" : "#56b9d6";
          const edgeEnergy = Math.min(0.75, 0.2 + edge.weight * 0.45);
          return (
            <line
              key={edge.id}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={stroke}
              strokeWidth={1.1 + edge.weight * 1.6}
              strokeOpacity={edgeEnergy}
              style={
                reducedMotion
                  ? undefined
                  : {
                      animation: `edgeShimmer ${(topologyMode === "distributed" ? 5 : 8) + (1 - edge.weight) * 5}s ease-in-out infinite`,
                    }
              }
            />
          );
        })}
        {nodes.map((node, index) => {
          const p = project(node.x, node.y); const isSelected = node.id === selectedId; const isHovered = node.id === hoveredId;
          const color = node.severity >= 85 ? "#ff8a80" : node.severity >= 65 ? "#ffd78f" : "#7defff";
          const glow = node.severity >= 85 ? "rgba(255,120,104,0.62)" : node.severity >= 65 ? "rgba(255,214,102,0.58)" : "rgba(125,239,255,0.46)";
          const recencyPulse = node.timelineEvents.length > 2 ? 0.35 : 0;
          const pulseSpeed = Math.max(3.5, 9 - node.size * 0.2 - recencyPulse * 3);
          const pulseOpacity = 0.06 + node.size * 0.012 + node.severity / 1000;
          return <g key={node.id} onMouseEnter={() => setHoveredId(node.id)} onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })} onMouseLeave={() => setHoveredId(null)} onClick={() => onSelect(node.id)} className="pointer-events-auto cursor-pointer">
            <circle cx={p.x} cy={p.y} r={node.size * 5.1} fill={glow} fillOpacity={isHovered || isSelected ? 0.2 : pulseOpacity} style={reducedMotion ? undefined : { animation: `nodePulse ${pulseSpeed}s ease-in-out infinite`, animationDelay: `${(index % 6) * -0.8}s` }} />
            <circle cx={p.x} cy={p.y} r={node.size * 3.5} fill={color} fillOpacity={node.type === "anomaly" ? 0.2 : 0.1} />
            <circle cx={p.x} cy={p.y} r={node.size * 1.25} fill={color} fillOpacity={0.95} />
            {isHovered && <circle cx={p.x} cy={p.y} r={node.size * 4.6} fill="none" stroke="#7defff" strokeWidth={2.4} />}
            {isSelected && <circle cx={p.x} cy={p.y} r={node.size * 5.4} fill="none" stroke="#ffb4ab" strokeDasharray="4 6" strokeWidth={2.2} />}
          </g>;
        })}
      </svg>
      {inspected && (
        <div className={`pointer-events-none absolute z-30 w-[320px] rounded-md border bg-[#151d1e]/95 p-3 backdrop-blur ${inspected.type === "anomaly" ? "border-[#ff8a80]/70" : "border-cyan-300/60"}`} style={tooltipStyle}>
          <p className="font-mono text-[11px] uppercase tracking-wide text-[#8fa6ad]">Cluster {inspected.label}</p>
          <p className="mt-1 text-xs text-[#dce4e5]">Risk {inspected.riskLevel || "Requires review"} • Severity {inspected.severity}% • Confidence {inspected.confidence}%</p>
          <p className="mt-1 text-xs text-[#bac9cc]">Affected stations {inspected.stations || 1} • Affected wards {inspected.wards || 1}</p>
          <p className="mt-1 text-xs text-[#bac9cc]">Primary issue: {inspected.primaryIssue || "Synthetic cluster"}</p>
          <p className="mt-1 text-xs text-[#bac9cc]">Top anomaly class: {inspected.issue || "Requires review"}</p>
          <p className="mt-1 text-xs text-[#bac9cc]">{inspected.explanation || "Human review recommended"}</p>
          <p className="mt-2 font-mono text-[11px] text-cyan-200">Click to inspect</p>
        </div>
      )}

      <style jsx>{`
        @keyframes nodePulse {
          0%, 100% { transform: scale(0.98); opacity: 0.55; }
          50% { transform: scale(1.02); opacity: 1; }
        }
        @keyframes edgeShimmer {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
