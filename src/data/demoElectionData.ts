import type { AnomalyCluster, Candidate, FeedItem, MapRegion, Party, PollingStation } from "@/src/types/election";

export const parties: Party[] = [
  { id: "p-a", name: "Unity Front", short: "UF", color: "#00daf3" },
  { id: "p-b", name: "Civic Alliance", short: "CA", color: "#7C4DFF" },
  { id: "p-c", name: "Independent", short: "IND", color: "#FFD600" },
];
export const candidates: Candidate[] = [
  { id: "c-a", name: "Amina K.", partyId: "p-a", percentage: 48.2 },
  { id: "c-b", name: "Ben O.", partyId: "p-b", percentage: 41.7 },
  { id: "c-c", name: "Carol N.", partyId: "p-c", percentage: 10.1 },
];
export const liveFeed: FeedItem[] = [
  { id: "1", time: "14:22:01", text: "+142 votes reported in Ward 7-G" },
  { id: "2", time: "14:21:48", text: "Source mismatch in Sector 12", flag: "Requires review" },
  { id: "3", time: "14:20:55", text: "Late upload spike in City South" },
];
export const anomalyClusters: AnomalyCluster[] = [
  { id: "ne-04", label: "PS_METRO_09", severity: 92, confidence: 88, type: "Cross-race mismatch", ward: "Central", description: "Human review recommended." },
  { id: "ne-08", label: "PS_HILL_22", severity: 74, confidence: 81, type: "Turnout variance", ward: "North Ridge", description: "Unexpected turnout acceleration." },
];
export const mapRegions: MapRegion[] = [{ id: "r1", ward: "North Ridge", constituency: "Metro 4", leadingCandidateId: "c-b", turnout: 64, anomaly: 18 }];
export const pollingStations: PollingStation[] = [{ id: "demo-station-77b", name: "Polling Station 77-B", ward: "Sector 4", constituency: "Metro District", confidence: 98.4, tally: { "Unity Front": 12402, "Civic Alliance": 8115, Others: 1209 }, anomalies: ["Source mismatch", "Signatory verification mismatch"] }];
