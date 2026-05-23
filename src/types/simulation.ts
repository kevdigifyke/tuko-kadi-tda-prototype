export type ScenarioId = "A" | "B" | "C" | "D" | "E" | "F";

export type SimulationScenario = {
  id: ScenarioId;
  label: string;
  summary: string;
  anomalyMultiplier: number;
  delayBias: number;
  turnoutBias: number;
  propagationBias: number;
  confidenceFloor: number;
};

export type SyntheticStationSnapshot = {
  id: string;
  county: string;
  constituency: string;
  registeredVoters: number;
  votes: number;
  turnoutPercent: number;
  isActive: boolean;
  simulatedAnomalyScore: number;
  delayMinutes: number;
  integrityIndex: number;
  pulse: number;
};

export type SimulationTick = {
  tick: number;
  timeLabel: string;
  stations: SyntheticStationSnapshot[];
  heatmapIntensity: number;
  clusterGrowth: number;
  integrityIndex: number;
  riskEscalation: number;
  confidenceScore: number;
};

export type SimulationAnalytics = {
  totalVotesSimulated: number;
  pollingStationsActivated: number;
  activeAnomalies: number;
  regionalTurnout: Record<string, number>;
  integrityIndex: number;
  riskEscalationLevel: number;
  simulationConfidenceScore: number;
};
