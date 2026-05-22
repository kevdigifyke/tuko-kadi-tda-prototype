import { mockFusionData, type CountyFusionInput, type ThreatLevel } from "@/src/data/fusion/mockFusionData";

export type CountyFusionResult = CountyFusionInput & {
  fusionScore: number;
  dominantDriver: keyof Pick<CountyFusionInput, "anomalyScore" | "spatialRisk" | "aiPredictionRisk" | "networkInfluence" | "turnoutAnomaly" | "heatmapIntensity">;
  threatLevel: ThreatLevel;
  escalationStatus: "escalating" | "stable" | "de-escalating";
};

export type NationalFusionSummary = {
  fusionScore: number;
  nationalThreatLevel: ThreatLevel;
  regionalThreatClassification: Record<string, ThreatLevel>;
  electionStabilityIndex: number;
  aiConfidenceLevel: number;
  activeAnomalyCount: number;
  riskEscalationIndicator: number;
  counties: CountyFusionResult[];
};

const weights = {
  anomalyScore: 0.23,
  spatialRisk: 0.17,
  aiPredictionRisk: 0.2,
  networkInfluence: 0.15,
  turnoutAnomaly: 0.13,
  heatmapIntensity: 0.12,
};

function scoreToThreatLevel(score: number): ThreatLevel {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "elevated";
  return "low";
}

function inferRegionalBand(county: string): string {
  if (["Mombasa"].includes(county)) return "Coastal Corridor";
  if (["Nairobi", "Kiambu", "Machakos"].includes(county)) return "Metro Core";
  if (["Kisumu", "Kakamega", "Bungoma"].includes(county)) return "Western Belt";
  if (["Turkana", "Uasin Gishu", "Garissa"].includes(county)) return "Frontier Arc";
  return "Central Interior";
}

export function buildNationalFusionSummary(counties: CountyFusionInput[] = mockFusionData): NationalFusionSummary {
  const countyResults: CountyFusionResult[] = counties.map((county) => {
    const fusionScore = Number((
      county.anomalyScore * weights.anomalyScore +
      county.spatialRisk * weights.spatialRisk +
      county.aiPredictionRisk * weights.aiPredictionRisk +
      county.networkInfluence * weights.networkInfluence +
      county.turnoutAnomaly * weights.turnoutAnomaly +
      county.heatmapIntensity * weights.heatmapIntensity
    ).toFixed(1));

    const drivers = {
      anomalyScore: county.anomalyScore,
      spatialRisk: county.spatialRisk,
      aiPredictionRisk: county.aiPredictionRisk,
      networkInfluence: county.networkInfluence,
      turnoutAnomaly: county.turnoutAnomaly,
      heatmapIntensity: county.heatmapIntensity,
    };

    const dominantDriver = Object.entries(drivers).sort((a, b) => b[1] - a[1])[0][0] as CountyFusionResult["dominantDriver"];
    const escalationStatus = county.temporalEscalationDelta > 3 ? "escalating" : county.temporalEscalationDelta < 0 ? "de-escalating" : "stable";

    return {
      ...county,
      fusionScore,
      dominantDriver,
      threatLevel: scoreToThreatLevel(fusionScore),
      escalationStatus,
    };
  });

  const fusionScore = Number((countyResults.reduce((sum, county) => sum + county.fusionScore, 0) / countyResults.length).toFixed(1));
  const aiConfidenceLevel = Number((countyResults.reduce((sum, county) => sum + county.aiConfidence, 0) / countyResults.length).toFixed(1));
  const activeAnomalyCount = countyResults.reduce((sum, county) => sum + county.activeAnomalies, 0);
  const riskEscalationIndicator = countyResults.filter((county) => county.escalationStatus === "escalating").length;
  const electionStabilityIndex = Number((100 - fusionScore * 0.82).toFixed(1));

  const regionalThreatClassification = countyResults.reduce<Record<string, ThreatLevel>>((acc, county) => {
    const band = inferRegionalBand(county.county);
    const current = acc[band];
    if (!current) {
      acc[band] = county.threatLevel;
      return acc;
    }

    const priority: Record<ThreatLevel, number> = { low: 1, elevated: 2, high: 3, critical: 4 };
    if (priority[county.threatLevel] > priority[current]) acc[band] = county.threatLevel;
    return acc;
  }, {});

  return {
    fusionScore,
    nationalThreatLevel: scoreToThreatLevel(fusionScore),
    regionalThreatClassification,
    electionStabilityIndex,
    aiConfidenceLevel,
    activeAnomalyCount,
    riskEscalationIndicator,
    counties: countyResults.sort((a, b) => b.fusionScore - a.fusionScore),
  };
}
