"use client";

import { mockEdges, mockNodes } from "@/src/data/mockGraph";

interface Props { selectedId: string; onSelect: (id: string) => void; }

const project = (x: number, y: number) => ({ x: 800 + x * 260, y: 360 + y * 200 });

export function TdaGraph({ selectedId, onSelect }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#081116]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_40%,rgba(124,77,255,0.16),transparent_40%),radial-gradient(circle_at_65%_52%,rgba(255,138,128,0.22),transparent_20%),radial-gradient(circle_at_20%_15%,rgba(0,229,255,0.12),transparent_35%)]" />
      <svg viewBox="0 0 1600 900" className="h-full w-full opacity-85">
        {mockEdges.map((edge) => {
          const a = mockNodes.find((n) => n.id === edge.source)!;
          const b = mockNodes.find((n) => n.id === edge.target)!;
          const p1 = project(a.x, a.y);
          const p2 = project(b.x, b.y);
          return <line key={edge.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#2e5f78" strokeWidth={2} strokeOpacity={0.45} />;
        })}
        {mockNodes.map((node) => {
          const p = project(node.x, node.y);
          const isSelected = node.id === selectedId;
          const color = node.type === "anomaly" ? "#ff8a80" : "#7defff";
          return (
            <g key={node.id} onClick={() => onSelect(node.id)} className="cursor-pointer">
              <circle cx={p.x} cy={p.y} r={node.size * 2.8} fill={color} fillOpacity={node.type === "anomaly" ? 0.25 : 0.13} />
              <circle cx={p.x} cy={p.y} r={node.size * 1.2} fill={color} fillOpacity={0.95} />
              {isSelected && <circle cx={p.x} cy={p.y} r={node.size * 3.8} fill="none" stroke="#e5f6f8" strokeDasharray="4 6" />}
            </g>
          );
        })}
      </svg>
      <div className="absolute left-6 top-20 w-[245px] border-l-4 border-[#ff8a80] bg-[#16212d]/92 p-4">
        <p className="panel-kicker text-[#ffa39e]">Live anomaly detected</p>
        <p className="font-ui text-5xl font-bold leading-none text-[#e5f6f8]">14</p>
        <p className="text-sm text-[#8ea0ad]">Forensic Cluster View Active</p>
      </div>
    </div>
  );
}
