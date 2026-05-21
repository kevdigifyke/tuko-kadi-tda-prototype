"use client";

import { useEffect, useMemo, useState } from "react";
import NationalForceGraph from "@/src/components/graph/NationalForceGraph";
import GraphIntelligencePanel from "@/src/components/graph/GraphIntelligencePanel";
import {
  buildElectionGraph,
  calculateRiskPropagation,
  detectCentrality,
  detectGraphCommunities,
  runInfluencePropagation,
} from "@/src/lib/graph/nationalGraphEngine";
import {
  detectAbnormalInfluencePaths,
  detectCoordinatedTurnoutSpikes,
  detectSuspiciousPropagationChains,
  detectSynchronizedNodes,
} from "@/src/lib/graph/graphAnomalyDetector";

export default function GraphPage() {
  const [highlightedNode, setHighlightedNode] = useState<string>();

  const intelligence = useMemo(() => {
    const built = buildElectionGraph();
    const propagated = runInfluencePropagation(built);
    const risk = calculateRiskPropagation(propagated);
    const centrality = detectCentrality(propagated);
    const communities = detectGraphCommunities(propagated);
    const synchronized = detectSynchronizedNodes(propagated);
    const turnoutSpikes = detectCoordinatedTurnoutSpikes(propagated);
    const abnormalPaths = detectAbnormalInfluencePaths(propagated);
    const chains = detectSuspiciousPropagationChains(propagated);

    return {
      graph: propagated,
      risk,
      centrality,
      communities,
      synchronized,
      turnoutSpikes,
      abnormalPaths,
      chains,
    };
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ name: string }>).detail;
      setHighlightedNode(detail?.name);
    };
    window.addEventListener("map:region-select", handler as EventListener);
    return () => window.removeEventListener("map:region-select", handler as EventListener);
  }, []);

  return (
    <main className="space-y-4 p-4 bg-[radial-gradient(circle_at_20%_10%,rgba(0,229,255,.08),transparent_40%),#02050a] min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-cyan-200">National Graph Intelligence Engine</h1>
        <p className="text-cyan-50/75">Live influence propagation, anomaly diffusion, and command-grid regional activation waves.</p>
      </header>
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <NationalForceGraph graph={intelligence.graph} highlightedNodeId={highlightedNode} />
        <GraphIntelligencePanel
          graph={intelligence.graph}
          centrality={intelligence.centrality}
          propagationSpeed={intelligence.risk.reduce((acc, edge) => acc + edge.risk, 0) / Math.max(intelligence.risk.length, 1)}
          anomalyChains={intelligence.chains.length}
        />
      </div>
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-xs">
        <div className="rounded-lg border border-cyan-400/20 p-3 text-cyan-100">Communities detected: {intelligence.communities.length}</div>
        <div className="rounded-lg border border-cyan-400/20 p-3 text-cyan-100">Synchronized nodes: {intelligence.synchronized.length}</div>
        <div className="rounded-lg border border-cyan-400/20 p-3 text-cyan-100">Turnout spike corridors: {intelligence.turnoutSpikes.length}</div>
        <div className="rounded-lg border border-cyan-400/20 p-3 text-cyan-100">Abnormal influence paths: {intelligence.abnormalPaths.length}</div>
      </section>
    </main>
  );
}
