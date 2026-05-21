export interface InfluenceStation {
  id: string;
  name: string;
  county: string;
  constituency: string;
  ward: string;
  lat: number;
  lng: number;
  turnout: number;
  anomalyScore: number;
  temporalSpike?: number;
}

export interface InfluenceStationResult extends InfluenceStation {
  influenceScore: number;
  propagatedRisk: number;
  networkCentrality: number;
  connectedStations: string[];
  neighborCount: number;
  influenceStrength: number;
}

export interface InfluenceConnection {
  sourceId: string;
  targetId: string;
  weight: number;
  distanceKm: number;
}

export interface InfluenceEngineResult {
  stations: InfluenceStationResult[];
  connections: InfluenceConnection[];
}

const EARTH_RADIUS_KM = 6371;
const DEFAULT_RADIUS_KM = 5;

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function getNearbyStations(station: InfluenceStation, allStations: InfluenceStation[], radiusKm = DEFAULT_RADIUS_KM) {
  return allStations
    .filter((candidate) => candidate.id !== station.id)
    .map((candidate) => ({
      station: candidate,
      distanceKm: calculateDistance(station.lat, station.lng, candidate.lat, candidate.lng),
    }))
    .filter((entry) => entry.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function calculateInfluenceWeight(source: InfluenceStation, target: InfluenceStation, distanceKm: number, radiusKm = DEFAULT_RADIUS_KM): number {
  const distanceFactor = clamp((1 - distanceKm / radiusKm) * 100) / 100;
  const anomalyFactor = clamp(source.anomalyScore) / 100;
  const turnoutFactor = clamp(source.turnout) / 100;
  const temporalAlignment = 1 - Math.min(Math.abs((source.temporalSpike ?? 0) - (target.temporalSpike ?? 0)), 100) / 100;

  const wardBonus = source.ward === target.ward ? 1.2 : 1;
  const constituencyBonus = source.constituency === target.constituency ? 1.1 : 1;

  const baseWeight = distanceFactor * (0.45 + anomalyFactor * 0.35 + turnoutFactor * 0.15 + temporalAlignment * 0.05);
  return Math.min(1, baseWeight * wardBonus * constituencyBonus);
}

export function calculatePropagationRisk(station: InfluenceStation, neighbors: Array<{ station: InfluenceStation; weight: number }>): number {
  const ownRisk = clamp(station.anomalyScore * 0.65 + station.turnout * 0.2 + (station.temporalSpike ?? 0) * 0.15);

  const neighborImpact = neighbors.reduce((sum, neighbor) => {
    const sourceSignal = clamp(
      neighbor.station.anomalyScore * 0.6 +
        neighbor.station.turnout * 0.2 +
        (neighbor.station.temporalSpike ?? 0) * 0.2,
    );

    return sum + sourceSignal * neighbor.weight;
  }, 0);

  const compoundedRisk = ownRisk + neighborImpact;
  return clamp(compoundedRisk);
}

export function calculateNetworkCentrality(stationId: string, allConnections: InfluenceConnection[], totalStations: number): number {
  const connected = allConnections.filter((edge) => edge.sourceId === stationId || edge.targetId === stationId);
  if (!connected.length || totalStations <= 1) return 0;

  const degreeCentrality = connected.length / (totalStations - 1);
  const weightedCentrality = connected.reduce((sum, edge) => sum + edge.weight, 0) / connected.length;

  return clamp((degreeCentrality * 0.7 + weightedCentrality * 0.3) * 100);
}

export function buildNetworkInfluence(stations: InfluenceStation[], radiusKm = DEFAULT_RADIUS_KM): InfluenceEngineResult {
  const connections: InfluenceConnection[] = [];

  for (const source of stations) {
    const neighbors = getNearbyStations(source, stations, radiusKm);
    for (const neighbor of neighbors) {
      const weight = calculateInfluenceWeight(source, neighbor.station, neighbor.distanceKm, radiusKm);
      if (weight <= 0) continue;

      connections.push({
        sourceId: source.id,
        targetId: neighbor.station.id,
        weight,
        distanceKm: neighbor.distanceKm,
      });
    }
  }

  const results: InfluenceStationResult[] = stations.map((station) => {
    const outgoing = connections.filter((edge) => edge.sourceId === station.id);
    const incoming = connections.filter((edge) => edge.targetId === station.id);
    const stationNeighbors = outgoing.map((edge) => {
      const target = stations.find((candidate) => candidate.id === edge.targetId);
      return target ? { station: target, weight: edge.weight } : null;
    }).filter((entry): entry is { station: InfluenceStation; weight: number } => entry !== null);

    const influenceScore = clamp(outgoing.reduce((sum, edge) => sum + edge.weight, 0) * 25);
    const influenceStrength = clamp((influenceScore + incoming.reduce((sum, edge) => sum + edge.weight * 100, 0)) / 2);
    const propagatedRisk = calculatePropagationRisk(station, stationNeighbors);

    return {
      ...station,
      influenceScore,
      propagatedRisk,
      networkCentrality: calculateNetworkCentrality(station.id, connections, stations.length),
      connectedStations: Array.from(new Set([...outgoing.map((edge) => edge.targetId), ...incoming.map((edge) => edge.sourceId)])),
      neighborCount: outgoing.length,
      influenceStrength,
    };
  });

  return { stations: results, connections };
}
