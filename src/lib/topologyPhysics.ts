import type { ClusterEdge, ClusterNode } from "@/src/types/graph";
import type { TopologyMode } from "@/src/lib/topologyModes";

export type PhysicsNodeState = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  mass: number;
  riskWeight: number;
  clusterAffinity: number;
};

export type SimulationConfig = {
  speed: number;
  energyIntensity: number;
  stabilization: number;
  frozen: boolean;
  timelineEnergy: number;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function createPhysicsState(nodes: ClusterNode[]): Record<string, PhysicsNodeState> {
  return Object.fromEntries(
    nodes.map((node) => {
      const riskWeight = 1 + node.severity * 2 + (node.riskLevel === "critical" ? 1 : 0);
      const mass = clamp(0.8 + node.stations / 120 + node.severity * 1.8 + node.confidence * 1.2, 0.8, 8.5);
      return [
        node.id,
        { id: node.id, x: node.x, y: node.y, vx: 0, vy: 0, ax: 0, ay: 0, mass, riskWeight, clusterAffinity: Math.max(1, node.relatedClusterIds.length) },
      ];
    }),
  );
}

export function stepSimulation(
  state: Record<string, PhysicsNodeState>,
  nodes: ClusterNode[],
  edges: ClusterEdge[],
  anchors: Record<string, { x: number; y: number }>,
  topologyMode: TopologyMode,
  dt: number,
  config: SimulationConfig,
): Record<string, PhysicsNodeState> {
  if (config.frozen) return state;
  const next: Record<string, PhysicsNodeState> = Object.fromEntries(Object.entries(state).map(([k, v]) => [k, { ...v, ax: 0, ay: 0 }]));
  const nodeList = nodes.map((n) => next[n.id]).filter(Boolean);

  for (let i = 0; i < nodeList.length; i += 1) {
    for (let j = i + 1; j < nodeList.length; j += 1) {
      const a = nodeList[i];
      const b = nodeList[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d2 = Math.max(dx * dx + dy * dy, 0.0035);
      const dist = Math.sqrt(d2);
      const repel = (0.016 * config.energyIntensity) / d2;
      const nx = dx / dist;
      const ny = dy / dist;
      a.ax -= nx * repel / a.mass;
      a.ay -= ny * repel / a.mass;
      b.ax += nx * repel / b.mass;
      b.ay += ny * repel / b.mass;
    }
  }

  for (const edge of edges) {
    const a = next[edge.source];
    const b = next[edge.target];
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.0001);
    const desired = topologyMode === "centralized" ? 0.24 : topologyMode === "decentralized" ? 0.32 : 0.28;
    const k = (0.22 + edge.weight * 0.06) * config.stabilization;
    const spring = (dist - desired) * k;
    const nx = dx / dist;
    const ny = dy / dist;
    a.ax += (nx * spring) / a.mass;
    a.ay += (ny * spring) / a.mass;
    b.ax -= (nx * spring) / b.mass;
    b.ay -= (ny * spring) / b.mass;
  }

  for (const node of nodes) {
    const p = next[node.id];
    const anchor = anchors[node.id] ?? { x: node.x, y: node.y };
    const dx = anchor.x - p.x;
    const dy = anchor.y - p.y;
    const severityPulse = 1 + node.severity * 0.7 + config.timelineEnergy;
    const grav = topologyMode === "centralized" ? 0.19 : topologyMode === "decentralized" ? 0.14 : 0.09;
    p.ax += (dx * grav * severityPulse * config.stabilization) / p.mass;
    p.ay += (dy * grav * severityPulse * config.stabilization) / p.mass;

    const orbit = (0.012 + node.confidence * 0.01) * config.energyIntensity;
    p.ax += -dy * orbit;
    p.ay += dx * orbit;

    if (node.type === "anomaly") {
      for (const other of nodeList) {
        if (other.id === node.id) continue;
        const odx = p.x - other.x;
        const ody = p.y - other.y;
        const dd2 = Math.max(odx * odx + ody * ody, 0.006);
        const attract = (0.0024 * p.riskWeight * config.energyIntensity * severityPulse) / dd2;
        other.ax += odx * attract;
        other.ay += ody * attract;
      }
    }
  }

  const damping = clamp(0.92 - config.stabilization * 0.12, 0.72, 0.95);
  const speed = config.speed;
  const delta = Math.min(0.05, dt * speed);

  for (const node of nodes) {
    const p = next[node.id];
    p.vx = (p.vx + p.ax * delta) * damping;
    p.vy = (p.vy + p.ay * delta) * damping;
    p.x += p.vx * delta;
    p.y += p.vy * delta;
  }

  return next;
}
