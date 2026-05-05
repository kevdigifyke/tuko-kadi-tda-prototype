import { ClusterEdge, ClusterNode } from "@/src/types/graph";

export const mockNodes: ClusterNode[] = [
  {
    id: "ne-04",
    label: "Nairobi East Pattern 04",
    type: "anomaly",
    x: 0,
    y: 0,
    size: 18,
    validated: false,
    severity: 91,
    confidence: 78,
    stations: 14,
    wards: 3,
    issue: "Presidential/Governor vote mismatch",
    whyFlagged:
      "Cross-form reconciliation shows unusual presidential inflation against governor tallies in clustered stations.",
    signals: [
      "Presidential totals exceed governor totals by unusual margin",
      "Spoilt ballots do not explain the difference",
      "Two independent submissions disagree",
      "OCR confidence below review threshold",
    ],
  },
  { id: "wk-02", label: "Westland Drift 02", type: "warning", x: 2, y: 1.1, size: 12, validated: true, severity: 67, confidence: 84, stations: 9, wards: 2, issue: "Turnout spike discrepancy", whyFlagged: "Late reporting wave created a turnout jump outside historical ranges.", signals: ["Sudden turnout jump in final batch", "Manual correction logs incomplete"] },
  { id: "nr-07", label: "North Rift Cluster 07", type: "normal", x: -1.8, y: 1.2, size: 10, validated: true, severity: 23, confidence: 95, stations: 5, wards: 1, issue: "Minor tally drift", whyFlagged: "Small variance resolved by validation channel.", signals: ["Variance now within acceptable threshold"] },
  { id: "cs-11", label: "Coastal Signal 11", type: "warning", x: -2.2, y: -1.2, size: 11, validated: false, severity: 58, confidence: 71, stations: 8, wards: 2, issue: "Submission conflict", whyFlagged: "Conflicting forms from two upload streams.", signals: ["Timestamp mismatch across sources", "Image compression artifacts present"] },
  { id: "ce-09", label: "Central Echo 09", type: "anomaly", x: 1.4, y: -1.5, size: 14, validated: false, severity: 83, confidence: 73, stations: 12, wards: 4, issue: "Null ballot inconsistency", whyFlagged: "Null counts diverge from polling station register patterns.", signals: ["Null ballots exceed expected quartile", "Register totals not aligned"] },
];

export const mockEdges: ClusterEdge[] = [
  { id: "e1", source: "ne-04", target: "wk-02", weight: 0.8 },
  { id: "e2", source: "ne-04", target: "ce-09", weight: 0.7 },
  { id: "e3", source: "ne-04", target: "cs-11", weight: 0.6 },
  { id: "e4", source: "wk-02", target: "nr-07", weight: 0.4 },
  { id: "e5", source: "cs-11", target: "ce-09", weight: 0.5 },
];
