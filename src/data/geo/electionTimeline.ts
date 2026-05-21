import { pollingStations } from "./pollingStations";

export interface ElectionTimelineStationSnapshot {
  id: string;
  name: string;
  county: string;
  constituency: string;
  ward: string;
  lat: number;
  lng: number;
  voters: number;
  risk: "low" | "medium" | "high";
  timestamp: string;
  turnout: number;
  anomalyScore: number;
  spatialRisk: number;
  cumulativeVotes: number;
  crowdIndex: number;
}

export interface ElectionTimelineFrame {
  index: number;
  timestamp: string;
  stations: ElectionTimelineStationSnapshot[];
}

const START_HOUR = 6;
const END_HOUR = 20;

const RISK_BASELINE: Record<string, number> = {
  low: 24,
  medium: 42,
  high: 62,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const makeTimestamp = (hour: number) => {
  const date = new Date(Date.UTC(2026, 4, 21, hour, 0, 0));
  return date.toISOString();
};

export function generateElectionTimeline() {
  const frames: ElectionTimelineFrame[] = [];
  const totalHours = END_HOUR - START_HOUR;

  for (let hour = START_HOUR; hour <= END_HOUR; hour += 1) {
    const step = hour - START_HOUR;
    const progress = step / totalHours;

    const stations = pollingStations.map((station, stationIndex) => {
      const riskSeed = RISK_BASELINE[station.risk] ?? 30;
      const localWave = (Math.sin(progress * Math.PI * 2 + stationIndex) + 1) / 2;
      const turnoutCurve = Math.pow(progress, 0.82);
      const turnout = clamp(turnoutCurve * 88 + localWave * 7, 0, 100);
      const anomalyScore = clamp(
        riskSeed / 100 + progress * 0.3 + localWave * 0.25,
        0,
        1,
      );
      const spatialRisk = clamp(
        riskSeed + anomalyScore * 30 + turnout / 4,
        0,
        100,
      );
      const cumulativeVotes = Math.round((turnout / 100) * station.voters);
      const crowdIndex = clamp(turnout / 100 + localWave * 0.35, 0, 1.5);

      return {
        ...station,
        timestamp: makeTimestamp(hour),
        turnout: Number(turnout.toFixed(1)),
        anomalyScore: Number(anomalyScore.toFixed(2)),
        spatialRisk: Number(spatialRisk.toFixed(1)),
        cumulativeVotes,
        crowdIndex: Number(crowdIndex.toFixed(2)),
      };
    });

    frames.push({
      index: step,
      timestamp: makeTimestamp(hour),
      stations,
    });
  }

  return frames;
}
