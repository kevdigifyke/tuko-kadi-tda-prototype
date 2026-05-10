import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { candidates } from "@/src/data/candidateConfig";
import { buildElectionSummary } from "@/src/lib/electionAggregates";
import { generateClusterGraph } from "@/src/lib/generateClusterGraph";
import { createSeededRandom, randomInt } from "@/src/lib/seededRandom";
import type { AnomalyFlag, PollingStationRecord, StationDetailRecord } from "@/src/types/election";

const STATION_TARGET = 55393;
const COUNTIES = ["Nairobi", "Mombasa", "Kisumu", "Uasin Gishu", "Nakuru", "Machakos", "Kiambu", "Kakamega"];

const anomalyFor = (rand: () => number): AnomalyFlag[] => {
  const p = rand();
  if (p < 0.82) return [];
  if (p < 0.9) return [{ type: "late-upload", severity: randomInt(rand, 40, 70), confidence: randomInt(rand, 65, 90), note: "Delayed electronic transmission." }];
  if (p < 0.96) return [{ type: "turnout-spike", severity: randomInt(rand, 60, 92), confidence: randomInt(rand, 70, 94), note: "Turnout trend exceeds ward baseline." }];
  return [{ type: "form-mismatch", severity: randomInt(rand, 70, 99), confidence: randomInt(rand, 75, 96), note: "Digitized totals differ from source form." }];
};

const generateStations = (seed = 20260510): PollingStationRecord[] => {
  const rand = createSeededRandom(seed);
  const rows: PollingStationRecord[] = [];

  for (let i = 0; i < STATION_TARGET; i += 1) {
    const county = COUNTIES[i % COUNTIES.length];
    const constituency = `${county} Constituency ${String((i % 12) + 1).padStart(2, "0")}`;
    const ward = `Ward ${String((i % 50) + 1).padStart(2, "0")}`;
    const registeredVoters = randomInt(rand, 220, 1400);
    const turnoutPercent = 48 + rand() * 44;
    const ballotsCast = Math.max(1, Math.min(registeredVoters, Math.round((registeredVoters * turnoutPercent) / 100)));
    const rejectedBallots = Math.min(randomInt(rand, 0, 12), Math.floor(ballotsCast * 0.03));
    const validVotes = ballotsCast - rejectedBallots;

    const shares = candidates.map(() => rand() + 0.1);
    const shareSum = shares.reduce((a, b) => a + b, 0);
    let remaining = validVotes;
    const results = candidates.map((candidate, idx) => {
      const votes = idx === candidates.length - 1 ? remaining : Math.min(remaining, Math.round((validVotes * shares[idx]) / shareSum));
      remaining -= votes;
      return { candidateId: candidate.id, votes, percent: 0 };
    }).map((row) => ({ ...row, percent: Number(((row.votes / Math.max(validVotes, 1)) * 100).toFixed(2)) }));

    rows.push({
      stationId: `PS-${String(i + 1).padStart(5, "0")}`,
      stationCode: `STN${String(i + 1).padStart(6, "0")}`,
      stationName: `Polling Station ${i + 1}`,
      county,
      constituency,
      ward,
      registeredVoters,
      ballotsCast,
      rejectedBallots,
      turnoutPercent: Number(((ballotsCast / registeredVoters) * 100).toFixed(2)),
      results,
      anomalyFlags: anomalyFor(rand),
      reportedAt: new Date(Date.UTC(2025, 7, 9, randomInt(rand, 3, 20), randomInt(rand, 0, 59), randomInt(rand, 0, 59))).toISOString(),
    });
  }

  return rows;
};

const writeJson = (filePath: string, value: unknown) => {
  mkdirSync(dirname(resolve(filePath)), { recursive: true });
  writeFileSync(resolve(filePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

const stations = generateStations();
const summary = buildElectionSummary(stations);
const graph = generateClusterGraph(stations);
const sample: StationDetailRecord[] = stations.slice(0, 25).map((station, idx) => ({
  ...station,
  nearestStations: stations.slice(Math.max(0, idx - 2), idx + 3).map((s) => s.stationId).filter((id) => id !== station.stationId),
  notes: station.anomalyFlags.length > 0 ? ["Station flagged for manual review."] : ["Station transmission validated."],
}));

writeJson("public/generated/election-summary.json", summary);
writeJson("public/generated/cluster-graph.json", graph);
writeJson("public/generated/station-sample.json", sample);

if (process.env.GENERATE_FULL_STATIONS === "1") {
  writeJson("public/generated/full-stations.json", stations);
}

console.log(`Generated ${stations.length} synthetic station records.`);
