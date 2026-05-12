import queue from "@/src/data/generated/evidence-queue.json";
import uploadEvents from "@/src/data/generated/upload-events.json";
import reviewerActions from "@/src/data/generated/reviewer-actions.json";

export type ReviewAction = "approve" | "escalate" | "reject" | "request_second_review" | "mark_resolved";

export const extractionStages = ["Scanning", "Parsing", "Matching", "Validation"];

export function getEvidenceQueue() { return queue; }
export function getUploadEvents() { return uploadEvents; }
export function getReviewerActions() { return reviewerActions; }

export function compareExtraction(extracted: { presidential: number; governor: number; mp: number; mca: number; spoiled: number; confidence: number; submittedAt: string; stationCode: string; }) {
  const turnoutDelta = extracted.presidential - extracted.mca;
  const raceSpread = Math.max(extracted.presidential, extracted.governor, extracted.mp, extracted.mca) - Math.min(extracted.presidential, extracted.governor, extracted.mp, extracted.mca);
  const lateSubmission = new Date(extracted.submittedAt).getUTCHours() >= 22;
  const anomalies: string[] = [];
  if (Math.abs(turnoutDelta) > 120) anomalies.push("turnout inflation");
  if (raceSpread > 160) anomalies.push("cross-race inconsistency");
  if (extracted.confidence < 0.7) anomalies.push("low OCR confidence");
  if (lateSubmission) anomalies.push("suspicious late submission");
  if (extracted.presidential < extracted.governor) anomalies.push("presidential mismatch");

  const severity = Math.min(0.98, anomalies.length * 0.19 + Math.abs(turnoutDelta) / 1000 + raceSpread / 1200 + (1 - extracted.confidence) * 0.3 + (lateSubmission ? 0.12 : 0));
  return {
    anomalies,
    severity,
    reviewRecommendation: severity > 0.85 ? "escalate" : severity > 0.6 ? "request second review" : "approve with monitor",
    confidenceAssessment: extracted.confidence > 0.85 ? "high" : extracted.confidence > 0.7 ? "medium" : "low",
  };
}
