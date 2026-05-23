import type { SimulationScenario } from "@/src/types/simulation";

export const simulationScenarios: SimulationScenario[] = [
  { id: "A", label: "Scenario A: Normal peaceful election", summary: "Baseline modeled turnout with low simulated anomaly pressure.", anomalyMultiplier: 0.65, delayBias: 0.8, turnoutBias: 1, propagationBias: 0.7, confidenceFloor: 82 },
  { id: "B", label: "Scenario B: Artificial turnout inflation", summary: "Modeled turnout spikes in selected stations with elevated simulated anomaly signals.", anomalyMultiplier: 1.35, delayBias: 1.1, turnoutBias: 1.2, propagationBias: 1.2, confidenceFloor: 70 },
  { id: "C", label: "Scenario C: Regional suppression patterns", summary: "Targeted turnout damping in selected counties with uneven reporting cadence.", anomalyMultiplier: 1.25, delayBias: 1.35, turnoutBias: 0.82, propagationBias: 1.15, confidenceFloor: 68 },
  { id: "D", label: "Scenario D: Delayed result transmission", summary: "Station activity progresses with significant temporal reporting lag.", anomalyMultiplier: 0.95, delayBias: 1.95, turnoutBias: 0.98, propagationBias: 0.92, confidenceFloor: 76 },
  { id: "E", label: "Scenario E: Coordinated anomaly clusters", summary: "Synchronized simulated risk clusters expand along graph-connected regions.", anomalyMultiplier: 1.62, delayBias: 1.2, turnoutBias: 1.05, propagationBias: 1.75, confidenceFloor: 63 },
  { id: "F", label: "Scenario F: Cross-border instability propagation", summary: "Estimated propagation pressure crosses regional boundaries and raises systemic risk.", anomalyMultiplier: 1.5, delayBias: 1.4, turnoutBias: 0.95, propagationBias: 1.9, confidenceFloor: 60 },
];

export const counties = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Garissa", "Turkana", "Uasin Gishu", "Kilifi"];
