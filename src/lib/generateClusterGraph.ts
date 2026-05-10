import { buildAnomalyExplanation, primaryIssueFromType } from "@/src/lib/anomalyExplanations";
import { buildStationFeatureVector } from "@/src/lib/anomalyFeatures";
import { buildReviewRecommendations } from "@/src/lib/reviewRecommendations";
import type { ClusterEdge, ClusterGraph, ClusterNode, ClusterRiskLevel, PollingStationRecord, ReviewerStatus } from "@/src/types/election";

const deriveRiskLevel = (severity: number): ClusterRiskLevel => {
  if (severity >= 90) return "critical";
  if (severity >= 75) return "high";
  if (severity >= 55) return "medium";
  return "low";
};

const deriveReviewerStatus = (riskLevel: ClusterRiskLevel): ReviewerStatus => {
  if (riskLevel === "critical") return "requires_review";
  if (riskLevel === "high") return "in_review";
  if (riskLevel === "medium") return "unreviewed";
  return "cleared_demo";
};

export const generateClusterGraph = (stations: PollingStationRecord[], maxNodes = 240): ClusterGraph => {
  const anomalous = stations.filter((s) => s.anomalyFlags.length > 0).slice(0, maxNodes);

  const nodes: ClusterNode[] = anomalous.map((station, idx) => {
    const severity = Math.max(...station.anomalyFlags.map((a) => a.severity));
    const topType = station.anomalyFlags[0]?.type ?? "result-disparity";
    const issue = primaryIssueFromType(topType);
    const features = buildStationFeatureVector(station);
    const riskLevel = deriveRiskLevel(severity);

    return {
      id: station.stationId,
      stationId: station.stationId,
      label: station.stationName,
      county: station.county,
      ward: station.ward,
      severity,
      explanation: buildAnomalyExplanation(issue, features),
      reviewRecommendations: buildReviewRecommendations(issue),
      riskLevel,
      featureSummary: [
        `Turnout ${features.turnoutRate}%`,
        `MCA turnout anchor ${station.mcaTurnoutSignal}`,
        `Max cross-race gap ${features.maxCrossRaceGap}%`,
        `Average cross-race gap ${features.averageCrossRaceGap}%`,
        `Cross-race variance score ${features.crossRaceVarianceScore}`,
        `Upload delay ${features.uploadDelayMinutes}m`,
      ],
      timelineEvents: [
        { timestamp: station.reportedAt, label: "Report received" },
        { timestamp: new Date(new Date(station.reportedAt).getTime() + 30 * 60000).toISOString(), label: "Anomaly emergence" },
        { timestamp: new Date(new Date(station.reportedAt).getTime() + 75 * 60000).toISOString(), label: "Cluster review queued" },
      ],
      relatedClusterIds: anomalous.slice(Math.max(0, idx - 2), idx + 3).map((s) => s.stationId).filter((id) => id !== station.stationId),
      reviewerStatus: deriveReviewerStatus(riskLevel),
      primaryIssue: issue,
      affectedStations: 1,
      affectedWards: 1,
    };
  });

  const edges: ClusterEdge[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < Math.min(i + 6, nodes.length); j += 1) {
      if (nodes[i].county === nodes[j].county || nodes[i].ward === nodes[j].ward) {
        edges.push({ id: `${nodes[i].id}-${nodes[j].id}`, source: nodes[i].id, target: nodes[j].id, weight: Number(((nodes[i].severity + nodes[j].severity) / 200).toFixed(2)), reason: nodes[i].ward === nodes[j].ward ? "shared-ward" : "shared-county" });
      }
    }
  }

  return { generatedAt: new Date().toISOString(), nodes, edges };
};
