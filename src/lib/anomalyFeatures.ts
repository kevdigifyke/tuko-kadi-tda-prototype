import type { AnomalyFlag, PollingStationRecord } from "@/src/types/election";

export type AnomalyFeatureVector = {
  turnoutRate: number;
  spoiltVoteRate: number;
  presidentialGovernorGap: number;
  presidentialMpGap: number;
  presidentialMcaGap: number;
  ocrConfidence: number;
  sourceConsensus: number;
  officialMatchScore: number;
  uploadDelayMinutes: number;
  anomalyScore: number;
};

const round = (value: number) => Number(value.toFixed(2));

const scoreFromFlags = (flags: AnomalyFlag[]) => {
  if (!flags.length) return 12;
  return round(flags.reduce((sum, flag) => sum + flag.severity * (flag.confidence / 100), 0) / flags.length);
};

export const buildStationFeatureVector = (station: PollingStationRecord): AnomalyFeatureVector => {
  const turnoutRate = station.registeredVoters > 0 ? (station.ballotsCast / station.registeredVoters) * 100 : 0;
  const spoiltVoteRate = station.ballotsCast > 0 ? (station.rejectedBallots / station.ballotsCast) * 100 : 0;

  const baseShift = ((station.stationId.charCodeAt(4) + station.stationId.charCodeAt(5)) % 10) / 10;
  const presidentialGovernorGap = Math.abs((turnoutRate * 0.23 + baseShift) % 12);
  const presidentialMpGap = Math.abs((turnoutRate * 0.19 + baseShift * 0.7) % 11);
  const presidentialMcaGap = Math.abs((turnoutRate * 0.15 + baseShift * 0.5) % 9);

  const delayBias = station.anomalyFlags.some((flag) => flag.type === "late-upload") ? 120 : 20;
  const uploadDelayMinutes = round(delayBias + ((station.stationId.charCodeAt(6) + station.stationId.charCodeAt(7)) % 140));

  const confidencePenalty = station.anomalyFlags.some((flag) => flag.type === "form-mismatch") ? 23 : 8;
  const ocrConfidence = round(Math.max(35, 97 - confidencePenalty - baseShift * 5));
  const sourceConsensus = round(Math.max(40, 96 - station.anomalyFlags.length * 9 - baseShift * 3));
  const officialMatchScore = round(Math.max(38, 97 - station.anomalyFlags.length * 12 - baseShift * 4));
  const anomalyScore = scoreFromFlags(station.anomalyFlags);

  return {
    turnoutRate: round(turnoutRate),
    spoiltVoteRate: round(spoiltVoteRate),
    presidentialGovernorGap: round(presidentialGovernorGap),
    presidentialMpGap: round(presidentialMpGap),
    presidentialMcaGap: round(presidentialMcaGap),
    ocrConfidence,
    sourceConsensus,
    officialMatchScore,
    uploadDelayMinutes,
    anomalyScore,
  };
};
