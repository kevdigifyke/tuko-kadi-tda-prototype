import type { NationalFusionSummary } from "@/src/lib/fusion/intelligenceFusionEngine";
import { FusionRiskCard } from "./FusionRiskCard";

type Props = { summary: NationalFusionSummary };

export function FusionCommandPanel({ summary }: Props) {
  const topTen = summary.counties.slice(0, 10);

  return (
    <section className="space-y-4 rounded-2xl border border-cyan-400/30 bg-gradient-to-b from-zinc-950 to-zinc-900 p-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-cyan-100">Fusion Command Center</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-cyan-300">National Threat: {summary.nationalThreatLevel}</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-red-400/30 bg-red-950/20 p-3"><p className="text-xs text-red-200">National Threat Meter</p><p className="text-2xl font-bold text-red-100">{summary.fusionScore}</p></div>
        <div className="rounded-xl border border-indigo-400/30 bg-indigo-950/20 p-3"><p className="text-xs text-indigo-200">AI Confidence Level</p><p className="text-2xl font-bold text-indigo-100">{summary.aiConfidenceLevel}%</p></div>
        <div className="rounded-xl border border-amber-400/30 bg-amber-950/20 p-3"><p className="text-xs text-amber-200">Active anomaly count</p><p className="text-2xl font-bold text-amber-100">{summary.activeAnomalyCount}</p></div>
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-950/20 p-3"><p className="text-xs text-emerald-200">Election Stability Index</p><p className="text-2xl font-bold text-emerald-100">{summary.electionStabilityIndex}</p></div>
        <div className="rounded-xl border border-fuchsia-400/30 bg-fuchsia-950/20 p-3"><p className="text-xs text-fuchsia-200">Risk escalation indicator</p><p className="text-2xl font-bold text-fuchsia-100">{summary.riskEscalationIndicator} counties</p></div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-200">Top 10 highest risk counties</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {topTen.map((county) => <FusionRiskCard key={county.county} county={county} />)}
        </div>
      </div>
    </section>
  );
}
