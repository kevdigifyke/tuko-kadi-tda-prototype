import type { ReplayFocusState, TelemetryEvent } from "@/src/store/useSimulationStore";

export type CognitiveSummary = {
  tacticalBriefings: string[];
  predictiveSummaries: string[];
  operationalNarrative: string[];
  correlations: Array<{ id: string; label: string; strength: number; detail: string }>;
  forecast: {
    escalationProbability: number;
    turnoutInstabilityRisk: number;
    propagationLikelihood: number;
    anomalySeverityForecast: number;
  };
};

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function buildCognitiveSummary(params: {
  telemetry: TelemetryEvent[];
  anomalyLevel: number;
  replayFocus: ReplayFocusState;
  replayFrameCategory?: string;
  simulationTick: number;
  simulationStatus: "STABLE" | "PREDICTIVE" | "DIVERGENT";
}): CognitiveSummary {
  const { telemetry, anomalyLevel, replayFocus, replayFrameCategory, simulationTick, simulationStatus } = params;
  const criticalCount = telemetry.filter((e) => e.severity === "CRITICAL").length;
  const divergentCount = telemetry.filter((e) => e.simulationStatus === "DIVERGENT").length;
  const escalatedCount = telemetry.filter((e) => e.status === "ESCALATED").length;
  const meanRisk = telemetry.length ? telemetry.reduce((n, e) => n + e.aiRiskScore, 0) / telemetry.length : anomalyLevel;
  const turnoutVolatility = telemetry.length ? telemetry.reduce((n, e) => n + Math.abs(55 - e.turnout), 0) / telemetry.length : 0;
  const counties = new Set(telemetry.map((e) => e.county)).size;
  const dominantCategory = telemetry[0]?.category ?? "signal propagation";

  const forecast = {
    escalationProbability: clamp(Math.round(meanRisk * 0.55 + criticalCount * 7 + anomalyLevel * 0.25)),
    turnoutInstabilityRisk: clamp(Math.round(turnoutVolatility * 2.8 + divergentCount * 4)),
    propagationLikelihood: clamp(Math.round(counties * 6.5 + escalatedCount * 4 + meanRisk * 0.4)),
    anomalySeverityForecast: clamp(Math.round(anomalyLevel * 0.8 + criticalCount * 6 + divergentCount * 5)),
  };

  return {
    tacticalBriefings: [
      criticalCount > 3 ? "Escalation detected across western propagation corridor." : "Localized escalation pockets remain under active observation.",
      turnoutVolatility > 14 ? "Turnout instability increasing in clustered urban constituencies." : "Turnout vectors remain manageable with periodic urban spikes.",
      replayFocus.clusterKey ? `Replay analysis indicates synchronized anomaly propagation near ${replayFocus.clusterKey}.` : "Replay cognition indicates partial synchronization across anomaly bands.",
    ],
    predictiveSummaries: [
      `Escalation probability ${forecast.escalationProbability}% with ${(simulationStatus || "stable").toLowerCase()} simulation posture.`,
      `Propagation likelihood ${forecast.propagationLikelihood}% centered on ${dominantCategory}.`,
      `Turnout instability risk ${forecast.turnoutInstabilityRisk}% at simulation tick ${simulationTick}.`,
    ],
    operationalNarrative: [
      `Clustered anomalies continue migrating eastward through ${counties} monitored counties.`,
      `Replay cognition suggests increasing propagation density around ${replayFrameCategory ?? dominantCategory}.`,
      `Simulation divergence ${simulationStatus === "DIVERGENT" ? "detected" : "monitored"} in high-turnout regions with severity forecast ${forecast.anomalySeverityForecast}%.`,
    ],
    correlations: [
      { id: "linked", label: "Linked Anomalies", strength: clamp(criticalCount * 12 + escalatedCount * 4), detail: `${criticalCount} critical telemetry anomalies linked with replay and simulation traces.` },
      { id: "sync", label: "Synchronized Escalation", strength: clamp(criticalCount * 8 + divergentCount * 5), detail: `${divergentCount} divergent simulation paths align with active escalation clusters.` },
      { id: "geo", label: "Geographic Propagation", strength: clamp(counties * 7 + escalatedCount * 3), detail: `${counties} counties display correlated propagation relationships.` },
    ],
    forecast,
  };
}
