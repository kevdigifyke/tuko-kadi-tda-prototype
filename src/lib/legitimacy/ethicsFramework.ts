export type EthicsFrameworkSection = {
  id: string;
  title: string;
  commitments: string[];
};

export const ethicsFramework: EthicsFrameworkSection[] = [
  {
    id: "transparency-principles",
    title: "Transparency Principles",
    commitments: [
      "Clearly label simulation mode, synthetic telemetry, experimental confidence, and simulated event provenance.",
      "Expose model assumptions, uncertainty sources, and known limitations before research or public demonstration use.",
      "Avoid presenting prototype risk scores as verified facts, legal findings, or official election outcomes.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    commitments: [
      "Academic research, classroom teaching, conference demonstration, and responsible civic-tech design review.",
      "Scenario planning that evaluates governance, transparency, accessibility, and human oversight workflows.",
      "Internal tabletop exercises that maintain clear simulation labels and do not target real voters or officials.",
    ],
  },
  {
    id: "prohibited-use",
    title: "Prohibited Use",
    commitments: [
      "Do not use synthetic anomaly outputs to accuse individuals, parties, polling stations, or communities of misconduct.",
      "Do not publish simulated telemetry as breaking news, verified evidence, or official election intelligence.",
      "Do not use the platform for voter suppression, intimidation, discriminatory profiling, or partisan manipulation.",
    ],
  },
  {
    id: "election-integrity-safeguards",
    title: "Election Integrity Safeguards",
    commitments: [
      "Maintain provenance labels for every non-official dataset and simulation layer.",
      "Require independent verification before any operational escalation outside the prototype environment.",
      "Preserve auditability of assumptions so observers can challenge, reproduce, or reject model outputs.",
    ],
  },
  {
    id: "anti-misinformation-principles",
    title: "Anti-Misinformation Principles",
    commitments: [
      "Design UI copy to reduce false certainty, sensationalism, and unsupported causal claims.",
      "Avoid viral-ready claims from unverified telemetry; prefer bounded language such as scenario, hypothesis, and simulation.",
      "Pair striking visuals with uncertainty indicators and interpretive warnings.",
    ],
  },
  {
    id: "human-oversight-principles",
    title: "Human Oversight Principles",
    commitments: [
      "Keep expert reviewers accountable for interpretation, escalation, and public communication.",
      "Treat model summaries as prompts for inquiry rather than automated decisions.",
      "Provide enough documentation for researchers and civic stakeholders to evaluate harms, benefits, and alternatives.",
    ],
  },
];

export const ethicsSummary =
  "Tuko Kadi is governed as a transparent, simulation-first research prototype: acceptable use centers on education and evaluation, while prohibited use includes misinformation, voter harm, unsupported accusations, and automated operational decisions.";
