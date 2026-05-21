"use client";

import type { PersistenceInterval } from "@/src/lib/tda/persistentHomologyEngine";

interface Props {
  intervals: PersistenceInterval[];
}

export function PersistenceBarcode({ intervals }: Props) {
  const rowHeight = 20;
  const width = 820;
  const height = Math.max(210, intervals.length * rowHeight + 34);

  return (
    <div className="rounded-xl border border-cyan-300/25 bg-[#08151b]/70 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">Persistence Barcode</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 h-[260px] w-full">
        <line x1={50} y1={20} x2={50} y2={height - 16} stroke="#3a6682" strokeWidth={1} />
        <line x1={width - 22} y1={20} x2={width - 22} y2={height - 16} stroke="#3a6682" strokeWidth={1} />
        {intervals.map((interval, idx) => {
          const y = 30 + idx * rowHeight;
          const x1 = 50 + interval.birth * (width - 90);
          const x2 = 50 + interval.death * (width - 90);
          const color = interval.dimension === 0 ? "#83f0ff" : "#ffc6a0";
          return (
            <g key={interval.id}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={4} strokeLinecap="round" />
              <circle cx={x1} cy={y} r={3.3} fill={color} opacity={0.95} />
              <circle cx={x2} cy={y} r={2.6} fill={color} opacity={0.7} />
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-[11px] text-[#9fc8d8]">Tracks birth/death intervals, cluster persistence, and anomaly lifespan across filtration scale.</p>
    </div>
  );
}
