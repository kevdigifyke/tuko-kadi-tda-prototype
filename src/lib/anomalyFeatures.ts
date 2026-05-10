import type { AnomalyFlag, PollingStationRecord } from "@/src/types/election";

export type AnomalyFeatureVector = {
  turnoutRate: number;
  spoiltVoteRate: number;
  presidentialGovernorGap: number;
  presidentialMpGap: number;
  presidentialMcaGap: number;
  governorMcaGap: number;
  mpMcaGap: number;
  womanRepMcaGap: number;
  senatorMcaGap: number;
  maxCrossRaceGap: number;
  averageCrossRaceGap: number;
  crossRaceVarianceScore: number;
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

  const anchor = Math.max(station.raceTotals.mca, 1);
  const presidentialGovernorGap = Math.abs(((station.raceTotals.presidential - station.raceTotals.governor) / anchor) * 100);
  const presidentialMpGap = Math.abs(((station.raceTotals.presidential - station.raceTotals.mp) / anchor) * 100);
  const presidentialMcaGap = Math.abs(((station.raceTotals.presidential - station.raceTotals.mca) / anchor) * 100);
  const governorMcaGap = Math.abs(((station.raceTotals.governor - station.raceTotals.mca) / anchor) * 100);
  const mpMcaGap = Math.abs(((station.raceTotals.mp - station.raceTotals.mca) / anchor) * 100);
  const womanRepMcaGap = Math.abs(((station.raceTotals.womanRep - station.raceTotals.mca) / anchor) * 100);
  const senatorMcaGap = station.raceTotals.senator == null ? 0 : Math.abs(((station.raceTotals.senator - station.raceTotals.mca) / anchor) * 100);
  const gapSet = [presidentialMcaGap, governorMcaGap, mpMcaGap, womanRepMcaGap, senatorMcaGap].filter((v) => v > 0);
  const maxCrossRaceGap = Math.max(...gapSet, 0);
  const averageCrossRaceGap = gapSet.length ? gapSet.reduce((sum, g) => sum + g, 0) / gapSet.length : 0;
  const crossRaceVarianceScore = station.crossRaceVariance;

  const delayBias = station.anomalyFlags.some((flag) => flag.type === "late-upload") ? 120 : 20;
  const uploadDelayMinutes = round(delayBias + ((station.stationId.charCodeAt(6) + station.stationId.charCodeAt(7)) % 140));

  const confidencePenalty = station.anomalyFlags.some((flag) => flag.type === "form-mismatch") ? 23 : 8;
  const ocrConfidence = round(Math.max(35, 97 - confidencePenalty - maxCrossRaceGap * 0.25));
  const sourceConsensus = round(Math.max(40, 96 - station.anomalyFlags.length * 9 - maxCrossRaceGap * 0.4));
  const officialMatchScore = round(Math.max(38, 97 - station.anomalyFlags.length * 12 - maxCrossRaceGap * 0.5));
  const anomalyScore = scoreFromFlags(station.anomalyFlags);

  return {
    turnoutRate: round(turnoutRate),
    spoiltVoteRate: round(spoiltVoteRate),
    presidentialGovernorGap: round(presidentialGovernorGap),
    presidentialMpGap: round(presidentialMpGap),
    presidentialMcaGap: round(presidentialMcaGap),
    governorMcaGap: round(governorMcaGap),
    mpMcaGap: round(mpMcaGap),
    womanRepMcaGap: round(womanRepMcaGap),
    senatorMcaGap: round(senatorMcaGap),
    maxCrossRaceGap: round(maxCrossRaceGap),
    averageCrossRaceGap: round(averageCrossRaceGap),
    crossRaceVarianceScore: round(crossRaceVarianceScore),
    ocrConfidence,
    sourceConsensus,
    officialMatchScore,
    uploadDelayMinutes,
    anomalyScore,
  };
};
