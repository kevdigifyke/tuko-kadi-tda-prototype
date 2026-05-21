import { pollingStations } from "@/src/data/geo/pollingStations";

type NodeType = "polling_station" | "ward" | "constituency" | "county";

export interface ElectionGraphNode {
  id: string;
  label: string;
  type: NodeType;
  turnout: number;
  anomalyScore: number;
  influence: number;
  x?: number;
  y?: number;
}

export interface ElectionGraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  influenceFlow: number;
  anomalyFlow: number;
}

export interface ElectionGraph {
  nodes: ElectionGraphNode[];
  edges: ElectionGraphEdge[];
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function buildElectionGraph(): ElectionGraph {
  const nodes: ElectionGraphNode[] = [];
  const edges: ElectionGraphEdge[] = [];
  const wardMap = new Map<string, ElectionGraphNode>();
  const constituencyMap = new Map<string, ElectionGraphNode>();
  const countyMap = new Map<string, ElectionGraphNode>();

  for (const station of pollingStations) {
    const stationId = `station:${station.id}`;
    nodes.push({
      id: stationId,
      label: station.name,
      type: "polling_station",
      turnout: station.turnout,
      anomalyScore: station.anomalyScore,
      influence: 0,
    });

    const wardId = `ward:${slugify(station.ward)}`;
    if (!wardMap.has(wardId)) {
      wardMap.set(wardId, {
        id: wardId,
        label: station.ward,
        type: "ward",
        turnout: 0,
        anomalyScore: 0,
        influence: 0,
      });
    }

    const constituencyId = `constituency:${slugify(station.constituency)}`;
    if (!constituencyMap.has(constituencyId)) {
      constituencyMap.set(constituencyId, {
        id: constituencyId,
        label: station.constituency,
        type: "constituency",
        turnout: 0,
        anomalyScore: 0,
        influence: 0,
      });
    }

    const countyId = `county:${slugify(station.county)}`;
    if (!countyMap.has(countyId)) {
      countyMap.set(countyId, {
        id: countyId,
        label: station.county,
        type: "county",
        turnout: 0,
        anomalyScore: 0,
        influence: 0,
      });
    }

    edges.push({
      id: `${stationId}->${wardId}`,
      source: stationId,
      target: wardId,
      weight: 0.55,
      influenceFlow: 0,
      anomalyFlow: 0,
    });
    edges.push({
      id: `${wardId}->${constituencyId}`,
      source: wardId,
      target: constituencyId,
      weight: 0.8,
      influenceFlow: 0,
      anomalyFlow: 0,
    });
    edges.push({
      id: `${constituencyId}->${countyId}`,
      source: constituencyId,
      target: countyId,
      weight: 1,
      influenceFlow: 0,
      anomalyFlow: 0,
    });
  }

  const aggregateNodeStats = new Map<string, { turnout: number; anomaly: number; count: number }>();
  for (const edge of edges) {
    const source = nodes.find((n) => n.id === edge.source) ?? wardMap.get(edge.source) ?? constituencyMap.get(edge.source);
    if (!source) continue;
    const current = aggregateNodeStats.get(edge.target) ?? { turnout: 0, anomaly: 0, count: 0 };
    aggregateNodeStats.set(edge.target, {
      turnout: current.turnout + source.turnout,
      anomaly: current.anomaly + source.anomalyScore,
      count: current.count + 1,
    });
  }

  const aggregates = [...wardMap.values(), ...constituencyMap.values(), ...countyMap.values()].map((node) => {
    const stats = aggregateNodeStats.get(node.id);
    if (stats && stats.count > 0) {
      return {
        ...node,
        turnout: stats.turnout / stats.count,
        anomalyScore: stats.anomaly / stats.count,
      };
    }
    return node;
  });

  const graph: ElectionGraph = { nodes: [...nodes, ...aggregates], edges };
  return calculateNodeInfluence(graph);
}

export function calculateNodeInfluence(graph: ElectionGraph): ElectionGraph {
  const degree = new Map<string, number>();
  graph.edges.forEach((edge) => {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
  });

  graph.nodes.forEach((node) => {
    const connectivity = degree.get(node.id) ?? 1;
    const turnoutSignal = node.turnout / 100;
    const anomalySignal = node.anomalyScore / 100;
    node.influence = Number((0.5 * connectivity + 0.3 * turnoutSignal + 0.2 * anomalySignal).toFixed(3));
  });

  return graph;
}

export function detectGraphCommunities(graph: ElectionGraph) {
  const groups = new Map<string, ElectionGraphNode[]>();
  for (const node of graph.nodes) {
    const bucket = `${node.type}:${Math.floor(node.turnout / 10)}`;
    const list = groups.get(bucket) ?? [];
    list.push(node);
    groups.set(bucket, list);
  }
  return [...groups.entries()].map(([communityId, members]) => ({ communityId, members }));
}

export function runInfluencePropagation(graph: ElectionGraph, iterations = 6) {
  const score = new Map(graph.nodes.map((n) => [n.id, n.influence]));

  for (let i = 0; i < iterations; i += 1) {
    const next = new Map(score);
    for (const edge of graph.edges) {
      const src = score.get(edge.source) ?? 0;
      const propagated = src * edge.weight * 0.18;
      next.set(edge.target, (next.get(edge.target) ?? 0) + propagated);
      edge.influenceFlow = propagated;
    }
    for (const [id, value] of next) {
      next.set(id, Number((value * 0.92).toFixed(4)));
    }
    next.forEach((v, k) => score.set(k, v));
  }

  graph.nodes.forEach((n) => (n.influence = score.get(n.id) ?? n.influence));
  return graph;
}

export function detectCentrality(graph: ElectionGraph) {
  const incoming = new Map<string, number>();
  const outgoing = new Map<string, number>();

  graph.edges.forEach((edge) => {
    outgoing.set(edge.source, (outgoing.get(edge.source) ?? 0) + edge.weight);
    incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + edge.weight);
  });

  return graph.nodes
    .map((node) => ({
      nodeId: node.id,
      label: node.label,
      centrality: Number((((incoming.get(node.id) ?? 0) + (outgoing.get(node.id) ?? 0)) * (1 + node.influence)).toFixed(3)),
    }))
    .sort((a, b) => b.centrality - a.centrality);
}

export function calculateRiskPropagation(graph: ElectionGraph) {
  return graph.edges.map((edge) => {
    const source = graph.nodes.find((n) => n.id === edge.source);
    const target = graph.nodes.find((n) => n.id === edge.target);
    const anomalyVector = ((source?.anomalyScore ?? 0) + (target?.anomalyScore ?? 0)) / 200;
    const risk = Number((anomalyVector * edge.weight * 100).toFixed(2));
    edge.anomalyFlow = risk;
    return { edgeId: edge.id, risk };
  });
}
