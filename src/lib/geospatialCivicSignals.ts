import { pollingStations } from "@/src/data/geo/pollingStations";
import type { TelemetryEvent } from "@/src/store/useSimulationStore";

export type CivicSignalStation = {
  id: string;
  name: string;
  county: string;
  lat: number;
  lng: number;
  environmentalPressure: number;
  weatherPressure: number;
  floodingRisk: number;
  infrastructureInstability: number;
  communicationsOutage: number;
  mobilityPressure: number;
  movementPressure: number;
  congestionScore: number;
  transportAccessibility: number;
  accessibilityScore: number;
  accessibilityFriction: number;
  turnoutPressure: number;
  queuePressure: number;
  operationalStress: number;
};

export type CivicFlowCorridor = {
  id: string;
  label: string;
  from: [number, number];
  to: [number, number];
  pressure: number;
  constraint: "mobility" | "accessibility" | "environmental" | "turnout";
};

export type CivicSignalSummary = {
  environmentalPressure: number;
  mobilityPressure: number;
  accessibilityScore: number;
  congestionScore: number;
  turnoutPressure: number;
  queuePressure: number;
  operationalStress: number;
  dominantCorridor: string;
  dominantConstraint: CivicFlowCorridor["constraint"];
  narrative: string;
};

export type CivicSignalIntelligence = {
  stations: CivicSignalStation[];
  corridors: CivicFlowCorridor[];
  bottlenecks: CivicSignalStation[];
  accessibilityConstraints: CivicSignalStation[];
  environmentalHotspots: CivicSignalStation[];
  summary: CivicSignalSummary;
};

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const wave = (seed: number, tick: number, scale = 1) => (Math.sin(seed * 1.77 + tick / (8.5 * scale)) + 1) / 2;
const stationSeed = (station: { id: string; county: string; voters: number }) =>
  station.id.charCodeAt(station.id.length - 1) * 11 + station.county.length * 7 + station.voters / 37;

const avg = (values: number[]) => Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length));

function telemetryBias(telemetry: TelemetryEvent[], station: { county: string; constituency: string; ward: string }) {
  const matches = telemetry.filter(
    (event) => event.county === station.county || event.constituency === station.constituency || event.ward === station.ward,
  );
  if (!matches.length) return { risk: 0, turnout: 0, congestion: 0 };
  return {
    risk: avg(matches.map((event) => event.aiRiskScore)) * 0.18,
    turnout: avg(matches.map((event) => event.turnout)) * 0.14,
    congestion: matches.filter((event) => event.simulationStatus !== "STABLE").length * 5,
  };
}

