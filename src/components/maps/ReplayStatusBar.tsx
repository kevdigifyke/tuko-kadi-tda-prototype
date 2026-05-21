"use client";

interface ReplayStatusBarProps {
  currentTime: string;
  activeVotersEstimate: number;
  nationalTurnout: number;
  activeAnomalies: number;
  highestRiskCounty: string;
}

export default function ReplayStatusBar({
  currentTime,
  activeVotersEstimate,
  nationalTurnout,
  activeAnomalies,
  highestRiskCounty,
}: ReplayStatusBarProps) {
  return (
    <div className="absolute left-4 right-4 top-4 z-[1000] grid grid-cols-1 gap-2 rounded-xl border border-indigo-500/40 bg-zinc-950/85 p-3 text-xs text-indigo-100 shadow-[0_0_30px_rgba(99,102,241,0.25)] backdrop-blur md:grid-cols-5">
      <Stat label="Replay Time" value={currentTime} />
      <Stat label="Active Voters" value={activeVotersEstimate.toLocaleString()} />
      <Stat label="National Turnout" value={`${nationalTurnout.toFixed(1)}%`} />
      <Stat label="Active Anomalies" value={String(activeAnomalies)} />
      <Stat label="Highest-Risk County" value={highestRiskCounty} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-indigo-500/20 bg-zinc-900/60 p-2">
      <p className="text-[10px] uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-1 font-semibold text-cyan-200">{value}</p>
    </div>
  );
}
