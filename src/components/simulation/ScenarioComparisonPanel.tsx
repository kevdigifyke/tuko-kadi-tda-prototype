"use client";

import { simulationScenarios } from "@/src/data/simulation/scenarios";
import { generateSyntheticTick } from "@/src/lib/simulation/generator";

export function ScenarioComparisonPanel() {
  const normal = simulationScenarios.find((s) => s.id === "A")!;
  const manipulated = simulationScenarios.find((s) => s.id === "B")!;
  const normalSample = generateSyntheticTick(70, normal);
  const manipulatedSample = generateSyntheticTick(70, manipulated);

  return (
    <div className="rounded-xl border border-emerald-300/25 bg-[#071810] p-4">
      <h3 className="font-semibold text-emerald-200">Scenario Comparison Mode (A vs B)</h3>
      <div className="mt-3 grid gap-2 md:grid-cols-2 text-sm">
        <p>Normal risk distribution: <span className="text-data-md">{normalSample.riskEscalation}</span></p>
        <p>Manipulated risk distribution: <span className="text-data-md">{manipulatedSample.riskEscalation}</span></p>
        <p>Normal graph topology stress: <span className="text-data-md">{normalSample.clusterGrowth}</span></p>
        <p>Manipulated graph topology stress: <span className="text-data-md">{manipulatedSample.clusterGrowth}</span></p>
        <p>Normal integrity index: <span className="text-data-md">{normalSample.integrityIndex}</span></p>
        <p>Manipulated integrity index: <span className="text-data-md">{manipulatedSample.integrityIndex}</span></p>
      </div>
    </div>
  );
}