export function buildGeospatialCivicSignals(params: { tick: number; telemetry: TelemetryEvent[] }): CivicSignalIntelligence {
  const { tick, telemetry } = params;

  const stations = pollingStations.map((station, index): CivicSignalStation => {
    const seed = stationSeed(station) + index;
    const telemetrySignal = telemetryBias(telemetry, station);
    const riskBias = station.risk === "high" ? 18 : station.risk === "medium" ? 9 : 2;
    const urbanBias = station.voters > 1800 ? 12 : station.voters > 1450 ? 7 : 2;
    const coastalFloodBias = ["Mombasa", "Kisumu"].includes(station.county) ? 18 : station.county === "Nairobi" ? 7 : 3;

    const weatherPressure = clamp(24 + wave(seed, tick) * 42 + coastalFloodBias * 0.35 + telemetrySignal.risk * 0.22);
    const floodingRisk = clamp(14 + wave(seed + 2.4, tick, 1.4) * 38 + coastalFloodBias + riskBias * 0.12);
    const infrastructureInstability = clamp(18 + riskBias + wave(seed + 4.8, tick, 1.8) * 34 + telemetrySignal.risk * 0.35);
    const communicationsOutage = clamp(8 + wave(seed + 8.2, tick, 0.82) * 30 + telemetrySignal.congestion * 1.4);
    const environmentalPressure = avg([weatherPressure, floodingRisk, infrastructureInstability, communicationsOutage]);

    const movementPressure = clamp(26 + urbanBias + wave(seed + 1.7, tick, 0.7) * 44 + telemetrySignal.turnout * 0.32);
    const congestionScore = clamp(18 + urbanBias * 1.6 + wave(seed + 3.1, tick, 0.92) * 47 + telemetrySignal.congestion);
    const transportAccessibility = clamp(88 - congestionScore * 0.42 - floodingRisk * 0.2 - riskBias * 0.18);
    const mobilityPressure = avg([movementPressure, congestionScore, 100 - transportAccessibility]);

    const accessibilityFriction = clamp(100 - transportAccessibility + infrastructureInstability * 0.24 + communicationsOutage * 0.18);
    const accessibilityScore = clamp(100 - accessibilityFriction);
    const turnoutPressure = clamp(22 + station.voters / 38 + riskBias * 0.6 + movementPressure * 0.22 + telemetrySignal.turnout * 0.44);
    const queuePressure = clamp(turnoutPressure * 0.58 + congestionScore * 0.28 + accessibilityFriction * 0.22);
    const operationalStress = clamp(environmentalPressure * 0.28 + mobilityPressure * 0.28 + queuePressure * 0.26 + riskBias);

    return {
      id: station.id,
      name: station.name,
      county: station.county,
      lat: station.lat,
      lng: station.lng,
      environmentalPressure,
      weatherPressure,
      floodingRisk,
      infrastructureInstability,
      communicationsOutage,
      mobilityPressure,
      movementPressure,
      congestionScore,
      transportAccessibility,
      accessibilityScore,
      accessibilityFriction,
      turnoutPressure,
      queuePressure,
      operationalStress,
    };
  });

  const sortedByStress = [...stations].sort((a, b) => b.operationalStress - a.operationalStress);
  const corridors: CivicFlowCorridor[] = sortedByStress.slice(0, 4).map((station, index) => {
    const peer = sortedByStress[(index + 1) % sortedByStress.length];
    const pressure = avg([station.mobilityPressure, station.turnoutPressure, peer.accessibilityFriction]);
    const constraint: CivicFlowCorridor["constraint"] =
      station.accessibilityFriction > station.environmentalPressure && station.accessibilityFriction > station.turnoutPressure
        ? "accessibility"
        : station.environmentalPressure > station.mobilityPressure
          ? "environmental"
          : station.turnoutPressure > station.mobilityPressure
            ? "turnout"
            : "mobility";
    return {
      id: `civic-corridor-${station.id}-${peer.id}`,
      label: `${station.county} → ${peer.county}`,
      from: [station.lat, station.lng],
      to: [peer.lat, peer.lng],
      pressure,
      constraint,
    };
  });

  const dominant = corridors[0] ?? {
    label: "National Civic Mesh",
    constraint: "mobility" as const,
    pressure: 0,
  };
  const summary: CivicSignalSummary = {
    environmentalPressure: avg(stations.map((station) => station.environmentalPressure)),
    mobilityPressure: avg(stations.map((station) => station.mobilityPressure)),
    accessibilityScore: avg(stations.map((station) => station.accessibilityScore)),
    congestionScore: avg(stations.map((station) => station.congestionScore)),
    turnoutPressure: avg(stations.map((station) => station.turnoutPressure)),
    queuePressure: avg(stations.map((station) => station.queuePressure)),
    operationalStress: avg(stations.map((station) => station.operationalStress)),
    dominantCorridor: dominant.label,
    dominantConstraint: dominant.constraint,
    narrative: `Elevated turnout pressure detected in ${dominant.label} corridor due to simulated ${dominant.constraint} constraints.`,
  };

  return {
    stations,
    corridors,
    bottlenecks: sortedByStress.slice(0, 3),
    accessibilityConstraints: [...stations].sort((a, b) => b.accessibilityFriction - a.accessibilityFriction).slice(0, 3),
    environmentalHotspots: [...stations].sort((a, b) => b.environmentalPressure - a.environmentalPressure).slice(0, 3),
    summary,
  };
}
