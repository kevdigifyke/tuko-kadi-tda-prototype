"use client";

import { useEffect, useRef } from "react";
import Graph from "graphology";
import { mockEdges, mockNodes } from "@/src/data/mockGraph";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

const colors = { normal: "#00E5FF", warning: "#FFD600", anomaly: "#FF3D00" } as const;

export function TdaGraph({ selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const graph = new Graph();

    for (const node of mockNodes) {
      graph.addNode(node.id, {
        label: node.label,
        x: node.x,
        y: node.y,
        size: node.id === selectedId ? node.size + 5 : node.size,
        color: node.validated ? "#00C853" : colors[node.type],
      });
    }

    for (const edge of mockEdges) {
      graph.addEdge(edge.source, edge.target, {
        size: edge.weight * 4,
        color: edge.source === selectedId || edge.target === selectedId ? "#b0f6ff" : "#355068",
      });
    }

    let renderer: { kill: () => void; on: (event: "clickNode", cb: ({ node }: { node: string }) => void) => unknown } | null = null;
    let disposed = false;

    (async () => {
      try {
        const { default: Sigma } = await import("sigma");
        if (disposed || !containerRef.current) return;
        renderer = new Sigma(graph, containerRef.current, { renderLabels: false, labelColor: { color: "#fff" } }) as unknown as { kill: () => void; on: (event: "clickNode", cb: ({ node }: { node: string }) => void) => unknown };
        renderer.on("clickNode", ({ node }) => onSelect(node));
      } catch (error) {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#FFD600;font-size:14px">Graph renderer unavailable. Falling back to static mode.</div>`;
        }
        console.error("Sigma init failed", error);
      }
    })();

    return () => {
      disposed = true;
      renderer?.kill();
    };
  }, [onSelect, selectedId]);

  return <div ref={containerRef} className="h-full w-full rounded-xl bg-[#0B0F14]" aria-label="TDA graph canvas" />;
}
