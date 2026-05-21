import { buildNetworkInfluence, getNearbyStations, type InfluenceStation } from "@/lib/tda/networkInfluenceEngine";

export type EscalationLevel = "LOW" | "GUARDED" | "ELEVATED" | "CRITICAL";
export interface PredictiveRiskResult { riskScore: number; confidence: number; spreadProbability: number; escalationLevel: EscalationLevel; }
const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const escalationFromRisk = (riskScore: number): EscalationLevel => riskScore >= 80 ? "CRITICAL" : riskScore >= 62 ? "ELEVATED" : riskScore >= 40 ? "GUARDED" : "LOW";

export function predictElectionRisk(station: InfluenceStation, allStations: InfluenceStation[]): PredictiveRiskResult {
  const nearbyStations = getNearbyStations(station, allStations, 7);
  const network = buildNetworkInfluence(allStations, 7);
  const stationNetwork = network.stations.find((candidate) => candidate.id === station.id);
  const avgNeighborAnomaly = nearbyStations.length ? nearbyStations.reduce((sum, entry) => sum + entry.station.anomalyScore, 0) / nearbyStations.length : station.anomalyScore;
  const clusterDensity = clamp((nearbyStations.length / Math.max(allStations.length - 1, 1)) * 100);
  const neighboringInfluence = clamp(nearbyStations.reduce((sum, entry) => sum + (entry.station.turnout * (1 - Math.min(entry.distanceKm / 7, 1))), 0) / Math.max(nearbyStations.length, 1));
  const historicalReplayTrend = clamp((station.temporalSpike ?? 45) * 0.75 + avgNeighborAnomaly * 0.25);
  const propagationInfluence = stationNetwork?.propagatedRisk ?? station.anomalyScore;
  const riskScore = clamp(station.anomalyScore * 0.28 + station.turnout * 0.12 + clusterDensity * 0.14 + neighboringInfluence * 0.14 + historicalReplayTrend * 0.14 + propagationInfluence * 0.18);
  const spreadProbability = clamp((propagationInfluence * 0.5 + clusterDensity * 0.25 + neighboringInfluence * 0.25) * 1.02);
  const confidence = clamp(55 + nearbyStations.length * 7 + Math.abs(station.anomalyScore - avgNeighborAnomaly) * 0.15);
  return { riskScore: Number(riskScore.toFixed(1)), confidence: Number(confidence.toFixed(1)), spreadProbability: Number(spreadProbability.toFixed(1)), escalationLevel: escalationFromRisk(riskScore) };
}
