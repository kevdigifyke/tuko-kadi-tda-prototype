"use client";

import { useMemo } from "react";
import { pollingStations } from "@/data/geo/pollingStations";
import { predictElectionRisk } from "@/lib/ai/predictiveRiskEngine";

export default function AIRiskPanel() {
  const rows = useMemo(() => pollingStations.map((station) => ({ station, risk: predictElectionRisk(station, pollingStations) })).sort((a, b) => b.risk.riskScore - a.risk.riskScore), []);
  const countyRank = useMemo(() => Object.entries(rows.reduce<Record<string, { total: number; count: number }>>((acc, row) => { acc[row.station.county] ??= { total: 0, count: 0 }; acc[row.station.county].total += row.risk.riskScore; acc[row.station.county].count += 1; return acc; }, {})).map(([county, metric]) => ({ county, score: metric.total / metric.count })).sort((a, b) => b.score - a.score), [rows]);

  return <aside className="h-full rounded-2xl border border-cyan-400/30 bg-[#04090f]/90 p-4 text-[#cae9ff] shadow-[0_0_35px_rgba(34,211,238,0.15)]">
    <h2 className="text-lg font-semibold text-cyan-200">AI Predictive Hotspots</h2>
    <div className="mt-3 space-y-2">{rows.slice(0, 10).map(({ station, risk }) => <div key={station.id} className="rounded border border-white/10 bg-black/30 p-2 text-xs"><p className="font-semibold">{station.name}</p><p>{risk.escalationLevel} · Risk {risk.riskScore}% · Confidence {risk.confidence}%</p><p>Spread trajectory: {risk.spreadProbability}% probable expansion</p></div>)}</div>
    <h3 className="mt-4 text-sm font-semibold text-cyan-300">County predictive instability</h3>
    <div className="mt-2 space-y-1 text-xs">{countyRank.map((row, index) => <p key={row.county}>{index + 1}. {row.county} — {row.score.toFixed(1)} risk index</p>)}</div>
  </aside>;
}
