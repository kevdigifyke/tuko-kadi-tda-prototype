"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3";
import { ElectionGraph } from "@/src/lib/graph/nationalGraphEngine";

interface Props {
  graph: ElectionGraph;
  highlightedNodeId?: string;
}

export default function NationalForceGraph({ graph, highlightedNodeId }: Props) {
  const [tick, setTick] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const viewModel = useMemo(() => ({
    nodes: graph.nodes.map((node) => ({ ...node })),
    links: graph.edges.map((edge) => ({ ...edge })),
  }), [graph]);

  useEffect(() => {
    const simulation = forceSimulation(viewModel.nodes as any)
      .force("link", forceLink(viewModel.links as any).id((d: any) => d.id).distance(58).strength(0.35))
      .force("charge", forceManyBody().strength(-95))
      .force("center", forceCenter(520, 300))
      .alpha(0.9)
      .on("tick", () => setTick((n) => n + 1));

    return () => simulation.stop();
  }, [viewModel]);

  const dragState = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const onWheel: React.WheelEventHandler<SVGSVGElement> = (event) => {
    event.preventDefault();
    if (!svgRef.current) return;
    const scale = event.deltaY < 0 ? 1.1 : 0.9;
    const current = svgRef.current.viewBox.baseVal;
    svgRef.current.setAttribute("viewBox", `${current.x} ${current.y} ${current.width / scale} ${current.height / scale}`);
  };

  void tick;

  return (
    <div className="h-[70vh] w-full rounded-2xl border border-cyan-300/20 bg-[#03070d] p-2 shadow-[0_0_50px_rgba(0,229,255,0.12)]">
      <svg ref={svgRef} viewBox="0 0 1040 600" className="h-full w-full" onWheel={onWheel}>
        <defs>
          <filter id="nodeGlow"><feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00f7ff" /></filter>
        </defs>
        {viewModel.links.map((link) => {
          const source = link.source as any;
          const target = link.target as any;
          const pulse = 0.35 + Math.abs(Math.sin(Date.now() / 550)) * 0.35;
          return (
            <line
              key={link.id}
              x1={source.x ?? 0}
              y1={source.y ?? 0}
              x2={target.x ?? 0}
              y2={target.y ?? 0}
              stroke="rgba(0,247,255,0.45)"
              strokeWidth={1 + link.weight * 2}
              opacity={pulse}
            />
          );
        })}
        {viewModel.nodes.map((node) => {
          const active = highlightedNodeId && node.id.includes(highlightedNodeId.toLowerCase().replace(/\s+/g, "-"));
          return (
            <g
              key={node.id}
              transform={`translate(${node.x ?? 0}, ${node.y ?? 0})`}
              onMouseDown={(event) => {
                dragState.current = { id: node.id, offsetX: event.clientX - (node.x ?? 0), offsetY: event.clientY - (node.y ?? 0) };
              }}
              onMouseMove={(event) => {
                if (!dragState.current || dragState.current.id !== node.id) return;
                node.x = event.clientX - dragState.current.offsetX;
                node.y = event.clientY - dragState.current.offsetY;
                setTick((n) => n + 1);
              }}
              onMouseUp={() => {
                dragState.current = null;
              }}
            >
              <circle
                r={node.type === "county" ? 12 : node.type === "constituency" ? 8 : 5}
                fill={active ? "#7CFF4D" : "#00E5FF"}
                opacity={0.7 + Math.min(node.influence / 8, 0.3)}
                filter="url(#nodeGlow)"
                stroke={active ? "#d9ff64" : "#7cf6ff"}
                strokeWidth={active ? 2.4 : 1}
              />
              <text x={6} y={-6} fill="#d9f7ff" fontSize={9}>{node.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
