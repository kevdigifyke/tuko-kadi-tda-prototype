export type SyntheticDataDocumentationSection = {
  id: string;
  title: string;
  description: string;
  architecture: string[];
  assumptions: string[];
  knownLimitations: string[];
  intendedUse: string[];
};

export const syntheticDataDocumentation: SyntheticDataDocumentationSection[] = [
  {
    id: "simulation-architecture",
    title: "Simulation Architecture",
    description:
      "Tuko Kadi runs as a simulation-first election intelligence observatory that composes polling-station geography, replay timelines, anomaly scenarios, and civic signal overlays into a bounded research environment.",
    architecture: [
      "Seeded scenario definitions provide stable incident categories, county/constituency context, and replay anchors.",
      "Client-side stores maintain simulation ticks, active regions, replay focus, telemetry events, and dismissed alerts without claiming live electoral feeds.",
      "Map, telemetry, cognition, and signal panels consume the same synthetic event stream to preserve narrative consistency across the observatory.",
    ],
    assumptions: [
      "The platform is operating in simulation mode unless a future data connector explicitly states otherwise.",
      "Synthetic events are designed to resemble plausible operational patterns, not verified election incidents.",
      "Geospatial overlays are demonstrative and should be interpreted as scenario scaffolding.",
    ],
    knownLimitations: [
      "No current module validates events against official electoral commission data.",
      "Synthetic labels and risk scores can over-simplify complex civic, legal, and logistical realities.",
      "Replay coherence is optimized for demonstration and research readiness, not evidentiary reconstruction.",
    ],
    intendedUse: [
      "Academic demonstrations of election-monitoring interface design.",
      "Scenario planning for data governance, transparency, and responsible AI discussions.",
      "Prototype evaluation of explainability patterns for high-stakes civic technology.",
    ],
  },
  {
    id: "synthetic-telemetry-generation",
    title: "Synthetic Telemetry Generation",
    description:
      "Telemetry records emulate incident streams by combining polling-station metadata, scenario severity, turnout estimates, status labels, and AI-style risk scores.",
    architecture: [
      "Events are generated or replayed from controlled scenario inputs rather than live field submissions.",
      "Severity, turnout, category, and region fields drive visible alerts, risk summaries, and map focus behavior.",
      "Telemetry is intentionally deterministic enough for repeatable demos while retaining temporal variation for observability testing.",
    ],
    assumptions: [
      "Telemetry is synthetic and should be treated as a product of model assumptions.",
      "Risk scores represent prototype heuristics rather than audited statistical confidence.",
      "Event cadence is selected for user comprehension and interface stress testing.",
    ],
    knownLimitations: [
      "Generated events may not reflect the true base rates of election incidents.",
      "Severity thresholds are not calibrated against adjudicated historical case data.",
      "A telemetry event is a simulation artifact and not a reportable fact.",
    ],
    intendedUse: [
      "Testing real-time telemetry layouts and alert affordances.",
      "Evaluating how users interpret synthetic risk indicators.",
      "Demonstrating transparent labeling for non-live civic data streams.",
    ],
  },
  {
    id: "replay-generation",
    title: "Replay Generation",
    description:
      "Replay frames translate synthetic telemetry into a timeline that can be scrubbed, focused, and correlated with active map regions and cognitive summaries.",
    architecture: [
      "Simulation ticks index deterministic replay frames and expose a current event focus.",
      "Replay cues synchronize the bottom rail, telemetry feed, map focus, and cognitive panels.",
      "Ghost trails and replay energy are visual encodings that communicate scenario momentum, not verified movement.",
    ],
    assumptions: [
      "Replay order represents a plausible analytical narrative rather than a proven chronology.",
      "Temporal spacing is tuned for cognition and demo pacing.",
      "Frame-level causality must remain provisional unless independently verified.",
    ],
    knownLimitations: [
      "Replay timelines can imply causation if users ignore the synthetic-data notice.",
      "The current replay model does not include full provenance chains or source cross-examination.",
      "Uncertainty is summarized qualitatively rather than modeled as a formal posterior distribution.",
    ],
    intendedUse: [
      "Explaining interface support for after-action analysis.",
      "Teaching how replay cognition can surface hypotheses for human review.",
      "Preparing structured demos for research and conference settings.",
    ],
  },
  {
    id: "propagation-generation",
    title: "Propagation Generation",
    description:
      "Propagation signals model how anomaly attention, civic stress, or operational pressure could appear to spread across synthetic geographies.",
    architecture: [
      "Propagation is inferred from category, severity, risk score, region, and replay focus rather than observed transmission pathways.",
      "Map pulses and cluster counts provide tactical visualization of synthetic spread.",
      "Civic signal overlays can amplify perceived pressure where environmental, mobility, or accessibility constraints are simulated.",
    ],
    assumptions: [
      "Propagation means scenario-level analytical correlation, not proof of organized coordination.",
      "Spatial adjacency and thematic similarity can be useful but incomplete explanatory signals.",
      "Human analysts must validate any escalation hypothesis before operational use.",
    ],
    knownLimitations: [
      "The prototype cannot distinguish rumor dynamics from logistical co-occurrence without real evidence.",
      "Visual pulses may create salience disproportionate to the underlying synthetic signal.",
      "Propagation features are not intended for attribution, enforcement, or public accusation.",
    ],
    intendedUse: [
      "Exploring safeguards for networked anomaly visualization.",
      "Designing analyst workflows that separate hypothesis generation from confirmation.",
      "Stress-testing how map layers communicate uncertainty and scope.",
    ],
  },
  {
    id: "turnout-generation",
    title: "Turnout Generation",
    description:
      "Turnout estimates are synthetic pressure indicators derived from polling-station attributes, scenario risk, replay energy, and bounded heuristic variation.",
    architecture: [
      "Station metadata contributes baseline variation for heatmap points and pressure summaries.",
      "Risk and replay state modulate visual intensity so demos show temporal change.",
      "Turnout pressure is displayed as simulated operational context, not official participation data.",
    ],
    assumptions: [
      "Generated turnout values are illustrative and not audited voter-participation measurements.",
      "Risk-biased turnout shifts are scenario design choices, not empirical claims.",
      "The prototype favors explainable heuristics over opaque predictive models.",
    ],
    knownLimitations: [
      "Synthetic turnout does not account for local election law, polling logistics, demographic constraints, or verified turnout history.",
      "Heatmap intensity can be visually persuasive despite being simulated.",
      "No confidence interval should be interpreted as statistically validated without future empirical calibration.",
    ],
    intendedUse: [
      "Demonstrating how turnout pressure layers might be documented and labeled.",
      "Supporting research conversations about uncertainty in civic dashboards.",
      "Preparing the platform for future audited data provenance mechanisms.",
    ],
  },
];

export const syntheticDataSummary = {
  status: "SIMULATION MODE ACTIVE",
  indicator: "Synthetic Telemetry",
  confidenceLevel: "Experimental",
  provenance: "Simulated Events",
  operationalScope: "Research prototype for scenario analysis, interface evaluation, and governance demonstration.",
};
