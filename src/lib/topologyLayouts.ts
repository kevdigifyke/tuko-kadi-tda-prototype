import { getClusterMass, getClusterNodeSize } from "@/src/lib/clusterMass";
import type { ClusterEdge, ClusterNode } from "@/src/types/graph";
import type { TopologyMode } from "@/src/types/topology";

type LayoutInput = {
  nodes: ClusterNode[];
  edges: ClusterEdge[];
  selectedId?: string;
  topologyMode: TopologyMode;
};

const tau = Math.PI * 2;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function layoutTopologyNodes({ nodes, edges, selectedId, topologyMode }: LayoutInput): ClusterNode[] {
  if (!nodes.length) return nodes;
  if (topologyMode === "centralized") return layoutCentralized(nodes, edges, selectedId);
  if (topologyMode === "decentralized") return layoutDecentralized(nodes);
  return layoutDistributed(nodes, edges);
}

function layoutCentralized(nodes: ClusterNode[], edges: ClusterEdge[], selectedId?: string): ClusterNode[] {
  const massById = new Map(nodes.map((node) => [node.id, getClusterMass(node)]));
  const gravityCenter = [...nodes].sort((a, b) => (massById.get(b.id) ?? 0) - (massById.get(a.id) ?? 0))[0];
  const edgeStrengthById = new Map<string, number>();
  for (const edge of edges) {
    edgeStrengthById.set(edge.source, (edgeStrengthById.get(edge.source) ?? 0) + edge.weight);
    edgeStrengthById.set(edge.target, (edgeStrengthById.get(edge.target) ?? 0) + edge.weight);
  }

  const ranked = [...nodes].sort((a, b) => (massById.get(b.id) ?? 0) - (massById.get(a.id) ?? 0));
  const centerId = selectedId && massById.has(selectedId) ? gravityCenter.id : gravityCenter.id;

  return ranked.map((node, index) => {
    const mass = massById.get(node.id) ?? 0.5;
    if (node.id === centerId) return { ...node, x: 0, y: 0, size: getClusterNodeSize(node) };
    const edgeStrength = edgeStrengthById.get(node.id) ?? 0;
    const normalizedStrength = clamp(edgeStrength / 8, 0, 1);
    const ring = 0.22 + (1 - mass) * 0.5 + (1 - normalizedStrength) * 0.15;
    const angle = ((index + 1) * 137.5 * Math.PI) / 180;
    return {
      ...node,
      x: Math.cos(angle) * ring,
      y: Math.sin(angle) * ring,
      size: getClusterNodeSize(node),
    };
  });
}

function layoutDecentralized(nodes: ClusterNode[]): ClusterNode[] {
  const groups = new Map<string, ClusterNode[]>();
  for (const node of nodes) {
    const key = `${node.primaryIssue}|${node.riskLevel}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(node);
  }

  const hubs = [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 7);

  const centers = hubs.map(([key], index) => {
    const angle = (index / Math.max(hubs.length, 1)) * tau;
    return { key, cx: Math.cos(angle) * 0.6, cy: Math.sin(angle) * 0.45 };
  });
  const centerByKey = new Map(centers.map((center) => [center.key, center]));

  return nodes.map((node) => {
    const key = `${node.primaryIssue}|${node.riskLevel}`;
    const bucket = groups.get(key) ?? [node];
    const center = centerByKey.get(key) ?? { cx: 0, cy: 0 };
    const localIndex = bucket.findIndex((candidate) => candidate.id === node.id);
    const angle = (localIndex / Math.max(1, bucket.length)) * tau;
    const orbit = 0.06 + (localIndex % 6) * 0.018;
    return {
      ...node,
      x: center.cx + Math.cos(angle) * orbit,
      y: center.cy + Math.sin(angle) * orbit,
      size: getClusterNodeSize(node),
    };
  });
}

function layoutDistributed(nodes: ClusterNode[], edges: ClusterEdge[]): ClusterNode[] {
  const degreeById = new Map<string, number>();
  for (const edge of edges) {
    degreeById.set(edge.source, (degreeById.get(edge.source) ?? 0) + 1);
    degreeById.set(edge.target, (degreeById.get(edge.target) ?? 0) + 1);
  }

  return nodes.map((node, index) => {
    const degree = degreeById.get(node.id) ?? 0;
    const angle = (index / Math.max(nodes.length, 1)) * tau;
    const radius = 0.12 + (index % 11) * 0.045 + clamp(degree / 20, 0, 0.25);
    const x = node.x ? node.x * 0.85 : Math.cos(angle) * radius;
    const y = node.y ? node.y * 0.85 : Math.sin(angle) * radius;
    return {
      ...node,
      x: clamp(x, -0.95, 0.95),
      y: clamp(y, -0.95, 0.95),
      size: getClusterNodeSize(node),
    };
  });
}
