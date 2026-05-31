"use client";

import { CommandPanel } from "@/src/components/ui/CommandPanel";
import { MetricCard } from "@/src/components/ui/MetricCard";
import { useRealtimeTelemetry } from "@/src/hooks/useRealtimeTelemetry";
import { useSimulationStore } from "@/src/store/useSimulationStore";

import { getOperationalSnapshot } from "./OperationalData";

export function DashboardView() {
  const telemetry = useRealtimeTelemetry();
  const anomalyLevel = useSimulationStore((state) => state.anomalyLevel);
  const tick = useSimulationStore((state) => state.tick);
  const snapshot = getOperationalSnapshot(telemetry, anomalyLevel, tick);
  const critical = telemetry.filter((event) => event.severity === "CRITICAL").length;
  const active = telemetry.filter((event) => event.status !== "LIVE").length;
  const volatility = telemetry.length
    ? Math.round(telemetry.reduce((acc, event) => acc + Math.abs(55 - event.turnout), 0) / telemetry.length)
    : Math.round(snapshot.summary.turnoutPercent / 8);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-cyan-300/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),rgba(8,15,17,0.88)_42%)] p-5">
        <p className="panel-kicker text-cyan-200">KuraScope EOIS · Operational Application Layer</p>
        <h1 className="mt-2 text-display">KuraScope EOIS Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#bac9cc]">
          Consolidated operational posture using the existing telemetry engine, cognitive intelligence, civic signal intelligence,
          generated election aggregates, and anomaly cluster graph.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Active telemetry" value={`${active}`} />
        <MetricCard title="Critical signals" value={`${critical}`} tone="salmon" />
        <MetricCard title="High-risk counties" value={`${snapshot.highRiskCounties.length}`} tone="yellow" />
        <MetricCard title="Turnout volatility" value={`${volatility}`} tone="yellow" />
        <MetricCard title="Signal stress" value={`${snapshot.civicSignals.summary.operationalStress}%`} tone="green" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <CommandPanel title="High-risk county watchlist" active>
          <div className="space-y-3">
            {snapshot.highRiskCounties.map((county) => (
              <div key={county.county} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-cyan-100">{county.county}</p>
                  <span className="text-data-md text-amber-200">{county.anomalyCount} flags</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-cyan-300" style={{ width: `${Math.min(100, county.turnoutPercent)}%` }} />
                </div>
                <p className="mt-2 text-xs text-[#bac9cc]">Turnout {county.turnoutPercent}% · {county.ballotsCast.toLocaleString()} ballots cast</p>
              </div>
            ))}
          </div>
        </CommandPanel>

        <CommandPanel title="Cognitive summary">
          <div className="space-y-3 text-sm text-[#dce4e5]">
            {snapshot.cognitive.tacticalBriefings.slice(0, 3).map((briefing) => (
              <p key={briefing} className="rounded-lg border border-cyan-300/10 bg-cyan-300/5 p-3">{briefing}</p>
            ))}
          </div>
        </CommandPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CommandPanel title="Signal intelligence summary">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-black/20 p-3"><dt className="panel-kicker text-[#bac9cc]">Dominant corridor</dt><dd className="mt-1 text-cyan-100">{snapshot.civicSignals.summary.dominantCorridor}</dd></div>
            <div className="rounded-lg bg-black/20 p-3"><dt className="panel-kicker text-[#bac9cc]">Constraint</dt><dd className="mt-1 capitalize text-amber-100">{snapshot.civicSignals.summary.dominantConstraint}</dd></div>
            <div className="rounded-lg bg-black/20 p-3"><dt className="panel-kicker text-[#bac9cc]">Mobility pressure</dt><dd className="mt-1 text-data-md text-cyan-200">{snapshot.civicSignals.summary.mobilityPressure}%</dd></div>
            <div className="rounded-lg bg-black/20 p-3"><dt className="panel-kicker text-[#bac9cc]">Queue pressure</dt><dd className="mt-1 text-data-md text-amber-200">{snapshot.civicSignals.summary.queuePressure}%</dd></div>
          </dl>
        </CommandPanel>
        <CommandPanel title="Predictive posture">
          <ul className="space-y-2 text-sm text-[#bac9cc]">
            {snapshot.cognitive.predictiveSummaries.map((summary) => <li key={summary}>• {summary}</li>)}
          </ul>
        </CommandPanel>
      </div>
    </div>
  );
}
