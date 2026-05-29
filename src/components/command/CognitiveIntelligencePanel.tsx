"use client";

import { useMemo } from "react";

import { useSimulationStore } from "@/src/store/useSimulationStore";
import { buildCognitiveSummary } from "@/src/lib/cognitiveIntelligence";
import { buildGeospatialCivicSignals } from "@/src/lib/geospatialCivicSignals";

const indicatorTone = (value: number) => {
  if (value >= 75) return "text-rose-200 border-rose-500/40 bg-rose-500/15";
  if (value >= 50) return "text-amber-200 border-amber-500/40 bg-amber-500/10";
  return "text-cyan-200 border-cyan-500/40 bg-cyan-500/10";
};

export default function CognitiveIntelligencePanel() {
  const telemetry = useSimulationStore((s) => s.telemetryEvents);
  const anomalyLevel = useSimulationStore((s) => s.anomalyLevel);
  const replayFocus = useSimulationStore((s) => s.replayFocus);
  const tick = useSimulationStore((s) => s.tick);
  const timelineRiskEscalation = useSimulationStore((s) => s.timeline.riskEscalation);
  const replayFrame = useSimulationStore((s) => s.getReplayFrameAtTick(s.tick));
  const civicSignals = useMemo(() => buildGeospatialCivicSignals({ tick, telemetry }).summary, [telemetry, tick]);

  const intelligence = useMemo(() => buildCognitiveSummary({
    telemetry,
    anomalyLevel,
    replayFocus,
    replayFrameCategory: replayFrame?.event.category,
    simulationTick: tick,
    simulationStatus: timelineRiskEscalation > 70 ? "DIVERGENT" : timelineRiskEscalation > 45 ? "PREDICTIVE" : "STABLE",
    civicSignals,
  }), [telemetry, anomalyLevel, replayFocus, replayFrame?.event.category, tick, timelineRiskEscalation, civicSignals]);

  return (
    <div className="space-y-3 rounded-xl border border-cyan-950/70 bg-zinc-950/58 p-3 opacity-90 shadow-[0_0_22px_rgba(45,212,191,0.05)]">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300/90">Cognitive Intelligence</h3>

      <div className="space-y-2">
        {intelligence.tacticalBriefings.map((brief, idx) => (
          <p key={idx} className="border-l-2 border-cyan-500/35 pl-2 text-[11px] text-zinc-300">{brief}</p>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider">
        <div className={`rounded border px-2 py-1 ${indicatorTone(intelligence.forecast.escalationProbability)}`}>Escalation {intelligence.forecast.escalationProbability}%</div>
        <div className={`rounded border px-2 py-1 ${indicatorTone(intelligence.forecast.turnoutInstabilityRisk)}`}>Turnout Risk {intelligence.forecast.turnoutInstabilityRisk}%</div>
        <div className={`rounded border px-2 py-1 ${indicatorTone(intelligence.forecast.propagationLikelihood)}`}>Propagation {intelligence.forecast.propagationLikelihood}%</div>
        <div className={`rounded border px-2 py-1 ${indicatorTone(intelligence.forecast.anomalySeverityForecast)}`}>Severity {intelligence.forecast.anomalySeverityForecast}%</div>
        <div className={`rounded border px-2 py-1 ${indicatorTone(intelligence.forecast.civicOperationalStress)}`}>Civic Stress {intelligence.forecast.civicOperationalStress}%</div>
      </div>

      <div className="space-y-1 border border-zinc-700/80 rounded-lg p-2 bg-zinc-950/60">
        {intelligence.predictiveSummaries.map((summary, idx) => (
          <p key={idx} className="text-[10px] text-zinc-300">{summary}</p>
        ))}
      </div>

      <div className="space-y-1">
        {intelligence.correlations.map((insight) => (
          <div key={insight.id} className="rounded border border-fuchsia-500/25 bg-fuchsia-500/5 p-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-fuchsia-200">{insight.label}</span>
              <span className="text-zinc-300">{insight.strength}%</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">{insight.detail}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1 border-t border-zinc-700 pt-2">
        {intelligence.operationalNarrative.map((line, idx) => (
          <p key={idx} className="text-[11px] text-zinc-300 italic">{line}</p>
        ))}
      </div>
    </div>
  );
}
