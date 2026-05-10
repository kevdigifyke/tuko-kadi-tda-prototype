export type RaceType = "presidential" | "governor" | "senate" | "women-representative" | "mp" | "mca";

export type Party = {
  id: string;
  name: string;
  short: string;
  color: string;
};

export type Candidate = {
  id: string;
  name: string;
  partyId: string;
  race?: RaceType;
  percentage?: number;
};

export type CandidateResult = {
  candidateId: string;
  votes: number;
  percent: number;
};

export type PollingStationRecord = {
  stationId: string;
  stationCode: string;
  stationName: string;
  county: string;
  constituency: string;
  ward: string;
  registeredVoters: number;
  ballotsCast: number;
  rejectedBallots: number;
  raceTotals: {
    presidential: number;
    governor: number;
    mp: number;
    mca: number;
    womanRep: number;
    senator?: number;
  };
  raceSpoiltVotes: {
    presidential: number;
    governor: number;
    mp: number;
    mca: number;
    womanRep: number;
    senator?: number;
  };
  crossRaceVariance: number;
  turnoutAnchorRace: "mca";
  mcaTurnoutSignal: number;
  raceMismatchDetails: Array<{
    race: "presidential" | "governor" | "mp" | "mca" | "womanRep" | "senator";
    voteGapFromMca: number;
    percentGapFromMca: number;
    riskLevel: ClusterRiskLevel;
    explanation: string;
  }>;
  turnoutPercent: number;
  results: CandidateResult[];
  anomalyFlags: AnomalyFlag[];
  reportedAt: string;
};

export type AnomalyType = "turnout-spike" | "result-disparity" | "late-upload" | "form-mismatch" | "normal";

export type AnomalyFlag = {
  type: AnomalyType;
  severity: number;
  confidence: number;
  note: string;
};

export type WardSummary = {
  county: string;
  constituency: string;
  ward: string;
  stations: number;
  registeredVoters: number;
  ballotsCast: number;
  turnoutPercent: number;
  anomalyCount: number;
};

export type ConstituencySummary = WardSummary & { level: "constituency" };
export type CountySummary = WardSummary & { level: "county" };

export type ElectionSummary = {
  generatedAt: string;
  stationCount: number;
  totalRegisteredVoters: number;
  totalBallotsCast: number;
  turnoutPercent: number;
  candidateTotals: Array<{
    candidateId: string;
    votes: number;
    percent: number;
  }>;
  counties: CountySummary[];
  constituencies: ConstituencySummary[];
  wards: WardSummary[];
};

export type LiveFeedItem = {
  id: string;
  timestamp: string;
  stationId: string;
  message: string;
  type: "info" | "warning" | "critical";
};

export type ClusterRiskLevel = "low" | "medium" | "high" | "critical";
export type ReviewerStatus = "unreviewed" | "requires_review" | "in_review" | "cleared_demo";

export type ClusterNode = {
  id: string;
  stationId: string;
  label: string;
  county: string;
  ward: string;
  severity: number;
  explanation: string;
  reviewRecommendations: string[];
  riskLevel: ClusterRiskLevel;
  featureSummary: string[];
  timelineEvents: Array<{ timestamp: string; label: string }>;
  relatedClusterIds: string[];
  reviewerStatus: ReviewerStatus;
  primaryIssue: string;
  affectedStations: number;
  affectedWards: number;
};

export type ClusterEdge = {
  id: string;
  source: string;
  target: string;
  weight: number;
  reason: string;
};

export type ClusterGraph = {
  generatedAt: string;
  nodes: ClusterNode[];
  edges: ClusterEdge[];
};

export type StationDetailRecord = PollingStationRecord & {
  nearestStations: string[];
  notes: string[];
};

// Backward compatible aliases used by current prototype UI.
export type FeedItem = { id: string; time: string; text: string; flag?: string };
export type AnomalyCluster = { id: string; label: string; severity: number; confidence: number; type: string; ward: string; description: string };
export type MapRegion = { id: string; ward: string; constituency: string; leadingCandidateId: string; turnout: number; anomaly: number };
export type PollingStation = { id: string; name: string; ward: string; constituency: string; confidence: number; tally: Record<string, number>; anomalies: string[] };
