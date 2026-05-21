import { pollingStations } from "@/data/geo/pollingStations";
import { predictElectionRisk } from "./predictiveRiskEngine";

export interface LiveRiskUpdate {
  stationId: string;
  stationName: string;
  county: string;
  riskDelta: number;
  riskScore: number;
  confidence: number;
  spreadProbability: number;
  escalationLevel: "LOW" | "GUARDED" | "ELEVATED" | "CRITICAL";
  timestamp: string;
}

const mutate = (base: number, variance = 8) => Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance));

export function generateLiveRiskUpdate(): LiveRiskUpdate {
  const station = pollingStations[Math.floor(Math.random() * pollingStations.length)];
  const simulated = { ...station, anomalyScore: mutate(station.anomalyScore, 16), turnout: mutate(station.turnout, 12), temporalSpike: mutate(station.temporalSpike ?? 50, 20) };
  const prediction = predictElectionRisk(simulated, pollingStations);
  return {
    stationId: station.id,
    stationName: station.name,
    county: station.county,
    riskDelta: Number((prediction.riskScore - station.anomalyScore).toFixed(1)),
    riskScore: prediction.riskScore,
    confidence: prediction.confidence,
    spreadProbability: prediction.spreadProbability,
    escalationLevel: prediction.escalationLevel,
    timestamp: new Date().toISOString(),
  };
}
