import { buildCognitiveSummary } from "@/src/lib/cognitiveIntelligence";
import { buildGeospatialCivicSignals } from "@/src/lib/geospatialCivicSignals";
import { getClusterGraph, getElectionSummary } from "@/src/lib/generatedElectionData";
import type { TelemetryEvent } from "@/src/store/useSimulationStore";

export function getOperationalSnapshot(telemetry: TelemetryEvent[], anomalyLevel = 12, tick = 0) {
  const summary = getElectionSummary();
  const graph = getClusterGraph();
  const civicSignals = buildGeospatialCivicSignals({ tick, telemetry });
  const cognitive = buildCognitiveSummary({
    telemetry,
    anomalyLevel,
    replayFocus: { clusterKey: null, source: "auto", lastJumpAt: 0 },
    simulationTick: tick,
    simulationStatus: telemetry[0]?.simulationStatus ?? "STABLE",
    civicSignals: civicSignals.summary,
  });
  const highRiskCounties = [...summary.counties]
    .sort((a, b) => b.anomalyCount - a.anomalyCount || b.turnoutPercent - a.turnoutPercent)
    .slice(0, 5);
  const issueCounts = graph.nodes.reduce(
    (acc, node) => {
      const issue = node.primaryIssue ?? "turnout variance";
      acc[issue] = (acc[issue] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return { summary, graph, civicSignals, cognitive, highRiskCounties, issueCounts };
}
