"use client";
import { useMemo, useState } from "react";
import type { CountyCommandMetric } from "@/src/lib/metrics/nationalMetricsEngine";

type SortKey = keyof CountyCommandMetric;

export function CountyRiskTable({ rows }: { rows: CountyCommandMetric[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("volatilityScore");
  const sorted = useMemo(() => [...rows].sort((a, b) => (Number(b[sortKey]) || 0) - (Number(a[sortKey]) || 0)), [rows, sortKey]);
  const headers: SortKey[] = ["county", "activeAlerts", "volatilityScore", "escalationLevel", "predictedSpread", "turnoutPressure", "aiConfidence"];

  return <section className="rounded-xl border border-cyan-300/30 bg-black/35 p-4">
    <h3 className="mb-3 text-sm font-semibold text-cyan-100">County Command Table</h3>
    <div className="overflow-auto"><table className="w-full min-w-[760px] text-xs"><thead><tr>{headers.map((h) => <th key={h} onClick={() => setSortKey(h)} className="cursor-pointer border-b border-cyan-800/70 px-2 py-2 text-left text-cyan-300">{h}</th>)}</tr></thead>
    <tbody>{sorted.map((r) => <tr key={r.county} className="border-b border-zinc-800/70 text-zinc-200"><td className="px-2 py-2">{r.county}</td><td>{r.activeAlerts}</td><td>{r.volatilityScore}</td><td>{r.escalationLevel}</td><td>{r.predictedSpread}</td><td>{r.turnoutPressure}</td><td>{r.aiConfidence}%</td></tr>)}</tbody></table></div>
  </section>;
}
