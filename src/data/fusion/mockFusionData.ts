export type ThreatLevel = "low" | "elevated" | "high" | "critical";

export type CountyFusionInput = {
  county: string;
  anomalyScore: number;
  spatialRisk: number;
  aiPredictionRisk: number;
  networkInfluence: number;
  turnoutAnomaly: number;
  heatmapIntensity: number;
  activeAnomalies: number;
  aiConfidence: number;
  temporalEscalationDelta: number;
};

export const mockFusionData: CountyFusionInput[] = [
  { county: "Nairobi", anomalyScore: 88, spatialRisk: 85, aiPredictionRisk: 82, networkInfluence: 90, turnoutAnomaly: 73, heatmapIntensity: 87, activeAnomalies: 19, aiConfidence: 92, temporalEscalationDelta: 14 },
  { county: "Mombasa", anomalyScore: 75, spatialRisk: 77, aiPredictionRisk: 70, networkInfluence: 74, turnoutAnomaly: 66, heatmapIntensity: 79, activeAnomalies: 12, aiConfidence: 89, temporalEscalationDelta: 8 },
  { county: "Kisumu", anomalyScore: 72, spatialRisk: 71, aiPredictionRisk: 74, networkInfluence: 68, turnoutAnomaly: 64, heatmapIntensity: 70, activeAnomalies: 10, aiConfidence: 87, temporalEscalationDelta: 6 },
  { county: "Nakuru", anomalyScore: 69, spatialRisk: 66, aiPredictionRisk: 68, networkInfluence: 63, turnoutAnomaly: 58, heatmapIntensity: 64, activeAnomalies: 9, aiConfidence: 86, temporalEscalationDelta: 5 },
  { county: "Kiambu", anomalyScore: 67, spatialRisk: 62, aiPredictionRisk: 66, networkInfluence: 65, turnoutAnomaly: 54, heatmapIntensity: 61, activeAnomalies: 8, aiConfidence: 88, temporalEscalationDelta: 4 },
  { county: "Uasin Gishu", anomalyScore: 64, spatialRisk: 68, aiPredictionRisk: 63, networkInfluence: 60, turnoutAnomaly: 57, heatmapIntensity: 62, activeAnomalies: 7, aiConfidence: 84, temporalEscalationDelta: 3 },
  { county: "Kakamega", anomalyScore: 63, spatialRisk: 59, aiPredictionRisk: 61, networkInfluence: 58, turnoutAnomaly: 52, heatmapIntensity: 57, activeAnomalies: 7, aiConfidence: 85, temporalEscalationDelta: 2 },
  { county: "Machakos", anomalyScore: 61, spatialRisk: 57, aiPredictionRisk: 60, networkInfluence: 55, turnoutAnomaly: 51, heatmapIntensity: 56, activeAnomalies: 6, aiConfidence: 83, temporalEscalationDelta: 2 },
  { county: "Turkana", anomalyScore: 60, spatialRisk: 65, aiPredictionRisk: 58, networkInfluence: 57, turnoutAnomaly: 55, heatmapIntensity: 63, activeAnomalies: 6, aiConfidence: 82, temporalEscalationDelta: 3 },
  { county: "Garissa", anomalyScore: 59, spatialRisk: 64, aiPredictionRisk: 57, networkInfluence: 56, turnoutAnomaly: 53, heatmapIntensity: 62, activeAnomalies: 5, aiConfidence: 81, temporalEscalationDelta: 2 },
  { county: "Nyeri", anomalyScore: 46, spatialRisk: 43, aiPredictionRisk: 44, networkInfluence: 40, turnoutAnomaly: 38, heatmapIntensity: 42, activeAnomalies: 3, aiConfidence: 90, temporalEscalationDelta: -2 },
  { county: "Bungoma", anomalyScore: 52, spatialRisk: 49, aiPredictionRisk: 50, networkInfluence: 46, turnoutAnomaly: 45, heatmapIntensity: 48, activeAnomalies: 4, aiConfidence: 84, temporalEscalationDelta: 1 },
];
