export function calculateSpatialRisk(station: any) {
  let risk = 0;

  // turnout anomaly
  risk += station.anomalyScore * 50;

  // suspicious turnout
  if (station.turnout > 85) {
    risk += 25;
  }

  // extremely low turnout
  if (station.turnout < 25) {
    risk += 10;
  }

  // random network instability simulation
  risk += Math.random() * 15;

  return Math.min(100, Math.round(risk));
}