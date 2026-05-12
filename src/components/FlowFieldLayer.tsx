"use client";

import { useMemo } from "react";
import type { ClusterEdge, ClusterNode } from "@/src/types/graph";

type TopologyMode = "centralized" | "decentralized" | "distributed";

interface Props {
  nodes: ClusterNode[];
  edges: ClusterEdge[];
  topologyMode: TopologyMode;
  motionScale?: number;
  reducedMotion?: boolean;
}

const project = (x: number, y: number) => ({ x: 800 + x * 260, y: 360 + y * 200 });

export function FlowFieldLayer({ nodes, edges, topologyMode, motionScale = 1, reducedMotion = false }: Props) {
  const maxEdgeWeight = useMemo(() => Math.max(...edges.map((edge) => edge.weight), 1), [edges]);

  const flowEdges = useMemo(() => edges.slice(0, Math.min(edges.length, 220)), [edges]);

  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  const hubs = useMemo(() => {
    const sorted = [...nodes].sort((a, b) => b.size - a.size);
    return sorted.slice(0, topologyMode === "centralized" ? 1 : topologyMode === "decentralized" ? 4 : 2);
  }, [nodes, topologyMode]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(122,236,255,0.08),transparent_38%),radial-gradient(circle_at_70%_30%,rgba(255,188,173,0.1),transparent_28%),radial-gradient(circle_at_52%_72%,rgba(255,255,255,0.04),transparent_35%),linear-gradient(180deg,rgba(8,15,17,0.08),rgba(8,15,17,0.74))]" />
      <svg viewBox="0 0 1600 900" className="h-full w-full opacity-90">
        <defs>
          <linearGradient id="flow-low" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(125,239,255,0.08)" />
            <stop offset="100%" stopColor="rgba(125,239,255,0.34)" />
          </linearGradient>
          <linearGradient id="flow-mid" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,217,134,0.09)" />
            <stop offset="100%" stopColor="rgba(255,186,110,0.38)" />
          </linearGradient>
          <linearGradient id="flow-high" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,174,163,0.11)" />
            <stop offset="100%" stopColor="rgba(255,118,99,0.5)" />
          </linearGradient>
        </defs>

        {hubs.map((hub, index) => {
          const center = project(hub.x, hub.y);
          const radius = hub.size * (topologyMode === "centralized" ? 16 : 12);
          return (
            <g key={hub.id} style={{ animation: reducedMotion ? undefined : `hubOrbit ${14 + index * 3}s ease-in-out infinite` }}>
              <circle cx={center.x} cy={center.y} r={radius} fill="rgba(255,255,255,0.02)" />
              <circle cx={center.x} cy={center.y} r={radius * 0.66} fill="rgba(125,239,255,0.03)" />
            </g>
          );
        })}

        {flowEdges.map((edge, index) => {
          const source = nodeById.get(edge.source);
          const target = nodeById.get(edge.target);
          if (!source || !target) return null;

          const a = project(source.x, source.y);
          const b = project(target.x, target.y);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const curvature = topologyMode === "centralized" ? 0.25 : topologyMode === "decentralized" ? 0.14 : 0.07;
          const cx = mx + (b.y - a.y) * curvature;
          const cy = my - (b.x - a.x) * curvature;

          const severity = Math.max(source.severity, target.severity);
          const gradient = severity >= 85 ? "url(#flow-high)" : severity >= 65 ? "url(#flow-mid)" : "url(#flow-low)";
          const weightRatio = edge.weight / maxEdgeWeight;
          const width = 0.8 + weightRatio * (topologyMode === "distributed" ? 2.8 : 2.1);

          return (
            <path
              key={edge.id}
              d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
              stroke={gradient}
              strokeWidth={width}
              fill="none"
              strokeOpacity={0.35 + weightRatio * 0.3}
              strokeDasharray={reducedMotion ? "" : "12 24"}
              style={
                reducedMotion
                  ? undefined
                  : {
                      animation: `edgeFlow ${(8 + (1 - weightRatio) * 8) / Math.max(motionScale, 0.35)}s linear infinite`,
                      animationDelay: `${(index % 7) * -0.8}s`,
                    }
              }
            />
          );
        })}
      </svg>

      <style jsx>{`
        @keyframes edgeFlow {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -180; }
        }
        @keyframes hubOrbit {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.55; }
          50% { transform: translate3d(0, -4px, 0); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}
