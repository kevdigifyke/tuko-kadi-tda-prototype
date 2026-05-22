export type AfricanCountryElectionData = {
  code: string;
  country: string;
  region: "East Africa" | "West Africa" | "Southern Africa";
  stabilityIndex: number;
  electionVolatility: number;
  anomalyDensity: number;
  democraticRiskScore: number;
  activeAlerts: string[];
  turnoutTrend: number;
  neighboringInfluence: number;
};

export type ContinentalAlert = {
  id: string;
  countryCode: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "election" | "geopolitical" | "escalation" | "cross-border";
  title: string;
  timestamp: string;
};

export const africanElectionData: AfricanCountryElectionData[] = [
  { code: "KE", country: "Kenya", region: "East Africa", stabilityIndex: 72, electionVolatility: 34, anomalyDensity: 41, democraticRiskScore: 44, activeAlerts: ["Constituency tally variance", "Digital rumor amplification"], turnoutTrend: 3.2, neighboringInfluence: 46 },
  { code: "UG", country: "Uganda", region: "East Africa", stabilityIndex: 58, electionVolatility: 57, anomalyDensity: 63, democraticRiskScore: 67, activeAlerts: ["Opposition rally disruption", "Localized outage near tally hubs"], turnoutTrend: -1.4, neighboringInfluence: 61 },
  { code: "TZ", country: "Tanzania", region: "East Africa", stabilityIndex: 66, electionVolatility: 40, anomalyDensity: 38, democraticRiskScore: 49, activeAlerts: ["Boundary dispute chatter"], turnoutTrend: 1.7, neighboringInfluence: 39 },
  { code: "NG", country: "Nigeria", region: "West Africa", stabilityIndex: 53, electionVolatility: 68, anomalyDensity: 74, democraticRiskScore: 73, activeAlerts: ["Ballot logistics interruption", "Cross-state disinformation cascade", "Security deployment spike"], turnoutTrend: -2.1, neighboringInfluence: 75 },
  { code: "GH", country: "Ghana", region: "West Africa", stabilityIndex: 75, electionVolatility: 29, anomalyDensity: 27, democraticRiskScore: 31, activeAlerts: ["Campaign finance anomaly cluster"], turnoutTrend: 2.4, neighboringInfluence: 33 },
  { code: "ZA", country: "South Africa", region: "Southern Africa", stabilityIndex: 69, electionVolatility: 42, anomalyDensity: 45, democraticRiskScore: 50, activeAlerts: ["Municipal recount pressure"], turnoutTrend: 0.8, neighboringInfluence: 49 },
  { code: "RW", country: "Rwanda", region: "East Africa", stabilityIndex: 64, electionVolatility: 33, anomalyDensity: 31, democraticRiskScore: 43, activeAlerts: ["Media access imbalance signal"], turnoutTrend: 1.1, neighboringInfluence: 37 },
];

export const continentalFeed: ContinentalAlert[] = [
  { id: "ALT-201", countryCode: "NG", severity: "critical", category: "election", title: "Escalating logistics failure in 3 battleground states", timestamp: "2026-05-22T08:10:00Z" },
  { id: "ALT-202", countryCode: "KE", severity: "high", category: "cross-border", title: "Coordinated influence signal crossing East Africa media channels", timestamp: "2026-05-22T07:52:00Z" },
  { id: "ALT-203", countryCode: "UG", severity: "high", category: "escalation", title: "Localized protest-to-violence transition risk detected", timestamp: "2026-05-22T07:35:00Z" },
  { id: "ALT-204", countryCode: "GH", severity: "medium", category: "geopolitical", title: "Regional campaign funding route anomaly", timestamp: "2026-05-22T07:19:00Z" },
];
