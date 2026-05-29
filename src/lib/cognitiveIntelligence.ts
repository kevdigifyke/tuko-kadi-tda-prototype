import type { CivicSignalSummary } from "@/src/lib/geospatialCivicSignals";
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
    civicOperationalStress: number;
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
  civicSignals?: CivicSignalSummary;
}): CognitiveSummary {
  const { telemetry, anomalyLevel, replayFocus, replayFrameCategory, simulationTick, simulationStatus, civicSignals } = params;
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
    civicOperationalStress: clamp(Math.round(civicSignals?.operationalStress ?? anomalyLevel * 0.7)),
  };

  return {
    tacticalBriefings: [
      criticalCount > 3 ? "Escalation detected across western propagation corridor." : "Localized escalation pockets remain under active observation.",
      turnoutVolatility > 14 ? "Turnout instability increasing in clustered urban constituencies." : "Turnout vectors remain manageable with periodic urban spikes.",
      replayFocus.clusterKey ? `Replay analysis indicates synchronized anomaly propagation near ${replayFocus.clusterKey}.` : "Replay cognition indicates partial synchronization across anomaly bands.",
      civicSignals ? civicSignals.narrative : "Civic signal simulation layer is ready for environmental and mobility correlation.",
    ],
    predictiveSummaries: [
      `Escalation probability ${forecast.escalationProbability}% with ${(simulationStatus || "stable").toLowerCase()} simulation posture.`,
      `Propagation likelihood ${forecast.propagationLikelihood}% centered on ${dominantCategory}.`,
      `Turnout instability risk ${forecast.turnoutInstabilityRisk}% at simulation tick ${simulationTick}.`,
      civicSignals ? `Civic operational stress ${forecast.civicOperationalStress}% with accessibility score ${civicSignals.accessibilityScore}%.` : "Civic operational stress unavailable until signal simulation initializes.",
    ],
    operationalNarrative: [
      `Clustered anomalies continue migrating eastward through ${counties} monitored counties.`,
      `Replay cognition suggests increasing propagation density around ${replayFrameCategory ?? dominantCategory}.`,
      `Simulation divergence ${simulationStatus === "DIVERGENT" ? "detected" : "monitored"} in high-turnout regions with severity forecast ${forecast.anomalySeverityForecast}%.`,
      civicSignals ? `Forecast intelligence correlates ${civicSignals.dominantConstraint} constraints with turnout pressure ${civicSignals.turnoutPressure}% along ${civicSignals.dominantCorridor}.` : "Forecast intelligence awaiting civic flow constraints.",
    ],
    correlations: [
      { id: "linked", label: "Linked Anomalies", strength: clamp(criticalCount * 12 + escalatedCount * 4), detail: `${criticalCount} critical telemetry anomalies linked with replay and simulation traces.` },
      { id: "sync", label: "Synchronized Escalation", strength: clamp(criticalCount * 8 + divergentCount * 5), detail: `${divergentCount} divergent simulation paths align with active escalation clusters.` },
      { id: "geo", label: "Geographic Propagation", strength: clamp(counties * 7 + escalatedCount * 3), detail: `${counties} counties display correlated propagation relationships.` },
      { id: "civic-flow", label: "Civic Flow Constraint", strength: forecast.civicOperationalStress, detail: civicSignals ? `${civicSignals.dominantCorridor} shows ${civicSignals.dominantConstraint} constraint correlation with ${civicSignals.congestionScore}% congestion.` : "Civic signal model standing by for anomaly correlation." },
    ],
    forecast,
  };
}
