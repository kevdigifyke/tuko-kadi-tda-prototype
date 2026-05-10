import type { CandidateResult, CountySummary, ElectionSummary, PollingStationRecord, ConstituencySummary, WardSummary } from "@/src/types/election";

const pct = (num: number, den: number) => (den === 0 ? 0 : Number(((num / den) * 100).toFixed(2)));

export const buildElectionSummary = (stations: PollingStationRecord[]): ElectionSummary => {
  const wardMap = new Map<string, WardSummary>();
  const constituencyMap = new Map<string, ConstituencySummary>();
  const countyMap = new Map<string, CountySummary>();
  const candidateTotals = new Map<string, number>();

  let totalRegisteredVoters = 0;
  let totalBallotsCast = 0;

  for (const station of stations) {
    totalRegisteredVoters += station.registeredVoters;
    totalBallotsCast += station.ballotsCast;

    for (const result of station.results) {
      candidateTotals.set(result.candidateId, (candidateTotals.get(result.candidateId) ?? 0) + result.votes);
    }

    const wardKey = `${station.county}|${station.constituency}|${station.ward}`;
    const constituencyKey = `${station.county}|${station.constituency}`;
    const countyKey = station.county;

    const ward = wardMap.get(wardKey) ?? { county: station.county, constituency: station.constituency, ward: station.ward, stations: 0, registeredVoters: 0, ballotsCast: 0, turnoutPercent: 0, anomalyCount: 0 };
    ward.stations += 1; ward.registeredVoters += station.registeredVoters; ward.ballotsCast += station.ballotsCast; ward.anomalyCount += station.anomalyFlags.length;
    wardMap.set(wardKey, ward);

    const constituency = constituencyMap.get(constituencyKey) ?? { ...ward, ward: station.constituency, level: "constituency" as const };
    constituency.stations += 1; constituency.registeredVoters += station.registeredVoters; constituency.ballotsCast += station.ballotsCast; constituency.anomalyCount += station.anomalyFlags.length;
    constituencyMap.set(constituencyKey, constituency);

    const county = countyMap.get(countyKey) ?? { ...ward, constituency: countyKey, ward: countyKey, level: "county" as const };
    county.stations += 1; county.registeredVoters += station.registeredVoters; county.ballotsCast += station.ballotsCast; county.anomalyCount += station.anomalyFlags.length;
    countyMap.set(countyKey, county);
  }

  const normalize = <T extends WardSummary>(rows: T[]) => rows.map((row) => ({ ...row, turnoutPercent: pct(row.ballotsCast, row.registeredVoters) }));
  const candidateTotalVotes = Array.from(candidateTotals.values()).reduce((a, b) => a + b, 0);
  const sortedCandidateTotals: CandidateResult[] = Array.from(candidateTotals.entries()).map(([candidateId, votes]) => ({ candidateId, votes, percent: pct(votes, candidateTotalVotes) })).sort((a, b) => b.votes - a.votes);

  return {
    generatedAt: new Date().toISOString(),
    stationCount: stations.length,
    totalRegisteredVoters,
    totalBallotsCast,
    turnoutPercent: pct(totalBallotsCast, totalRegisteredVoters),
    candidateTotals: sortedCandidateTotals,
    counties: normalize(Array.from(countyMap.values())),
    constituencies: normalize(Array.from(constituencyMap.values())),
    wards: normalize(Array.from(wardMap.values())),
  };
};
