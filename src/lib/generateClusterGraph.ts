import type { ClusterEdge, ClusterGraph, ClusterNode, PollingStationRecord } from "@/src/types/election";

export const generateClusterGraph = (stations: PollingStationRecord[], maxNodes = 240): ClusterGraph => {
  const anomalous = stations.filter((s) => s.anomalyFlags.length > 0).slice(0, maxNodes);

  const nodes: ClusterNode[] = anomalous.map((station) => ({
    id: station.stationId,
    stationId: station.stationId,
    label: station.stationName,
    county: station.county,
    ward: station.ward,
    severity: Math.max(...station.anomalyFlags.map((a) => a.severity)),
  }));

  const edges: ClusterEdge[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < Math.min(i + 6, nodes.length); j += 1) {
      if (nodes[i].county === nodes[j].county || nodes[i].ward === nodes[j].ward) {
        edges.push({
          id: `${nodes[i].id}-${nodes[j].id}`,
          source: nodes[i].id,
          target: nodes[j].id,
          weight: Number(((nodes[i].severity + nodes[j].severity) / 200).toFixed(2)),
          reason: nodes[i].ward === nodes[j].ward ? "shared-ward" : "shared-county",
        });
      }
    }
  }

  return { generatedAt: new Date().toISOString(), nodes, edges };
};
