"use client";

import { mockEdges, mockNodes } from "@/src/data/mockGraph";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

const palette = { normal: "#00e5ff", warning: "#ffd600", anomaly: "#ff3d00" } as const;

const project = (x: number, y: number) => ({ x: 300 + x * 95, y: 225 + y * 75 });

export function TdaGraph({ selectedId, onSelect }: Props) {
  const selected = mockNodes.find((n) => n.id === selectedId) ?? mockNodes[0];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#080f11]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(0,218,243,0.16),transparent_45%),radial-gradient(circle_at_85%_5%,rgba(124,77,255,0.16),transparent_45%)]" />
      <svg viewBox="0 0 600 450" className="h-full w-full">
        <defs>
          <filter id="node-glow"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {mockEdges.map((edge) => {
          const a = mockNodes.find((n) => n.id === edge.source)!;
          const b = mockNodes.find((n) => n.id === edge.target)!;
          const p1 = project(a.x, a.y);
          const p2 = project(b.x, b.y);
          const selectedEdge = edge.source === selectedId || edge.target === selectedId;
          return <line key={edge.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={selectedEdge ? "#9defff" : "#355068"} strokeWidth={selectedEdge ? 3 : Math.max(1.5, edge.weight * 3)} strokeOpacity={selectedEdge ? 0.95 : 0.8} />;
        })}

        {mockNodes.map((node) => {
          const p = project(node.x, node.y);
          const color = palette[node.type];
          const isSelected = node.id === selectedId;
          return (
            <g key={node.id} onClick={() => onSelect(node.id)} className="cursor-pointer">
              {node.type === "anomaly" && <circle cx={p.x} cy={p.y} r={node.size + 13} fill="#93000a" fillOpacity={0.22} />}
              <circle cx={p.x} cy={p.y} r={node.size + 8} fill={color} fillOpacity={0.12} />
              <circle cx={p.x} cy={p.y} r={node.size} fill={color} filter="url(#node-glow)" />
              {node.validated && <circle cx={p.x} cy={p.y} r={node.size + 4} fill="none" stroke="#00c853" strokeWidth="2" />}
              {isSelected && <circle cx={p.x} cy={p.y} r={node.size + 10} fill="none" stroke="#dce4e5" strokeDasharray="3 4" />}
              <text x={p.x} y={p.y + node.size + 16} textAnchor="middle" fill="#dce4e5" fontSize="11" className="font-tech">{node.id.toUpperCase()}</text>
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 left-3 grid grid-cols-2 gap-2 text-[10px]">
        <span className="rounded border border-red-400/35 bg-red-900/20 px-2 py-1 text-[#ff8a65]">Severe anomaly</span>
        <span className="rounded border border-yellow-400/35 bg-yellow-900/20 px-2 py-1 text-[#ffd866]">Warning</span>
        <span className="rounded border border-cyan-400/35 bg-cyan-900/20 px-2 py-1 text-[#7fefff]">Normal</span>
        <span className="rounded border border-green-400/35 bg-green-900/20 px-2 py-1 text-[#6dff9f]">Validated ring</span>
      </div>
      <div className="absolute right-3 top-3 rounded-lg border border-slate-600 bg-black/35 px-3 py-2 text-xs text-[#bac9cc]">
        <p className="font-tech text-[11px] text-white">Selected: {selected.label}</p>
        <p>Signals: {selected.signals.length}</p>
      </div>
    </div>
  );
}
