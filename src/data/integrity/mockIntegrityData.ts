import { calculateElectoralIntegrityAssessment, type CountyIntegrityInput } from "@/src/lib/integrity/electoralIntegrityEngine";

export const mockCountyIntegrityInputs: CountyIntegrityInput[] = [
  { county: "Nairobi", registeredVoters: 2535000, turnoutPercent: 72, transmissionLatencyMinutes: 8, stationAnomalyRate: 0.12, influenceSpreadIndex: 0.58, synchronizationIndex: 0.47, incidentCount: 14 },
  { county: "Mombasa", registeredVoters: 690000, turnoutPercent: 63, transmissionLatencyMinutes: 18, stationAnomalyRate: 0.2, influenceSpreadIndex: 0.66, synchronizationIndex: 0.61, incidentCount: 19 },
  { county: "Kisumu", registeredVoters: 583000, turnoutPercent: 77, transmissionLatencyMinutes: 27, stationAnomalyRate: 0.23, influenceSpreadIndex: 0.74, synchronizationIndex: 0.69, incidentCount: 24 },
  { county: "Nakuru", registeredVoters: 1180000, turnoutPercent: 69, transmissionLatencyMinutes: 11, stationAnomalyRate: 0.09, influenceSpreadIndex: 0.51, synchronizationIndex: 0.44, incidentCount: 10 },
  { county: "Uasin Gishu", registeredVoters: 566000, turnoutPercent: 75, transmissionLatencyMinutes: 21, stationAnomalyRate: 0.17, influenceSpreadIndex: 0.63, synchronizationIndex: 0.54, incidentCount: 15 },
  { county: "Garissa", registeredVoters: 241000, turnoutPercent: 81, transmissionLatencyMinutes: 33, stationAnomalyRate: 0.26, influenceSpreadIndex: 0.78, synchronizationIndex: 0.72, incidentCount: 29 },
  { county: "Turkana", registeredVoters: 309000, turnoutPercent: 66, transmissionLatencyMinutes: 24, stationAnomalyRate: 0.15, influenceSpreadIndex: 0.57, synchronizationIndex: 0.49, incidentCount: 17 },
  { county: "Meru", registeredVoters: 774000, turnoutPercent: 70, transmissionLatencyMinutes: 14, stationAnomalyRate: 0.11, influenceSpreadIndex: 0.48, synchronizationIndex: 0.41, incidentCount: 9 },
];

export const mockIntegrityAssessment = calculateElectoralIntegrityAssessment(mockCountyIntegrityInputs);
