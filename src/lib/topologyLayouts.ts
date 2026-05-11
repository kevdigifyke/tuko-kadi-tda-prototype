import type { ClusterEdge, ClusterNode } from "@/src/types/graph";

export type TopologyMode = "Centralized" | "Decentralized" | "Distributed";

const TAU = Math.PI * 2;

export function applyTopologyLayout(nodes: ClusterNode[], edges: ClusterEdge[], mode: TopologyMode): ClusterNode[] {
  if (mode === "Centralized") return buildCentralized(nodes, edges);
  if (mode === "Decentralized") return buildDecentralized(nodes);
  return buildDistributed(nodes, edges);
}

function buildCentralized(nodes: ClusterNode[], edges: ClusterEdge[]): ClusterNode[] {
  if (nodes.length === 0) return nodes;
  const center = nodes.reduce((best, node) => (node.clusterMass > best.clusterMass ? node : best), nodes[0]);
  const related = new Map<string, number>();
  for (const edge of edges) {
    if (edge.source === center.id) related.set(edge.target, edge.weight);
    if (edge.target === center.id) related.set(edge.source, edge.weight);
  }

  const others = nodes.filter((n) => n.id !== center.id).sort((a, b) => b.clusterMass - a.clusterMass);
  return nodes.map((node) => {
    if (node.id === center.id) return { ...node, x: 0, y: 0 };
    const index = others.findIndex((n) => n.id === node.id);
    const relation = related.get(node.id) ?? 0.25;
    const closeness = node.clusterMass * 0.65 + relation * 35;
    const orbit = 0.85 + (100 - closeness) / 55 + Math.floor(index / 14) * 0.35;
    const angle = (index / Math.max(1, others.length)) * TAU;
    return { ...node, x: Math.cos(angle) * orbit, y: Math.sin(angle) * orbit };
  });
}

function buildDecentralized(nodes: ClusterNode[]): ClusterNode[] {
  const hubs = new Map<string, ClusterNode[]>();
  for (const node of nodes) {
    const key = `${node.primaryIssue}|${node.riskLevel}|${node.wards > 2 ? "regional" : "local"}`;
    const group = hubs.get(key) ?? [];
    group.push(node);
    hubs.set(key, group);
  }

  const entries = [...hubs.entries()].sort((a, b) => sumMass(b[1]) - sumMass(a[1]));
  const indexById = new Map<string, { hubIndex: number; nodeIndex: number; count: number; hubMass: number }>();
  entries.forEach(([_, group], hubIndex) => {
    const hubMass = sumMass(group);
    group.sort((a, b) => b.clusterMass - a.clusterMass).forEach((node, nodeIndex) => {
      indexById.set(node.id, { hubIndex, nodeIndex, count: group.length, hubMass });
    });
  });

  return nodes.map((node) => {
    const meta = indexById.get(node.id);
    if (!meta) return node;
    const hubAngle = (meta.hubIndex / Math.max(1, entries.length)) * TAU;
    const hubRadius = 1.25 + (100 - Math.min(meta.hubMass / Math.max(1, meta.count), 100)) / 140;
    const hubX = Math.cos(hubAngle) * (hubRadius + meta.hubIndex * 0.06);
    const hubY = Math.sin(hubAngle) * (hubRadius + meta.hubIndex * 0.06);
    const nodeAngle = (meta.nodeIndex / Math.max(meta.count, 1)) * TAU;
    const orbit = 0.32 + (100 - node.clusterMass) / 180;
    return { ...node, x: hubX + Math.cos(nodeAngle) * orbit, y: hubY + Math.sin(nodeAngle) * orbit };
  });
}

function buildDistributed(nodes: ClusterNode[], edges: ClusterEdge[]): ClusterNode[] {
  const degree = new Map<string, number>();
  for (const edge of edges) {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + edge.weight);
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + edge.weight);
  }

  const sorted = [...nodes].sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0));
  return nodes.map((node) => {
    const idx = sorted.findIndex((n) => n.id === node.id);
    const bridge = degree.get(node.id) ?? 0;
    const ring = Math.floor(idx / 18);
    const angle = (idx / Math.max(1, sorted.length)) * TAU * 1.7;
    const radius = 0.8 + ring * 0.34 + (100 - node.clusterMass) / 220 + (bridge > 3 ? -0.08 : 0.06);
    return { ...node, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

function sumMass(nodes: ClusterNode[]) { return nodes.reduce((sum, n) => sum + n.clusterMass, 0); }
