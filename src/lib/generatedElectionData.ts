import type { ClusterGraph, ElectionSummary, StationDetailRecord } from "@/src/types/election";
import type { ClusterNode as GraphClusterNode, ClusterEdge as GraphClusterEdge } from "@/src/types/graph";

import electionSummaryJson from "@/src/data/generated/election-summary.json";
import clusterGraphJson from "@/src/data/generated/cluster-graph.json";
import stationSampleJson from "@/src/data/generated/station-sample.json";

const FALLBACK_SUMMARY: ElectionSummary = {
  generatedAt: "2026-01-01T00:00:00.000Z",
  stationCount: 0,
  totalRegisteredVoters: 0,
  totalBallotsCast: 0,
  turnoutPercent: 0,
  candidateTotals: [],
  counties: [],
  constituencies: [],
  wards: [],
};

const FALLBACK_STATION: StationDetailRecord = {
  stationId: "demo-station-77b",
  stationCode: "DEMO-77B",
  stationName: "Demo Station 77B",
  county: "Demo County",
  constituency: "Demo Constituency",
  ward: "Demo Ward",
  registeredVoters: 1000,
  ballotsCast: 630,
  rejectedBallots: 8,
  turnoutPercent: 63,
  results: [],
  anomalyFlags: [],
  reportedAt: "2026-01-01T00:00:00.000Z",
  nearestStations: [],
  notes: ["Generated demo data missing. Run npm run generate:data."],
};

const summaryData = (electionSummaryJson as ElectionSummary) ?? FALLBACK_SUMMARY;
const clusterGraphData = (clusterGraphJson as ClusterGraph) ?? { generatedAt: FALLBACK_SUMMARY.generatedAt, nodes: [], edges: [] };
const stationSampleData = (stationSampleJson as StationDetailRecord[]) ?? [];

export function getElectionSummary(): ElectionSummary {
  return summaryData;
}

export function getClusterGraph(): ClusterGraph {
  return clusterGraphData;
}

export function getStationSample(id?: string): StationDetailRecord {
  if (stationSampleData.length === 0) return FALLBACK_STATION;
  return stationSampleData.find((station) => station.stationId === id || station.stationCode === id) ?? stationSampleData[0];
}

function deriveSignalsFromSeverity(severity: number): string[] {
  if (severity >= 90) return ["Form mismatch pattern", "Rapid upload spike", "Cross-source disagreement"];
  if (severity >= 70) return ["Suspicious turnout drift", "Needs manual validation"];
  return ["Low-priority irregularity"];
}

export function mapClusterNodeToGraphNode(node: ClusterGraph["nodes"][number], index: number): GraphClusterNode {
  const confidence = Math.max(55, 100 - Math.round((node.severity - 40) * 0.7));
  return {
    id: node.id,
    label: `${node.county} ${node.ward}`,
    type: node.severity >= 80 ? "anomaly" : node.severity >= 60 ? "warning" : "normal",
    x: Math.cos((index / Math.max(clusterGraphData.nodes.length, 1)) * Math.PI * 2) * (1.4 + (index % 3) * 0.35),
    y: Math.sin((index / Math.max(clusterGraphData.nodes.length, 1)) * Math.PI * 2) * (1.1 + (index % 4) * 0.25),
    size: 9 + Math.round(node.severity / 20),
    validated: node.severity < 70,
    severity: node.severity,
    confidence,
    stations: 1,
    wards: 1,
    issue: node.severity >= 80 ? "High-severity cross-check mismatch" : "Turnout or timing irregularity",
    whyFlagged: `${node.label} in ${node.ward} (${node.county}) is part of an anomaly-linked cluster path.`,
    signals: deriveSignalsFromSeverity(node.severity),
  };
}

export function mapClusterEdgeToGraphEdge(edge: ClusterGraph["edges"][number]): GraphClusterEdge {
  return { id: edge.id, source: edge.source, target: edge.target, weight: edge.weight };
}

export function getDefaultCluster(): GraphClusterNode {
  const [first] = clusterGraphData.nodes;
  return first ? mapClusterNodeToGraphNode(first, 0) : mapClusterNodeToGraphNode({ id: "fallback", stationId: "fallback", label: "Fallback", county: "Demo", ward: "Demo", severity: 50 }, 0);
}

export function getClusterById(id: string): GraphClusterNode {
  const nodeIndex = clusterGraphData.nodes.findIndex((node) => node.id === id);
  if (nodeIndex < 0) return getDefaultCluster();
  return mapClusterNodeToGraphNode(clusterGraphData.nodes[nodeIndex], nodeIndex);
}

export function getGraphNodes(): GraphClusterNode[] {
  return clusterGraphData.nodes.map(mapClusterNodeToGraphNode);
}

export function getGraphEdges(): GraphClusterEdge[] {
  return clusterGraphData.edges.map(mapClusterEdgeToGraphEdge);
}
