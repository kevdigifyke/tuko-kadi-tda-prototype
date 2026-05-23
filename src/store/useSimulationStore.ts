"use client";

import { simulationScenarios } from "@/src/data/simulation/scenarios";
import { generateSyntheticTick } from "@/src/lib/simulation/generator";
import type { ScenarioId, SimulationTick } from "@/src/types/simulation";
import { create } from "zustand";

const initialScenario = simulationScenarios[0];

type SimulationState = {
  isRunning: boolean;
  tick: number;
  speed: number;
  scenario: ScenarioId;
  timeline: SimulationTick;
  setScenario: (id: ScenarioId) => void;
  setSpeed: (speed: number) => void;
  setTick: (tick: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  advance: () => void;
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  isRunning: false,
  tick: 0,
  speed: 1,
  scenario: initialScenario.id,
  timeline: generateSyntheticTick(0, initialScenario),
  setScenario: (id) => {
    const scenario = simulationScenarios.find((s) => s.id === id) ?? initialScenario;
    set({ scenario: scenario.id, tick: 0, timeline: generateSyntheticTick(0, scenario), isRunning: false });
  },
  setSpeed: (speed) => set({ speed }),
  setTick: (tick) => {
    const scenario = simulationScenarios.find((s) => s.id === get().scenario) ?? initialScenario;
    set({ tick, timeline: generateSyntheticTick(tick, scenario) });
  },
  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () => {
    const scenario = simulationScenarios.find((s) => s.id === get().scenario) ?? initialScenario;
    set({ isRunning: false, tick: 0, timeline: generateSyntheticTick(0, scenario) });
  },
  advance: () => {
    const { tick, speed, scenario: scenarioId } = get();
    const scenario = simulationScenarios.find((s) => s.id === scenarioId) ?? initialScenario;
    const nextTick = Math.min(120, tick + speed);
    set({ tick: nextTick, timeline: generateSyntheticTick(nextTick, scenario), isRunning: nextTick < 120 });
  },
}));
