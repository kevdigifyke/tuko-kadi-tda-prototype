import type { ClusterNode } from "@/src/types/graph";

const RISK_SCORE: Record<ClusterNode["riskLevel"], number> = {
  low: 0.35,
  medium: 0.6,
  high: 0.85,
  critical: 1,
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export function getClusterMass(node: ClusterNode): number {
  const severity = clamp01((node.severity ?? 0) / 100);
  const confidence = clamp01((node.confidence ?? 0) / 100);
  const stationScore = clamp01(Math.log1p(node.stations ?? 0) / Math.log(251));
  const wardScore = clamp01(Math.log1p(node.wards ?? 0) / Math.log(91));
  const signalScore = clamp01((node.signals?.length ?? 0) / 8);
  const riskScore = RISK_SCORE[node.riskLevel] ?? 0.5;

  return (
    stationScore * 0.3 +
    severity * 0.25 +
    confidence * 0.15 +
    riskScore * 0.15 +
    wardScore * 0.1 +
    signalScore * 0.05
  );
}

export function getClusterNodeSize(node: ClusterNode): number {
  return 1.7 + getClusterMass(node) * 3.4;
}
