"use client";
import type { NationalDashboardMetrics } from "@/src/lib/metrics/nationalMetricsEngine";

export function ElectionMetricsGrid({ metrics }: { metrics: NationalDashboardMetrics }) {
  const cards = [
    ["National turnout estimate", `${metrics.nationalTurnoutEstimate}%`],
    ["Total anomaly count", `${metrics.totalAnomalyCount}`],
    ["Live risk index", `${metrics.liveRiskIndex}`],
    ["Election stability", `${metrics.electionStabilityIndex}`],
    ["Station density /1000km²", `${metrics.pollingStationDensityPer1000Km2}`],
    ["Escalation regions", `${metrics.predictedEscalationRegions.length}`],
  ];
  return <section className="grid grid-cols-2 gap-3 xl:grid-cols-3">{cards.map(([label, value]) => <div key={label} className="rounded-xl border border-cyan-300/30 bg-black/35 p-3"><p className="text-[11px] uppercase tracking-wide text-cyan-300">{label}</p><p className="mt-1 font-mono text-lg text-cyan-50">{value}</p></div>)}</section>;
}
