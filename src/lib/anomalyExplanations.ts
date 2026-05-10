import type { AnomalyFeatureVector } from "@/src/lib/anomalyFeatures";
import type { AnomalyType } from "@/src/types/election";

export type PrimaryIssueType = "cross-race mismatch" | "late upload spike" | "source disagreement" | "low OCR confidence" | "turnout variance";

export const primaryIssueFromType = (type: AnomalyType): PrimaryIssueType => {
  if (type === "late-upload") return "late upload spike";
  if (type === "form-mismatch") return "source disagreement";
  if (type === "turnout-spike") return "turnout variance";
  return "cross-race mismatch";
};

export const buildAnomalyExplanation = (issue: PrimaryIssueType, features: AnomalyFeatureVector): string => {
  if (issue === "cross-race mismatch") return `Cross-race mismatch flagged: Presidential vs MCA gap ${features.presidentialMcaGap}% (max gap ${features.maxCrossRaceGap}%, average ${features.averageCrossRaceGap}%). Multiple race totals may require station-level form comparison.`;
  if (issue === "late upload spike") return `Multiple reports from this ward arrived outside the expected reporting window with upload delays near ${features.uploadDelayMinutes} minutes.`;
  if (issue === "source disagreement") return `Independent submissions disagree on one or more result fields and source consensus is ${features.sourceConsensus}%.`;
  if (issue === "low OCR confidence") return `Form image extraction confidence is below the review threshold at ${features.ocrConfidence}%.`;
  return `Turnout variance is elevated (${features.turnoutRate}% turnout, ${features.spoiltVoteRate}% spoilt vote rate) and requires review.`;
};
