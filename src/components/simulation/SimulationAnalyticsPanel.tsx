"use client";

import { useSimulationStore } from "@/src/store/useSimulationStore";

export function SimulationAnalyticsPanel() {
  const { timeline } = useSimulationStore();
  const activeStations = timeline.stations.filter((s) => s.isActive);
  const totalVotes = activeStations.reduce((a, b) => a + b.votes, 0);
  const activeAnomalies = activeStations.filter((s) => s.simulatedAnomalyScore > 0.66).length;

  return (
    <div className="rounded-xl border border-violet-300/25 bg-[#120b1f] p-4">
      <h3 className="text-violet-200 font-semibold">Simulation Analytics</h3>
      <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
        <p>Total votes simulated: <span className="text-data-md">{totalVotes.toLocaleString()}</span></p>
        <p>Polling stations activated: <span className="text-data-md">{activeStations.length}</span></p>
        <p>Active anomalies: <span className="text-data-md">{activeAnomalies}</span></p>
        <p>Integrity index: <span className="text-data-md">{timeline.integrityIndex}</span></p>
        <p>Risk escalation level: <span className="text-data-md">{timeline.riskEscalation}</span></p>
        <p>Simulation confidence score: <span className="text-data-md">{timeline.confidenceScore}</span></p>
      </div>
    </div>
  );
}
