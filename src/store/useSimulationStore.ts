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
  telemetryEvents: TelemetryEvent[];
  activeAlerts: TelemetryEvent[];
  anomalyLevel: number;
  liveEventCount: number;
  pushTelemetryEvent: (event: TelemetryEvent) => void;
  dismissAlert: (id: string) => void;
  activeRegion: ActiveRegion | null;
  setActiveRegion: (region: ActiveRegion | null) => void;
  focusedTelemetryId: string | null;
  setFocusedTelemetryId: (id: string | null) => void;
  replayFocus: ReplayFocusState;
  setReplayFocus: (focus: Partial<ReplayFocusState>) => void;
};

export type TelemetrySeverity = "INFO" | "WARNING" | "CRITICAL";
export type IntelligenceSeverity = "GREEN" | "AMBER" | "RED" | "MAGENTA";

export type TelemetryEvent = {
  id: string;
  timestamp: number;
  title: string;
  severity: TelemetrySeverity;
  category: string;
  county: string;
  constituency: string;
  ward: string;
  status: "LIVE" | "TRACKING" | "ESCALATED";
  intelligenceSeverity: IntelligenceSeverity;
  turnout: number;
  aiRiskScore: number;
  tdaStability: number;
  simulationStatus: "STABLE" | "PREDICTIVE" | "DIVERGENT";
};

export type ActiveRegion = {
  id: string;
  name: string;
  layer: "county" | "constituency" | "ward";
  center: [number, number];
  severity: IntelligenceSeverity;
  flashToken: number;
};

export type ReplayFocusState = {
  clusterKey: string | null;
  source: "telemetry" | "rail" | "auto" | "map";
  lastJumpAt: number;
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
  telemetryEvents: [],
  activeAlerts: [],
  anomalyLevel: 12,
  liveEventCount: 0,
  pushTelemetryEvent: (event) =>
    set((state) => {
      const telemetryEvents = [event, ...state.telemetryEvents].slice(0, 25);
      const activeAlerts = event.severity === "CRITICAL"
        ? [event, ...state.activeAlerts].slice(0, 3)
        : state.activeAlerts;
      const severityWeight = event.severity === "CRITICAL" ? 12 : event.severity === "WARNING" ? 6 : 2;
      const anomalyLevel = Math.min(100, Math.max(4, Math.round(state.anomalyLevel * 0.82 + severityWeight)));
      return {
        telemetryEvents,
        activeAlerts,
        anomalyLevel,
        liveEventCount: telemetryEvents.length,
      };
    }),
  dismissAlert: (id) =>
    set((state) => ({
      activeAlerts: state.activeAlerts.filter((alert) => alert.id !== id),
    })),
  activeRegion: null,
  setActiveRegion: (region) => set({ activeRegion: region }),
  focusedTelemetryId: null,
  setFocusedTelemetryId: (id) => set({ focusedTelemetryId: id }),
  replayFocus: { clusterKey: null, source: "auto", lastJumpAt: 0 },
  setReplayFocus: (focus) =>
    set((state) => ({
      replayFocus: {
        ...state.replayFocus,
        ...focus,
      },
    })),
}));
