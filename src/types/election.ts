export type Candidate = { id: string; name: string; partyId: string; percentage: number };
export type Party = { id: string; name: string; short: string; color: string };
export type FeedItem = { id: string; time: string; text: string; flag?: string };
export type AnomalyCluster = { id: string; label: string; severity: number; confidence: number; type: string; ward: string; description: string };
export type MapRegion = { id: string; ward: string; constituency: string; leadingCandidateId: string; turnout: number; anomaly: number };
export type PollingStation = { id: string; name: string; ward: string; constituency: string; confidence: number; tally: Record<string, number>; anomalies: string[] };
