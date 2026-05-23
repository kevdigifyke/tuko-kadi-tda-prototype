"use client";

import { simulationScenarios } from "@/src/data/simulation/scenarios";
import { useSimulationStore } from "@/src/store/useSimulationStore";

export function SimulationControlPanel() {
  const { isRunning, speed, tick, scenario, start, pause, reset, setSpeed, setScenario, setTick } = useSimulationStore();

  return (
    <div className="rounded-xl border border-cyan-300/25 bg-[#07121a] p-4 space-y-3">
      <h2 className="text-lg text-cyan-200 font-semibold">Simulation Control Panel</h2>
      <div className="flex flex-wrap gap-2">
        <button onClick={start} className="rounded bg-cyan-400/20 px-3 py-1">Start simulation</button>
        <button onClick={pause} className="rounded bg-yellow-300/20 px-3 py-1">Pause simulation</button>
        <button onClick={reset} className="rounded bg-red-400/20 px-3 py-1">Reset simulation</button>
      </div>
      <label className="block text-sm">Scenario selector
        <select className="mt-1 w-full rounded bg-black/40 p-2" value={scenario} onChange={(e) => setScenario(e.target.value as typeof scenario)}>
          {simulationScenarios.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </label>
      <label className="block text-sm">Speed controls: x{speed}
        <input type="range" min={1} max={5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
      </label>
      <label className="block text-sm">Timeline scrubber: {tick}
        <input type="range" min={0} max={120} value={tick} onChange={(e) => setTick(Number(e.target.value))} className="w-full" />
      </label>
      <p className="text-xs text-cyan-100/80">Status: {isRunning ? "Running" : "Paused"} • confidence indicators rendered in analytics stream.</p>
    </div>
  );
}
