import type { ClusterGraph, ElectionSummary, StationDetailRecord } from "@/src/types/election";
import type { ClusterNode as GraphClusterNode, ClusterEdge as GraphClusterEdge } from "@/src/types/graph";

import electionSummaryJson from "@/src/data/generated/election-summary.json";
import clusterGraphJson from "@/src/data/generated/cluster-graph.json";
import stationSampleJson from "@/src/data/generated/station-sample.json";
import timelineFramesJson from "@/src/data/generated/timeline-frames.json";

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
  raceTotals: { presidential: 630, governor: 628, mp: 627, mca: 626, womanRep: 625, senator: 624 },
  raceSpoiltVotes: { presidential: 2, governor: 2, mp: 2, mca: 1, womanRep: 2, senator: 2 },
  crossRaceVariance: 0.9,
  turnoutAnchorRace: "mca",
  mcaTurnoutSignal: 626,
  raceMismatchDetails: [
    { race: "presidential", voteGapFromMca: 4, percentGapFromMca: 0.64, riskLevel: "low", explanation: "Presidential total slightly exceeds MCA turnout anchor." },
    { race: "governor", voteGapFromMca: 2, percentGapFromMca: 0.32, riskLevel: "low", explanation: "Governor total is aligned with MCA turnout anchor." },
    { race: "mp", voteGapFromMca: 1, percentGapFromMca: 0.16, riskLevel: "low", explanation: "MP total is aligned with MCA turnout anchor." },
    { race: "mca", voteGapFromMca: 0, percentGapFromMca: 0, riskLevel: "low", explanation: "MCA is the turnout anchor." },
    { race: "womanRep", voteGapFromMca: -1, percentGapFromMca: 0.16, riskLevel: "low", explanation: "Woman Rep total is aligned with MCA turnout anchor." },
    { race: "senator", voteGapFromMca: -2, percentGapFromMca: 0.32, riskLevel: "low", explanation: "Senator total is aligned with MCA turnout anchor." },
  ],
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


export function mapClusterNodeToGraphNode(node: ClusterGraph["nodes"][number], index: number): GraphClusterNode {
  const confidence = Math.max(55, 100 - Math.round((node.severity - 40) * 0.7));
  const featureSummary = node.featureSummary ?? ["Synthetic feature summary unavailable"];
  const reviewRecommendations = node.reviewRecommendations ?? ["Compare source forms", "Escalate to human verification"];
  const timelineEvents = node.timelineEvents ?? [{ timestamp: summaryData.generatedAt, label: "Synthetic marker" }];
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
    stations: node.affectedStations ?? 1,
    wards: node.affectedWards ?? 1,
    issue: node.primaryIssue ?? "turnout variance",
    whyFlagged: `${node.label} in ${node.ward} (${node.county}) requires review in this synthetic cluster model.`,
    signals: featureSummary,
    riskLevel: node.riskLevel ?? "medium",
    reviewerStatus: node.reviewerStatus ?? "unreviewed",
    explanation: node.explanation ?? `${node.label} requires synthetic demo review.`,
    primaryIssue: node.primaryIssue ?? "turnout variance",
    featureSummary,
    reviewRecommendations,
    relatedClusterIds: node.relatedClusterIds ?? [],
    timelineEvents,
  };
}

export function mapClusterEdgeToGraphEdge(edge: ClusterGraph["edges"][number]): GraphClusterEdge {
  return { id: edge.id, source: edge.source, target: edge.target, weight: edge.weight };
}

export function getDefaultCluster(): GraphClusterNode {
  const [first] = clusterGraphData.nodes;
  return first ? mapClusterNodeToGraphNode(first, 0) : mapClusterNodeToGraphNode({ id: "fallback", stationId: "fallback", label: "Fallback", county: "Demo", ward: "Demo", severity: 50, explanation: "Synthetic fallback cluster.", reviewRecommendations: ["Compare source forms"], riskLevel: "low", featureSummary: ["No data"], timelineEvents: [{ timestamp: FALLBACK_SUMMARY.generatedAt, label: "No timeline" }], relatedClusterIds: [], reviewerStatus: "cleared_demo", primaryIssue: "turnout variance", affectedStations: 1, affectedWards: 1 }, 0);
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



export function getTimelineFrames() {
  const raw = (timelineFramesJson as unknown as { generatedAt: string; frames: Array<Record<string, unknown>> }).frames ?? [];
  return raw.map((frame) => ({
    ...(frame as object),
    nodes: ((frame.nodes as import("@/src/types/graph").ClusterNode[]) ?? []).map((node) => ({
      ...node,
      whyFlagged: node.whyFlagged ?? node.explanation ?? "Synthetic replay signal",
      riskLevel: node.riskLevel ?? "medium",
      reviewerStatus: node.reviewerStatus ?? "requires_review",
      explanation: node.explanation ?? "Synthetic replay node",
      primaryIssue: node.primaryIssue ?? "turnout variance",
      signals: node.signals ?? [],
      featureSummary: node.featureSummary ?? [],
      reviewRecommendations: node.reviewRecommendations ?? [],
      relatedClusterIds: node.relatedClusterIds ?? [],
      timelineEvents: node.timelineEvents ?? [],
      type: node.type === "anomaly" || node.type === "warning" ? node.type : "normal",
    })),
    edges: (frame.edges as import("@/src/types/graph").ClusterEdge[]) ?? [],
    severityChanges: (frame.severityChanges as Record<string, number>) ?? {},
    confidenceChanges: (frame.confidenceChanges as Record<string, number>) ?? {},
    emergenceStates: (frame.emergenceStates as Record<string, import("@/src/types/graph").ClusterEventState>) ?? {},
    notableEvents: (frame.notableEvents as string[]) ?? [],
    markers: (frame.markers as Array<{ timestamp: string; label: string }>) ?? [],
  })) as import("@/src/types/graph").TimelineFrame[];
}
