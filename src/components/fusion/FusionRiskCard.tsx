import type { CountyFusionResult } from "@/src/lib/fusion/intelligenceFusionEngine";

type Props = {
  county: CountyFusionResult;
};

export function FusionRiskCard({ county }: Props) {
  return (
    <article className="rounded-xl border border-cyan-400/20 bg-zinc-950/70 p-4 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-cyan-200">{county.county}</h3>
        <span className="rounded-full border border-fuchsia-400/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-fuchsia-200">{county.threatLevel}</span>
      </div>
      <dl className="mt-3 space-y-1 text-xs text-zinc-300">
        <div className="flex justify-between"><dt>Combined score</dt><dd>{county.fusionScore}</dd></div>
        <div className="flex justify-between"><dt>Dominant driver</dt><dd>{county.dominantDriver}</dd></div>
        <div className="flex justify-between"><dt>Influence propagation</dt><dd>{county.networkInfluence}%</dd></div>
        <div className="flex justify-between"><dt>Temporal status</dt><dd>{county.escalationStatus}</dd></div>
      </dl>
    </article>
  );
}
