import type { PrimaryIssueType } from "@/src/lib/anomalyExplanations";

export const buildReviewRecommendations = (issue: PrimaryIssueType): string[] => {
  const base = [
    "Compare source forms",
    "Check station-level tally breakdown",
    "Verify timestamp sequence",
    "Review duplicate image hash",
    "Confirm registered voter ceiling",
  ];

  if (issue === "source disagreement" || issue === "cross-race mismatch") {
    return [...base, "Escalate to human verification"];
  }

  if (issue === "late upload spike") {
    return ["Verify timestamp sequence", "Compare source forms", "Check station-level tally breakdown", "Escalate to human verification"];
  }

  return base;
};
