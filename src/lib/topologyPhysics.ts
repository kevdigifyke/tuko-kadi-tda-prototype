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
  focusNodeId?: string | null;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function createPhysicsState(nodes: ClusterNode[]): Record<string, PhysicsNodeState> {
  return Object.fromEntries(
    nodes.map((node) => {
      const riskWeight = 1 + node.severity * 1.4 + (node.riskLevel === "critical" ? 1 : 0);
      const mass = clamp(1.4 + node.stations / 140 + node.severity * 2 + node.confidence * 1.6, 1.2, 12);
      return [node.id, { id: node.id, x: node.x, y: node.y, vx: 0, vy: 0, ax: 0, ay: 0, mass, riskWeight, clusterAffinity: Math.max(1, node.relatedClusterIds.length) }];
    }),
  );
}

export function stepSimulation(state: Record<string, PhysicsNodeState>, nodes: ClusterNode[], edges: ClusterEdge[], anchors: Record<string, { x: number; y: number }>, topologyMode: TopologyMode, dt: number, config: SimulationConfig): Record<string, PhysicsNodeState> {
  if (config.frozen) return state;
  const next: Record<string, PhysicsNodeState> = Object.fromEntries(Object.entries(state).map(([k, v]) => [k, { ...v, ax: 0, ay: 0 }]));
  const nodeList = nodes.map((n) => next[n.id]).filter(Boolean);
  const focusStrength = config.focusNodeId ? 0.45 : 1;

  for (let i = 0; i < nodeList.length; i += 1) {
    for (let j = i + 1; j < nodeList.length; j += 1) {
      const a = nodeList[i]; const b = nodeList[j];
      const dx = b.x - a.x; const dy = b.y - a.y;
      const d2 = Math.max(dx * dx + dy * dy, 0.008);
      const dist = Math.sqrt(d2);
      const repel = (0.0065 * config.energyIntensity) / d2;
      const nx = dx / dist; const ny = dy / dist;
      a.ax -= nx * repel / a.mass; a.ay -= ny * repel / a.mass;
      b.ax += nx * repel / b.mass; b.ay += ny * repel / b.mass;
    }
  }

  for (const edge of edges) {
    const a = next[edge.source]; const b = next[edge.target]; if (!a || !b) continue;
    const dx = b.x - a.x; const dy = b.y - a.y;
    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.0001);
    const desired = topologyMode === "centralized" ? 0.35 : topologyMode === "decentralized" ? 0.42 : 0.4;
    const k = (0.14 + edge.weight * 0.05) * config.stabilization;
    const spring = (dist - desired) * k;
    const nx = dx / dist; const ny = dy / dist;
    a.ax += (nx * spring) / a.mass; a.ay += (ny * spring) / a.mass;
    b.ax -= (nx * spring) / b.mass; b.ay -= (ny * spring) / b.mass;
  }

  for (const node of nodes) {
    const p = next[node.id]; const anchor = anchors[node.id] ?? { x: node.x, y: node.y };
    const dx = anchor.x - p.x; const dy = anchor.y - p.y;
    const grav = topologyMode === "centralized" ? 0.2 : topologyMode === "decentralized" ? 0.16 : 0.13;
    const pulse = 1 + node.severity * 0.22 + config.timelineEnergy * 0.32;
    p.ax += (dx * grav * pulse * config.stabilization * focusStrength) / p.mass;
    p.ay += (dy * grav * pulse * config.stabilization * focusStrength) / p.mass;

    const orbit = (0.0035 + node.confidence * 0.004) * config.energyIntensity * focusStrength;
    p.ax += -dy * orbit; p.ay += dx * orbit;
  }

  const damping = clamp(0.958 + config.stabilization * 0.024, 0.93, 0.988);
  const speed = config.speed;
  const delta = Math.min(0.032, dt * speed);

  for (const node of nodes) {
    const p = next[node.id];
    const nearFocus = config.focusNodeId && (node.id === config.focusNodeId || node.relatedClusterIds.includes(config.focusNodeId));
    const localDamping = nearFocus ? clamp(damping + 0.008, 0.93, 0.994) : damping;
    p.vx = (p.vx + p.ax * delta) * localDamping;
    p.vy = (p.vy + p.ay * delta) * localDamping;
    p.x += p.vx * delta; p.y += p.vy * delta;
  }

  return next;
}
