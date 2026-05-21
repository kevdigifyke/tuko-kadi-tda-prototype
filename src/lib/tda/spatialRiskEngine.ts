export function calculateSpatialRisk(station: any): number {
  const turnoutRisk = station.turnout > 85 ? 30 : 10;

  const anomalyRisk =
    station.anomalyScore * 50;

  const influenceRisk =
    station.influenceScore
      ? station.influenceScore * 20
      : 10;

  const clusterRisk =
    station.clusterStrength
      ? station.clusterStrength * 15
      : 5;

  const totalRisk =
    turnoutRisk +
    anomalyRisk +
    influenceRisk +
    clusterRisk;

  return Math.min(
    Math.round(totalRisk),
    100
  );
}