import { scoreAlertPriority, type AlertPriority } from "./alertPriorityEngine";

const counties = ["Nairobi", "Kisumu", "Mombasa", "Nakuru", "Meru", "Kitui", "Eldoret", "Nyeri", "Mandera", "Bungoma"];
const eventTypes = ["Emerging anomaly", "County escalation", "Propagation warning", "Turnout surge", "Network instability"];

export interface LiveIntelligenceEvent {
  id: string;
  timestamp: string;
  county: string;
  type: string;
  detail: string;
  priority: AlertPriority;
  score: number;
}

const rand = (base: number) => Math.max(0, Math.min(100, base + (Math.random() - 0.5) * 26));

export function createLiveIntelligenceEvent(now = new Date()): LiveIntelligenceEvent {
  const county = counties[Math.floor(Math.random() * counties.length)];
  const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];

  const scoring = scoreAlertPriority({
    predictiveRisk: rand(65),
    anomalyDensity: rand(58),
    propagationSpeed: rand(54),
    geographicClustering: rand(49),
    turnoutIrregularity: rand(57),
  });

  return {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: now.toISOString(),
    county,
    type,
    detail: `${type} in ${county}: multi-node signal coherence ${(58 + Math.random() * 40).toFixed(1)}%`,
    priority: scoring.priority,
    score: scoring.score,
  };
}

export function seedLiveIntelligenceFeed(count = 12): LiveIntelligenceEvent[] {
  return Array.from({ length: count }, (_, idx) => createLiveIntelligenceEvent(new Date(Date.now() - (count - idx) * 12000)));
}
