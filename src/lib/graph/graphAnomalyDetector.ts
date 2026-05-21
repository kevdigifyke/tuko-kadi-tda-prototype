import { ElectionGraph } from "./nationalGraphEngine";

export function detectSynchronizedNodes(graph: ElectionGraph) {
  return graph.nodes
    .filter((node) => node.turnout > 80 && node.anomalyScore > 65)
    .map((node) => ({ nodeId: node.id, label: node.label, reason: "High turnout + high anomaly correlation" }));
}

export function detectCoordinatedTurnoutSpikes(graph: ElectionGraph) {
  return graph.edges
    .filter((edge) => {
      const source = graph.nodes.find((n) => n.id === edge.source);
      const target = graph.nodes.find((n) => n.id === edge.target);
      return (source?.turnout ?? 0) > 75 && (target?.turnout ?? 0) > 75;
    })
    .map((edge) => ({ edgeId: edge.id, pattern: "coordinated_turnout_spike" }));
}

export function detectAbnormalInfluencePaths(graph: ElectionGraph) {
  return graph.edges
    .filter((edge) => edge.influenceFlow > 0.85 || edge.anomalyFlow > 70)
    .map((edge) => ({ edgeId: edge.id, influenceFlow: edge.influenceFlow, anomalyFlow: edge.anomalyFlow }));
}

export function detectSuspiciousPropagationChains(graph: ElectionGraph) {
  const suspicious = graph.edges.filter((edge) => edge.anomalyFlow > 35);
  const chains: Array<{ chainId: string; nodes: string[] }> = [];

  suspicious.forEach((edge, index) => {
    chains.push({
      chainId: `chain-${index + 1}`,
      nodes: [edge.source, edge.target],
    });
  });

  return chains;
}
