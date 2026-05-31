import { counties } from "@/src/data/simulation/scenarios";
import type { ScenarioId, SimulationScenario, SimulationTick, SyntheticStationSnapshot } from "@/src/types/simulation";

const stationCount = 64;

const seeded = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const constituency = (county: string, i: number) => `${county} Constituency ${((i % 6) + 1).toString().padStart(2, "0")}`;

export const generateSyntheticTick = (tick: number, scenario: SimulationScenario): SimulationTick => {
  const stations: SyntheticStationSnapshot[] = Array.from({ length: stationCount }).map((_, i) => {
    const county = counties[i % counties.length];
    const base = seeded((tick + 1) * (i + 3));
    const volumeBoost = scenario.telemetryVolume / 240;
    const activationThreshold = Math.max(0.04, 0.94 - tick / 110 - volumeBoost);
    const isActive = base > activationThreshold;
    const registeredVoters = 500 + Math.round(seeded(i * 11.7) * 1900);
    const turnoutRaw = Math.min(0.97, Math.max(0.21, (0.36 + seeded(i + tick * 0.5) * 0.5) * scenario.turnoutBias));
    const votes = isActive ? Math.round(registeredVoters * turnoutRaw) : 0;
    const anomalyPressure = 0.86 + scenario.anomalyFrequency / 100;
    const simulatedAnomalyScore = Math.min(1, seeded((i + 8) * (tick + 4)) * scenario.anomalyMultiplier * anomalyPressure);
    const delayMinutes = Math.round((7 + seeded(i * 2.41 + tick * 5.1) * 165) * scenario.delayBias);
    const integrityIndex = Math.max(35, Math.round(96 - simulatedAnomalyScore * 48 - scenario.propagationBias * 4));

    return {
      id: `SIM-PS-${String(i + 1).padStart(4, "0")}`,
      county,
      constituency: constituency(county, i),
      registeredVoters,
      votes,
      turnoutPercent: Math.round(turnoutRaw * 100),
      isActive,
      simulatedAnomalyScore,
      delayMinutes,
      integrityIndex,
      pulse: Math.max(0, Math.sin((tick + i) / 6)),
    };
  });

  const activeStations = stations.filter((s) => s.isActive);
  const anomalies = activeStations.filter((s) => s.simulatedAnomalyScore > 0.66).length;
  const avgIntegrity = activeStations.length ? activeStations.reduce((a, b) => a + b.integrityIndex, 0) / activeStations.length : 98;
  const telemetryIntensity = Math.min(100, Math.round(scenario.telemetryVolume * 0.72 + (activeStations.length / stationCount) * 42));
  const propagationIntensity = Math.min(100, Math.round(scenario.propagationIntensity * 0.68 + anomalies * scenario.propagationBias * 2.1));
  const turnoutPressure = Math.min(100, Math.round(scenario.turnoutPressure * 0.72 + (activeStations.length / stationCount) * 28));
  const civicSignalPressure = Math.min(100, Math.round(scenario.civicSignalPressure * 0.7 + propagationIntensity * 0.18 + turnoutPressure * 0.12));
  const riskEscalation = Math.min(100, Math.round((anomalies / stationCount) * 120 * scenario.propagationBias + scenario.anomalyFrequency * 0.24));
  const confidenceScore = Math.max(scenario.confidenceFloor, Math.round(96 - riskEscalation * 0.4 - scenario.delayBias * 4));

  return {
    tick,
    timeLabel: `T+${String(tick * 5).padStart(3, "0")}m`,
    stations,
    heatmapIntensity: Math.min(100, Math.round((activeStations.length / stationCount) * 88 + anomalies * 0.5)),
    clusterGrowth: Math.round(anomalies * scenario.propagationBias),
    integrityIndex: Math.round(avgIntegrity),
    riskEscalation,
    confidenceScore,
    telemetryIntensity,
    propagationIntensity,
    turnoutPressure,
    civicSignalPressure,
  };
};

export const scenarioPair = (left: ScenarioId, right: ScenarioId) => ({ left, right });
