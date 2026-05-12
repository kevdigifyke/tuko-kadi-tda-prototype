import type { ClusterEdge, ClusterNode } from "@/src/types/graph";

export type TopologyMode = "centralized" | "decentralized" | "distributed";

export type TopologyMeta = { key: TopologyMode; label: string; subtitle: string; shortcut: "1" | "2" | "3"; };

const RISK_SCORE: Record<ClusterNode["riskLevel"], number> = { low: 0.2, medium: 0.45, high: 0.75, critical: 1 };

export const TOPOLOGY_MODES: TopologyMeta[] = [
  { key: "centralized", label: "Centralized", subtitle: "Single anomaly gravity core", shortcut: "1" },
  { key: "decentralized", label: "Decentralized", subtitle: "Multi-hub anomaly wells", shortcut: "2" },
  { key: "distributed", label: "Distributed", subtitle: "Peer relationship mesh", shortcut: "3" },
];

const hash = (text: string) => Array.from(text).reduce((acc, c) => acc + c.charCodeAt(0), 0);

export function cycleTopology(mode: TopologyMode, direction: 1 | -1 = 1): TopologyMode {
  const idx = TOPOLOGY_MODES.findIndex((m) => m.key === mode);
  const next = (idx + direction + TOPOLOGY_MODES.length) % TOPOLOGY_MODES.length;
  return TOPOLOGY_MODES[next].key;
}

export function buildTopologyLayout(nodes: ClusterNode[], edges: ClusterEdge[], mode: TopologyMode, t = performance.now()): Record<string, { x: number; y: number }> {
  if (mode === "centralized") {
    return Object.fromEntries(nodes.map((n, i) => {
      const riskPull = 1 - RISK_SCORE[n.riskLevel] * 0.72;
      const angle = ((i / Math.max(nodes.length, 1)) * Math.PI * 2) + t * 0.00008 + (hash(n.id) % 90) * 0.01;
      const radius = 0.15 + riskPull * 0.85;
      return [n.id, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.74 }];
    }));
  }
  if (mode === "decentralized") {
    const hubs = ["cross-race", "turnout", "source", "ocr"];
    return Object.fromEntries(nodes.map((n, i) => {
      const group = hubs.findIndex((h) => n.issue.toLowerCase().includes(h));
      const g = group >= 0 ? group : hash(n.id) % 4;
      const hubAngle = (g / 4) * Math.PI * 2;
      const hubX = Math.cos(hubAngle) * 0.55;
      const hubY = Math.sin(hubAngle) * 0.38;
      const local = (i * 0.9 + hash(n.id) * 0.01) % (Math.PI * 2);
      const radius = 0.14 + (1 - RISK_SCORE[n.riskLevel]) * 0.2;
      return [n.id, { x: hubX + Math.cos(local) * radius, y: hubY + Math.sin(local) * radius }];
    }));
  }
  const adjacency = new Map<string, number>();
  for (const e of edges) {
    adjacency.set(e.source, (adjacency.get(e.source) ?? 0) + 1);
    adjacency.set(e.target, (adjacency.get(e.target) ?? 0) + 1);
  }
  return Object.fromEntries(nodes.map((n, i) => {
    const degree = adjacency.get(n.id) ?? 1;
    const spiral = i / Math.max(nodes.length, 1);
    const angle = spiral * 9 + hash(n.id) * 0.02;
    const radius = 0.2 + Math.min(0.8, spiral + degree * 0.01);
    return [n.id, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.7 }];
  }));
}
