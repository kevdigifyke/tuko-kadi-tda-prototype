import { ClusterEdge, ClusterNode } from "@/src/types/graph";

const enrich = (node: Omit<ClusterNode, "riskLevel" | "reviewerStatus" | "explanation" | "primaryIssue" | "featureSummary" | "reviewRecommendations" | "relatedClusterIds" | "timelineEvents" | "clusterMass" | "massLabel" | "gravityReason" | "visualRadius" | "glowStrength">): ClusterNode => ({
  ...node,
  riskLevel: node.severity >= 85 ? "critical" : node.severity >= 70 ? "high" : node.severity >= 50 ? "medium" : "low",
  reviewerStatus: node.severity >= 80 ? "requires_review" : node.severity >= 60 ? "in_review" : "cleared_demo",
  explanation: `${node.whyFlagged} Flagged anomaly requires review in this synthetic demo.`,
  primaryIssue: node.issue,
  featureSummary: node.signals,
  reviewRecommendations: ["Compare source forms", "Check station-level tally breakdown", "Escalate to human verification"],
  relatedClusterIds: [],
  timelineEvents: [{ timestamp: "2026-01-01T00:00:00.000Z", label: "Synthetic marker" }],
  clusterMass: node.severity,
  massLabel: node.severity >= 80 ? "critical" : node.severity >= 60 ? "high" : node.severity >= 35 ? "moderate" : "low",
  gravityReason: "high severity + affected stations + review signal",
  visualRadius: 1 + node.severity / 16,
  glowStrength: 0.15 + node.severity / 140,
});

export const mockNodes: ClusterNode[] = [
  enrich({ id: "ne-04", label: "Nairobi East Pattern 04", type: "anomaly", x: 0, y: 0, size: 18, validated: false, severity: 91, confidence: 78, stations: 14, wards: 3, issue: "cross-race mismatch", whyFlagged: "Cross-form reconciliation shows unusual presidential inflation against governor tallies in clustered stations.", signals: ["Presidential totals exceed governor totals by unusual margin", "Spoilt ballots do not explain the difference", "Two independent submissions disagree", "OCR confidence below review threshold"] }),
  enrich({ id: "wk-02", label: "Westland Drift 02", type: "warning", x: 2, y: 1.1, size: 12, validated: true, severity: 67, confidence: 84, stations: 9, wards: 2, issue: "turnout variance", whyFlagged: "Late reporting wave created a turnout jump outside historical ranges.", signals: ["Sudden turnout jump in final batch", "Manual correction logs incomplete"] }),
];

export const mockEdges: ClusterEdge[] = [
  { id: "e1", source: "ne-04", target: "wk-02", weight: 0.8 },
];
