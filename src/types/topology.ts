export type TopologyMode = "centralized" | "decentralized" | "distributed";

export const TOPOLOGY_MODES: TopologyMode[] = [
  "centralized",
  "decentralized",
  "distributed",
];

export const TOPOLOGY_MODE_LABELS: Record<TopologyMode, string> = {
  centralized: "Centralized",
  decentralized: "Decentralized",
  distributed: "Distributed",
};

export const TOPOLOGY_MODE_DESCRIPTIONS: Record<TopologyMode, string> = {
  centralized: "Strongest anomaly gravity center",
  decentralized: "Regional or anomaly-type hubs",
  distributed: "Peer-to-peer similarity mesh",
};
