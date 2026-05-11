import type { ClusterNode as ElectionClusterNode, ClusterRiskLevel, ReviewerStatus } from "@/src/types/election";

const RISK_WEIGHT: Record<ClusterRiskLevel, number> = { low: 20, medium: 50, high: 78, critical: 100 };
const REVIEW_WEIGHT: Record<ReviewerStatus, number> = { unreviewed: 60, requires_review: 100, in_review: 70, cleared_demo: 10 };

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const recencyScore = (lastUpdated?: string) => {
  if (!lastUpdated) return 50;
  const now = Date.now();
  const updated = new Date(lastUpdated).getTime();
  if (Number.isNaN(updated)) return 50;
  const days = Math.max(0, (now - updated) / 86_400_000);
  return clamp(100 - days * 5);
};

const disagreementScore = (featureSummary: string[]) => {
  const joined = featureSummary.join(" ").toLowerCase();
  if (joined.includes("cross-race gap") || joined.includes("mismatch")) return 82;
  return 48;
};

export function calculateClusterMass(cluster: ElectionClusterNode): number {
  const severity = clamp(cluster.severity);
  const confidence = clamp(100 - Math.abs(cluster.severity - 65) * 0.7);
  const stations = clamp(Math.log10((cluster.affectedStations ?? 1) + 1) * 55);
  const wards = clamp(Math.log10((cluster.affectedWards ?? 1) + 1) * 75);
  const risk = RISK_WEIGHT[cluster.riskLevel ?? "medium"];
  const review = REVIEW_WEIGHT[cluster.reviewerStatus ?? "unreviewed"];
  const typeSpread = clamp((cluster.relatedClusterIds?.length ?? 0) * 12 + (cluster.primaryIssue ? 40 : 20));
  const recency = recencyScore(cluster.timelineEvents?.[0]?.timestamp);
  const disagreement = disagreementScore(cluster.featureSummary ?? []);

  const weighted =
    severity * 0.24 +
    stations * 0.22 +
    risk * 0.18 +
    confidence * 0.12 +
    wards * 0.1 +
    recency * 0.08 +
    review * 0.04 +
    typeSpread * 0.015 +
    disagreement * 0.025;

  return clamp(Math.round(weighted));
}

export function getClusterMassLabel(mass: number): "low" | "moderate" | "high" | "critical" {
  if (mass >= 80) return "critical";
  if (mass >= 60) return "high";
  if (mass >= 35) return "moderate";
  return "low";
}

export function getClusterGravityClass(cluster: ElectionClusterNode): string {
  const mass = calculateClusterMass(cluster);
  const massLabel = getClusterMassLabel(mass);
  return `${massLabel}-gravity`;
}

export function normalizeClusterMass(clusters: ElectionClusterNode[]): number[] {
  if (clusters.length === 0) return [];
  const masses = clusters.map(calculateClusterMass);
  const min = Math.min(...masses);
  const max = Math.max(...masses);
  if (min === max) return masses.map(() => 50);
  return masses.map((mass) => Math.round(((mass - min) / (max - min)) * 100));
}

export function buildGravityReason(cluster: ElectionClusterNode, mass: number): string {
  const severityBand = cluster.severity >= 75 ? "high severity" : cluster.severity >= 55 ? "moderate severity" : "lower severity";
  const stations = `${cluster.affectedStations} affected stations`;
  const wardSpread = cluster.affectedWards > 1 ? "multi-ward spread" : "localized ward footprint";
  const confidenceBand = mass >= 70 ? "strong confidence" : "moderate confidence";
  return `${severityBand} + ${stations} + ${wardSpread} + ${confidenceBand}`;
}
