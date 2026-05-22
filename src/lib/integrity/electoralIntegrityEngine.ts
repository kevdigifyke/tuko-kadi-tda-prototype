export type IntegrityAlertCategory =
  | "turnout_irregularity"
  | "network_manipulation"
  | "abnormal_influence_spread"
  | "polling_station_anomalies"
  | "suspicious_synchronization"
  | "geographic_escalation";

export interface CountyIntegrityInput {
  county: string;
  registeredVoters: number;
  turnoutPercent: number;
  transmissionLatencyMinutes: number;
  stationAnomalyRate: number;
  influenceSpreadIndex: number;
  synchronizationIndex: number;
  incidentCount: number;
}

export interface IntegrityAlert {
  id: string;
  county: string;
  category: IntegrityAlertCategory;
  severity: "low" | "medium" | "high" | "critical";
  score: number;
  observedAt: string;
  message: string;
}

export interface ElectoralIntegrityAssessment {
  electionIntegrityScore: number;
  democraticStabilityIndex: number;
  fraudEscalationProbability: number;
  regionalVolatility: number;
  constitutionalRiskIndicators: {
    legitimacyPressure: number;
    institutionalStress: number;
    civicTrustErosion: number;
    escalationRisk: number;
  };
  countyRankings: Array<{
    county: string;
    integrityScore: number;
    stability: number;
    volatility: number;
  }>;
  alerts: IntegrityAlert[];
}

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export function calculateElectoralIntegrityAssessment(
  counties: CountyIntegrityInput[],
): ElectoralIntegrityAssessment {
  const countyRankings = counties
    .map((county) => {
      const turnoutDeviation = Math.abs(68 - county.turnoutPercent);
      const transmissionRisk = clamp(county.transmissionLatencyMinutes * 1.3);
      const anomalyRisk = clamp(county.stationAnomalyRate * 100);
      const influenceRisk = clamp(county.influenceSpreadIndex * 100);
      const synchronizationRisk = clamp(county.synchronizationIndex * 100);
      const incidentRisk = clamp(county.incidentCount * 3.5);

      const volatility = clamp(
        turnoutDeviation * 1.1 + anomalyRisk * 0.35 + incidentRisk * 0.3 + transmissionRisk * 0.2,
      );

      const integrityScore = clamp(
        100 - (anomalyRisk * 0.3 + influenceRisk * 0.22 + synchronizationRisk * 0.18 + incidentRisk * 0.2 + transmissionRisk * 0.1),
      );

      const stability = clamp(100 - (volatility * 0.55 + influenceRisk * 0.2 + synchronizationRisk * 0.25));

      return {
        county: county.county,
        integrityScore: Math.round(integrityScore),
        stability: Math.round(stability),
        volatility: Math.round(volatility),
      };
    })
    .sort((a, b) => b.integrityScore - a.integrityScore);

  const averageIntegrity = countyRankings.reduce((acc, c) => acc + c.integrityScore, 0) / Math.max(countyRankings.length, 1);
  const averageStability = countyRankings.reduce((acc, c) => acc + c.stability, 0) / Math.max(countyRankings.length, 1);
  const averageVolatility = countyRankings.reduce((acc, c) => acc + c.volatility, 0) / Math.max(countyRankings.length, 1);

  const fraudEscalationProbability = clamp(averageVolatility * 0.65 + (100 - averageIntegrity) * 0.35);

  const constitutionalRiskIndicators = {
    legitimacyPressure: Math.round(clamp((100 - averageIntegrity) * 0.9 + averageVolatility * 0.25)),
    institutionalStress: Math.round(clamp((100 - averageStability) * 0.75 + averageVolatility * 0.4)),
    civicTrustErosion: Math.round(clamp((100 - averageIntegrity) * 0.8 + fraudEscalationProbability * 0.25)),
    escalationRisk: Math.round(clamp(fraudEscalationProbability * 0.85 + averageVolatility * 0.3)),
  };

  return {
    electionIntegrityScore: Math.round(averageIntegrity),
    democraticStabilityIndex: Math.round(averageStability),
    fraudEscalationProbability: Math.round(fraudEscalationProbability),
    regionalVolatility: Math.round(averageVolatility),
    constitutionalRiskIndicators,
    countyRankings,
    alerts: counties.flatMap((county) => buildAlertsForCounty(county)),
  };
}

function buildAlertsForCounty(county: CountyIntegrityInput): IntegrityAlert[] {
  const alerts: IntegrityAlert[] = [];
  const now = new Date().toISOString();

  if (Math.abs(county.turnoutPercent - 68) > 16) {
    alerts.push(createAlert(county, "turnout_irregularity", clamp(Math.abs(county.turnoutPercent - 68) * 4.5), now));
  }
  if (county.transmissionLatencyMinutes > 24) {
    alerts.push(createAlert(county, "network_manipulation", clamp(county.transmissionLatencyMinutes * 2.8), now));
  }
  if (county.influenceSpreadIndex > 0.7) {
    alerts.push(createAlert(county, "abnormal_influence_spread", clamp(county.influenceSpreadIndex * 100), now));
  }
  if (county.stationAnomalyRate > 0.18) {
    alerts.push(createAlert(county, "polling_station_anomalies", clamp(county.stationAnomalyRate * 100), now));
  }
  if (county.synchronizationIndex > 0.65) {
    alerts.push(createAlert(county, "suspicious_synchronization", clamp(county.synchronizationIndex * 100), now));
  }
  if (county.incidentCount > 18) {
    alerts.push(createAlert(county, "geographic_escalation", clamp(county.incidentCount * 4.2), now));
  }

  return alerts;
}

function createAlert(county: CountyIntegrityInput, category: IntegrityAlertCategory, score: number, observedAt: string): IntegrityAlert {
  const severity = score > 85 ? "critical" : score > 70 ? "high" : score > 45 ? "medium" : "low";
  const label = category.replaceAll("_", " ");

  return {
    id: `${county.county}-${category}`,
    county: county.county,
    category,
    severity,
    score: Math.round(score),
    observedAt,
    message: `${county.county}: Elevated ${label} signals detected`,
  };
}
