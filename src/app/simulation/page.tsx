import { AppShell } from "@/src/components/shell/AppShell";
import { SimulationAnalyticsPanel } from "@/src/components/simulation/SimulationAnalyticsPanel";
import { SimulationControlPanel } from "@/src/components/simulation/SimulationControlPanel";
import { SimulationEngineRuntime } from "@/src/components/simulation/SimulationEngineRuntime";
import { SimulationReplayLayer } from "@/src/components/simulation/SimulationReplayLayer";
import { ScenarioComparisonPanel } from "@/src/components/simulation/ScenarioComparisonPanel";

export default function SimulationPage() {
  return (
    <AppShell>
      <SimulationEngineRuntime />
      <div className="space-y-4">
        <h1 className="text-display">Synthetic Election Simulation Engine</h1>
        <SimulationControlPanel />
        <SimulationReplayLayer />
        <SimulationAnalyticsPanel />
        <ScenarioComparisonPanel />
      </div>
    </AppShell>
  );
}
