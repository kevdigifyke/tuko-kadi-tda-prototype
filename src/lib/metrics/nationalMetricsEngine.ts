export interface CountyCommandMetric {
  county: string;
  activeAlerts: number;
  volatilityScore: number;
  escalationLevel: "LOW" | "MODERATE" | "HIGH" | "SEVERE";
  predictedSpread: number;
  turnoutPressure: number;
  aiConfidence: number;
}

export interface NationalDashboardMetrics {
  nationalTurnoutEstimate: number;
  totalAnomalyCount: number;
  predictedEscalationRegions: string[];
  countyVolatilityScores: CountyCommandMetric[];
  liveRiskIndex: number;
  electionStabilityIndex: number;
  pollingStationDensityPer1000Km2: number;
}

const COUNTY_NAMES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu", "Kiambu", "Machakos", "Kakamega", "Garissa", "Turkana"];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function buildNationalDashboardMetrics(seedPhase = Date.now() / 30000): NationalDashboardMetrics {
  const countyVolatilityScores = COUNTY_NAMES.map((county, index) => {
    const wave = Math.sin(seedPhase + index * 0.61);
    const drift = Math.cos(seedPhase * 0.75 + index * 0.42);
    const volatilityScore = clamp(56 + wave * 28 + drift * 12, 8, 99);
    const activeAlerts = Math.round(clamp(volatilityScore / 14 + (index % 4), 1, 12));
    const predictedSpread = clamp(16 + volatilityScore * 0.74, 8, 98);
    const turnoutPressure = clamp(38 + wave * 23 + 20, 12, 97);
    const aiConfidence = clamp(64 + drift * 14, 45, 96);

    const escalationLevel: CountyCommandMetric["escalationLevel"] =
      volatilityScore > 84 ? "SEVERE" : volatilityScore > 68 ? "HIGH" : volatilityScore > 48 ? "MODERATE" : "LOW";

    return {
      county,
      activeAlerts,
      volatilityScore: Number(volatilityScore.toFixed(1)),
      escalationLevel,
      predictedSpread: Number(predictedSpread.toFixed(1)),
      turnoutPressure: Number(turnoutPressure.toFixed(1)),
      aiConfidence: Number(aiConfidence.toFixed(1)),
    };
  });

  const totalAnomalyCount = countyVolatilityScores.reduce((sum, county) => sum + county.activeAlerts, 0);
  const liveRiskIndex = Number((countyVolatilityScores.reduce((sum, county) => sum + county.volatilityScore, 0) / countyVolatilityScores.length).toFixed(1));
  const electionStabilityIndex = Number(clamp(100 - liveRiskIndex * 0.82, 3, 96).toFixed(1));

  return {
    nationalTurnoutEstimate: Number(clamp(61 + Math.sin(seedPhase * 0.8) * 7.5, 49, 82).toFixed(1)),
    totalAnomalyCount,
    predictedEscalationRegions: countyVolatilityScores.filter((county) => county.escalationLevel === "SEVERE" || county.escalationLevel === "HIGH").map((county) => county.county),
    countyVolatilityScores,
    liveRiskIndex,
    electionStabilityIndex,
    pollingStationDensityPer1000Km2: Number(clamp(24 + Math.cos(seedPhase * 0.6) * 3.8, 16, 31).toFixed(2)),
  };
}
