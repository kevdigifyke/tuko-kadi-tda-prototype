import { AppShell } from "@/src/components/shell/AppShell";
import { SimulationEngineRuntime } from "@/src/components/simulation/SimulationEngineRuntime";
import { SimulationReplayLayer } from "@/src/components/simulation/SimulationReplayLayer";
import { SimulationAnalyticsPanel } from "@/src/components/simulation/SimulationAnalyticsPanel";
import { ScenarioControlCenter } from "@/src/components/scenarios/ScenarioControlCenter";
import CognitiveIntelligencePanel from "@/src/components/command/CognitiveIntelligencePanel";

export default function ScenarioControlPage() {
  return (
    <AppShell>
      <SimulationEngineRuntime />
      <div className="space-y-5">
        <ScenarioControlCenter />
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <SimulationReplayLayer />
          <CognitiveIntelligencePanel />
        </div>
        <SimulationAnalyticsPanel />
      </div>
    </AppShell>
  );
}
