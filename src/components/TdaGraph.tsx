"use client";

import { mockEdges, mockNodes } from "@/src/data/mockGraph";

interface Props { selectedId: string; onSelect: (id: string) => void; }

const project = (x: number, y: number) => ({ x: 800 + x * 260, y: 360 + y * 200 });

export function TdaGraph({ selectedId, onSelect }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#080f11]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_40%,rgba(124,77,255,0.16),transparent_40%),radial-gradient(circle_at_66%_48%,rgba(255,180,171,0.2),transparent_24%),radial-gradient(circle_at_20%_15%,rgba(0,229,255,0.12),transparent_35%),linear-gradient(180deg,rgba(8,15,17,0.15),rgba(8,15,17,0.85))]" />
      <svg viewBox="0 0 1600 900" className="h-full w-full opacity-90">
        {mockEdges.map((edge) => {
          const a = mockNodes.find((n) => n.id === edge.source)!;
          const b = mockNodes.find((n) => n.id === edge.target)!;
          const p1 = project(a.x, a.y);
          const p2 = project(b.x, b.y);
          return <line key={edge.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#2e5f78" strokeWidth={1.5} strokeOpacity={0.45} />;
        })}
        {mockNodes.map((node) => {
          const p = project(node.x, node.y);
          const isSelected = node.id === selectedId;
          const color = node.type === "anomaly" ? "#ffb4ab" : "#7defff";
          return (
            <g key={node.id} onClick={() => onSelect(node.id)} className="cursor-pointer">
              <circle cx={p.x} cy={p.y} r={node.size * 3.5} fill={color} fillOpacity={node.type === "anomaly" ? 0.18 : 0.09} />
              <circle cx={p.x} cy={p.y} r={node.size * 1.25} fill={color} fillOpacity={0.95} />
              {isSelected && <circle cx={p.x} cy={p.y} r={node.size * 4.4} fill="none" stroke="#ffb4ab" strokeDasharray="4 6" />}
              {isSelected && <text x={p.x + 16} y={p.y - 10} fill="#dce4e5" fontSize="14" fontFamily="var(--font-mono)">{node.label}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
