export type ScenarioId =
  | "low-risk"
  | "normal"
  | "competitive"
  | "high-risk"
  | "escalation-event"
  | "transmission-failure"
  | "turnout-surge"
  | "multi-county-propagation";

export type ScenarioRiskLevel = "LOW" | "NORMAL" | "ELEVATED" | "HIGH" | "CRITICAL";

export type SimulationEventType =
  | "anomaly"
  | "propagation"
  | "turnout-spike"
  | "reporting-delay"
  | "infrastructure-outage";

export type PresentationPresetId =
  | "observer-demo"
  | "academic-demo"
  | "political-party-demo"
  | "investor-demo"
  | "public-transparency-demo";

export type SimulationScenario = {
  id: ScenarioId;
  label: string;
  summary: string;
  riskLevel: ScenarioRiskLevel;
  anomalyMultiplier: number;
  delayBias: number;
  turnoutBias: number;
  propagationBias: number;
  confidenceFloor: number;
  telemetryVolume: number;
  anomalyFrequency: number;
  propagationIntensity: number;
  turnoutPressure: number;
  civicSignalPressure: number;
};

export type PresentationPreset = {
  id: PresentationPresetId;
  label: string;
  summary: string;
  scenario: ScenarioId;
  speed: number;
  emphasis: string;
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
  telemetryIntensity: number;
  propagationIntensity: number;
  turnoutPressure: number;
  civicSignalPressure: number;
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
