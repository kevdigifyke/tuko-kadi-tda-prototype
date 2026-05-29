export type SimulationMethodologyDefinition = {
  id: string;
  modelFamily: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  assumptions: string[];
  uncertaintySources: string[];
};

export const simulationMethodology: SimulationMethodologyDefinition[] = [
  {
    id: "turnout-models",
    modelFamily: "Turnout Models",
    purpose:
      "Estimate synthetic turnout pressure for visual analytics, scenario pacing, and civic signal demonstrations without representing official turnout.",
    inputs: [
      "Polling-station voter capacity and administrative geography.",
      "Scenario risk labels and linked telemetry severity.",
      "Simulation tick, replay energy, and deterministic heuristic variation.",
    ],
    outputs: [
      "Turnout heatmap intensity.",
      "Turnout pressure percentages in civic signal summaries.",
      "Narrative cues for operational stress and analyst attention.",
    ],
    assumptions: [
      "Synthetic station metadata can provide enough variation to evaluate interface behavior.",
      "Higher scenario risk can increase pressure visualization for demonstration purposes.",
      "Turnout pressure is a research signal and not an electoral statistic.",
    ],
    uncertaintySources: [
      "Absence of official live turnout data.",
      "Heuristic station-level risk bias.",
      "Visual aggregation effects from heatmaps and replay overlays.",
    ],
  },
  {
    id: "anomaly-models",
    modelFamily: "Anomaly Models",
    purpose:
      "Represent synthetic incident severity, topology instability, and AI risk to test analyst workflows and transparency requirements.",
    inputs: [
      "Synthetic telemetry category, severity, status, county, constituency, and ward.",
      "AI-style risk score and topology stability labels.",
      "Active replay frame and user-selected map/search focus.",
    ],
    outputs: [
      "Telemetry alerts and active anomaly counts.",
      "Map pulses, focused regions, and severity styling.",
      "Cognitive briefings and escalation probability summaries.",
    ],
    assumptions: [
      "Anomaly records are hypotheses generated for scenario design.",
      "Severity styling is a UI affordance and not a legal or factual determination.",
      "Human review is mandatory before an anomaly narrative is used outside the prototype.",
    ],
    uncertaintySources: [
      "Synthetic base rates and severity distributions.",
      "Potential mismatch between visual urgency and evidentiary strength.",
      "Limited calibration against verified historical incidents.",
    ],
  },
  {
    id: "propagation-models",
    modelFamily: "Propagation Models",
    purpose:
      "Surface possible spatial or thematic spread patterns in synthetic incidents while preserving uncertainty and avoiding attribution claims.",
    inputs: [
      "Telemetry event geography and categories.",
      "Replay focus cluster key, simulation tick, and risk score.",
      "Civic signal summaries for mobility, environmental, accessibility, and turnout pressure.",
    ],
    outputs: [
      "Propagation cluster counts and map pulse effects.",
      "Signal bottlenecks and corridor overlays.",
      "Analytical statements about potential escalation or diffusion.",
    ],
    assumptions: [
      "Co-occurrence can support hypothesis generation but cannot establish intent.",
      "Synthetic propagation should be labeled as experimental throughout the UI.",
      "Analysts must separate correlation, causation, and attribution.",
    ],
    uncertaintySources: [
      "Simplified spatial adjacency and corridor modeling.",
      "No live rumor, media, or official-report verification pipeline.",
      "Replay-order effects that can make synthetic spread appear causal.",
    ],
  },
  {
    id: "replay-cognition-models",
    modelFamily: "Replay Cognition Models",
    purpose:
      "Generate concise analyst-facing interpretations of replay state, anomaly focus, and civic signal pressure for research demonstrations.",
    inputs: [
      "Current simulation tick and replay frame category.",
      "Telemetry stream, anomaly level, replay focus, and timeline risk escalation.",
      "Civic signal summary metrics and active operational region.",
    ],
    outputs: [
      "Tactical briefings, predictive summaries, and operational narratives.",
      "Forecast-style percentages for escalation, turnout instability, propagation, severity, and civic stress.",
      "Correlation cards that communicate plausible relationships for human inspection.",
    ],
    assumptions: [
      "Cognitive summaries are decision-support explanations, not autonomous determinations.",
      "Forecast percentages are prototype indicators rather than validated probabilities.",
      "Research users benefit from concise but explicitly bounded narrative synthesis.",
    ],
    uncertaintySources: [
      "Narrative compression of complex civic scenarios.",
      "Model drift if future data connectors are added without recalibration.",
      "User over-trust in forecast-like labels and percentages.",
    ],
  },
];

export const methodologySummary =
  "The current methodology uses bounded, simulation-first heuristics to exercise election-intelligence workflows while explicitly separating interface research from verified electoral evidence.";
