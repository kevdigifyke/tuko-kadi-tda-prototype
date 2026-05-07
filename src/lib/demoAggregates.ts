import { anomalyClusters, pollingStations } from "@/src/data/demoElectionData";
export const aggregateStats = {
  totalVotes: "12,482,901",
  turnout: 68.4,
  validated: 94.1,
  anomalyCount: anomalyClusters.length,
  stations: pollingStations.length,
};
