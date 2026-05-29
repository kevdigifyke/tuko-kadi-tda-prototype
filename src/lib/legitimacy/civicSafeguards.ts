export type CivicSafeguardSection = {
  id: string;
  title: string;
  notices: string[];
};

export const civicSafeguards: CivicSafeguardSection[] = [
  {
    id: "misuse-prevention-notices",
    title: "Misuse Prevention Notices",
    notices: [
      "Synthetic telemetry must not be republished as verified field intelligence.",
      "Scenario outputs must not be used to target voters, communities, candidates, officials, journalists, or observers.",
      "Operational exports should remain disabled until provenance, consent, and verification workflows are defined.",
    ],
  },
  {
    id: "interpretation-warnings",
    title: "Interpretation Warnings",
    notices: [
      "Map intensity, pulse effects, and cluster counts are visual research aids and may overstate certainty.",
      "Correlation cards and replay narratives identify hypotheses for review, not proof of causation.",
      "Percentages shown in intelligence panels are prototype indicators unless separately validated.",
    ],
  },
  {
    id: "uncertainty-indicators",
    title: "Uncertainty Indicators",
    notices: [
      "Confidence Level: Experimental.",
      "Data Provenance: Simulated Events.",
      "Operational Scope: Research and demonstration only until official connectors and audit controls are added.",
    ],
  },
  {
    id: "operational-disclaimers",
    title: "Operational Disclaimers",
    notices: [
      "This prototype does not replace official electoral commission reporting or accredited observation processes.",
      "Any real-world escalation requires independent verification, legal review, and accountable human authorization.",
      "The platform should be presented with ethics, methodology, and synthetic-data documentation in research settings.",
    ],
  },
];

export const safeguardsSummary =
  "Safeguards emphasize misuse prevention, cautious interpretation, visible uncertainty, and human verification before any real-world civic or operational consequence.";
