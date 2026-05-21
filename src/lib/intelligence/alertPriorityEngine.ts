export type AlertPriority = "INFO" | "WATCH" | "WARNING" | "CRITICAL";

export interface AlertSignalInput {
  predictiveRisk: number;
  anomalyDensity: number;
  propagationSpeed: number;
  geographicClustering: number;
  turnoutIrregularity: number;
}

export function scoreAlertPriority(input: AlertSignalInput): { score: number; priority: AlertPriority } {
  const score =
    input.predictiveRisk * 0.28 +
    input.anomalyDensity * 0.22 +
    input.propagationSpeed * 0.2 +
    input.geographicClustering * 0.16 +
    input.turnoutIrregularity * 0.14;

  if (score >= 78) return { score: Number(score.toFixed(2)), priority: "CRITICAL" };
  if (score >= 60) return { score: Number(score.toFixed(2)), priority: "WARNING" };
  if (score >= 40) return { score: Number(score.toFixed(2)), priority: "WATCH" };
  return { score: Number(score.toFixed(2)), priority: "INFO" };
}
