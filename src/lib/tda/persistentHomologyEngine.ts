export interface PersistenceNode {
  id: string;
  x: number;
  y: number;
  weight?: number;
  sync?: number;
}

export interface PersistenceEdge {
  source: string;
  target: string;
  strength: number;
}

export interface PersistenceInterval {
  id: string;
  dimension: 0 | 1;
  birth: number;
  death: number;
  persistence: number;
  members: string[];
}

export interface PersistenceGraph {
  nodes: PersistenceNode[];
  edges: PersistenceEdge[];
  adjacency: Record<string, string[]>;
}

const distance = (a: PersistenceNode, b: PersistenceNode) => Math.hypot(a.x - b.x, a.y - b.y);

export function buildPersistenceGraph(nodes: PersistenceNode[], threshold = 0.35): PersistenceGraph {
  const edges: PersistenceEdge[] = [];
  const adjacency: Record<string, string[]> = Object.fromEntries(nodes.map((node) => [node.id, []]));

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const d = distance(nodes[i], nodes[j]);
      const strength = Math.max(0, 1 - d / threshold);
      if (strength <= 0) continue;
      edges.push({ source: nodes[i].id, target: nodes[j].id, strength });
      adjacency[nodes[i].id].push(nodes[j].id);
      adjacency[nodes[j].id].push(nodes[i].id);
    }
  }

  return { nodes, edges, adjacency };
}

export function calculatePersistence(graph: PersistenceGraph): PersistenceInterval[] {
  const intervals: PersistenceInterval[] = [];
  const visited = new Set<string>();

  graph.nodes.forEach((node) => {
    if (visited.has(node.id)) return;
    const stack = [node.id];
    const component: string[] = [];
    while (stack.length) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      component.push(current);
      graph.adjacency[current].forEach((next) => {
        if (!visited.has(next)) stack.push(next);
      });
    }

    const weights = component.map((id) => graph.nodes.find((n) => n.id === id)?.weight ?? 0.4);
    const birth = Math.max(0.03, 1 - component.length / Math.max(3, graph.nodes.length));
    const death = Math.min(1, birth + 0.2 + Math.max(...weights) * 0.7);
    intervals.push({
      id: `b0-${component[0]}`,
      dimension: 0,
      birth,
      death,
      persistence: death - birth,
      members: component,
    });
  });

  graph.edges
    .filter((edge) => edge.strength > 0.35)
    .slice(0, Math.max(2, Math.floor(graph.edges.length / 6)))
    .forEach((edge, idx) => {
      const birth = Math.max(0.08, 0.35 - edge.strength * 0.2 + idx * 0.025);
      const death = Math.min(1, birth + 0.26 + edge.strength * 0.55);
      intervals.push({
        id: `b1-${edge.source}-${edge.target}`,
        dimension: 1,
        birth,
        death,
        persistence: death - birth,
        members: [edge.source, edge.target],
      });
    });

  return intervals.sort((a, b) => b.persistence - a.persistence);
}

export function detectTopologicalVoids(nodes: PersistenceNode[], intervals: PersistenceInterval[]) {
  const loops = intervals.filter((interval) => interval.dimension === 1);
  const centroid = nodes.reduce((acc, node) => ({ x: acc.x + node.x / nodes.length, y: acc.y + node.y / nodes.length }), { x: 0, y: 0 });

  return loops.map((loop, idx) => ({
    id: `void-${idx}`,
    center: {
      x: centroid.x + Math.cos(idx * 1.2) * (0.05 + loop.persistence * 0.08),
      y: centroid.y + Math.sin(idx * 1.2) * (0.05 + loop.persistence * 0.08),
    },
    radius: 0.05 + loop.persistence * 0.2,
    persistence: loop.persistence,
    members: loop.members,
  }));
}

export function buildBettiFeatures(intervals: PersistenceInterval[]) {
  const b0 = intervals.filter((interval) => interval.dimension === 0).length;
  const b1 = intervals.filter((interval) => interval.dimension === 1).length;
  const strength = intervals.reduce((sum, interval) => sum + interval.persistence, 0) / Math.max(1, intervals.length);
  const durability = intervals.filter((interval) => interval.persistence > 0.38).length / Math.max(1, intervals.length);
  const entropy = intervals.reduce((sum, interval) => sum + (-interval.persistence * Math.log(interval.persistence + 1e-3)), 0);

  return {
    betti0: b0,
    betti1: b1,
    persistenceStrength: Number(strength.toFixed(3)),
    clusterDurability: Number(durability.toFixed(3)),
    spatialEntropy: Number(entropy.toFixed(3)),
  };
}
