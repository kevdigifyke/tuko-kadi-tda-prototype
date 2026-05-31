"use client";

import { counties, presentationPresets, simulationScenarios } from "@/src/data/simulation/scenarios";
import { generateSyntheticTick } from "@/src/lib/simulation/generator";
import type { PresentationPresetId, ScenarioId, SimulationEventType, SimulationTick } from "@/src/types/simulation";
import { create } from "zustand";

const initialScenario = simulationScenarios[0];
const eventLabels: Record<SimulationEventType, { title: string; category: string; severity: TelemetrySeverity; weight: number }> = {
  anomaly: { title: "Injected anomaly detected", category: "Anomaly Injection", severity: "CRITICAL", weight: 14 },
  propagation: { title: "Injected propagation chain", category: "Propagation Injection", severity: "CRITICAL", weight: 12 },
  "turnout-spike": { title: "Injected turnout spike", category: "Turnout Injection", severity: "WARNING", weight: 9 },
  "reporting-delay": { title: "Injected reporting delay", category: "Reporting Delay", severity: "WARNING", weight: 8 },
  "infrastructure-outage": { title: "Injected infrastructure outage", category: "Infrastructure Outage", severity: "CRITICAL", weight: 15 },
};

type SimulationState = {
  isRunning: boolean;
  tick: number;
  speed: number;
  scenario: ScenarioId;
  timeline: SimulationTick;
  setScenario: (id: ScenarioId) => void;
  activePreset: PresentationPresetId | null;
  applyPreset: (id: PresentationPresetId) => void;
  setSpeed: (speed: number) => void;
  setTick: (tick: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  advance: () => void;
  fastForward: () => void;
  injectEvent: (type: SimulationEventType) => void;
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
  replayFrames: ReplayFrame[];
  replayCursor: number;
  setReplayCursor: (cursor: number) => void;
  recordReplayFrame: (event: TelemetryEvent) => void;
  getReplayFrameAtTick: (tick: number) => ReplayFrame | null;
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

export type ReplayFrame = {
  tick: number;
  capturedAt: number;
  event: TelemetryEvent;
  anomalyLevel: number;
  activeRegion: ActiveRegion | null;
  clusterKey: string;
  ghostTrail: Array<{ lat: number; lng: number; intensity: number }>;
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  isRunning: false,
  tick: 0,
  speed: 1,
  scenario: initialScenario.id,
  activePreset: null,
  timeline: generateSyntheticTick(0, initialScenario),
  setScenario: (id) => {
    const scenario = simulationScenarios.find((s) => s.id === id) ?? initialScenario;
    set({ scenario: scenario.id, activePreset: null, tick: 0, timeline: generateSyntheticTick(0, scenario), isRunning: false });
  },
  applyPreset: (id) => {
    const preset = presentationPresets.find((p) => p.id === id);
    if (!preset) return;
    const scenario = simulationScenarios.find((s) => s.id === preset.scenario) ?? initialScenario;
    set({
      activePreset: preset.id,
      scenario: scenario.id,
      speed: preset.speed,
      tick: 0,
      timeline: generateSyntheticTick(0, scenario),
      isRunning: false,
      replayFocus: { clusterKey: `preset:${preset.id}`, source: "auto", lastJumpAt: Date.now() },
    });
  },
  setSpeed: (speed) => set({ speed }),
  setTick: (tick) => {
    const scenario = simulationScenarios.find((s) => s.id === get().scenario) ?? initialScenario;
    const replayFrame = get().getReplayFrameAtTick(tick);
    set({
      tick,
      timeline: generateSyntheticTick(tick, scenario),
      replayCursor: tick,
      focusedTelemetryId: replayFrame?.event.id ?? get().focusedTelemetryId,
      anomalyLevel: replayFrame?.anomalyLevel ?? get().anomalyLevel,
      activeRegion: replayFrame?.activeRegion ?? get().activeRegion,
      replayFocus: replayFrame
        ? { clusterKey: replayFrame.clusterKey, source: "rail", lastJumpAt: Date.now() }
        : get().replayFocus,
    });
  },
  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () => {
    const scenario = simulationScenarios.find((s) => s.id === get().scenario) ?? initialScenario;
    set({
      isRunning: false,
      tick: 0,
      timeline: generateSyntheticTick(0, scenario),
      replayCursor: 0,
      replayFocus: { clusterKey: null, source: "auto", lastJumpAt: Date.now() },
    });
  },
  advance: () => {
    const { tick, speed, scenario: scenarioId } = get();
    const scenario = simulationScenarios.find((s) => s.id === scenarioId) ?? initialScenario;
    const nextTick = Math.min(120, tick + speed);
    set({ tick: nextTick, timeline: generateSyntheticTick(nextTick, scenario), replayCursor: nextTick, isRunning: nextTick < 120 });
  },
  fastForward: () => {
    const { tick, scenario: scenarioId } = get();
    const scenario = simulationScenarios.find((s) => s.id === scenarioId) ?? initialScenario;
    const nextTick = Math.min(120, tick + 15);
    set({
      tick: nextTick,
      timeline: generateSyntheticTick(nextTick, scenario),
      replayCursor: nextTick,
      replayFocus: { clusterKey: `${scenario.id}:fast-forward`, source: "rail", lastJumpAt: Date.now() },
      isRunning: nextTick < 120,
    });
  },
  injectEvent: (type) => {
    const descriptor = eventLabels[type];
    const { tick, scenario: scenarioId, timeline } = get();
    const scenario = simulationScenarios.find((s) => s.id === scenarioId) ?? initialScenario;
    const county = counties[(tick + descriptor.weight) % counties.length];
    const event: TelemetryEvent = {
      id: `inject-${type}-${Date.now()}`,
      timestamp: Date.now(),
      title: `${descriptor.title} • ${scenario.label}`,
      severity: descriptor.severity,
      category: descriptor.category,
      county,
      constituency: `${county} Constituency ${((tick % 6) + 1).toString().padStart(2, "0")}`,
      ward: `Ward ${((tick + descriptor.weight) % 9) + 1}`,
      status: descriptor.severity === "CRITICAL" ? "ESCALATED" : "TRACKING",
      intelligenceSeverity: descriptor.severity === "CRITICAL" ? "RED" : "AMBER",
      turnout: Math.min(98, Math.round(timeline.turnoutPressure + descriptor.weight * 1.8)),
      aiRiskScore: Math.min(100, Math.round(timeline.riskEscalation + descriptor.weight * 2.5)),
      tdaStability: Math.max(12, Math.round(timeline.integrityIndex - descriptor.weight * 1.7)),
      simulationStatus: descriptor.severity === "CRITICAL" ? "DIVERGENT" : "PREDICTIVE",
    };
    const activeRegion: ActiveRegion = {
      id: `region-${type}-${tick}`,
      name: `${county} ${descriptor.category}`,
      layer: type === "propagation" ? "county" : "constituency",
      center: [-0.0236 + descriptor.weight * 0.015, 37.9062 + (tick % 12) * 0.025],
      severity: event.intelligenceSeverity,
      flashToken: Date.now(),
    };
    get().pushTelemetryEvent(event);
    get().recordReplayFrame(event);
    set((state) => ({
      activeRegion,
      focusedTelemetryId: event.id,
      anomalyLevel: Math.min(100, state.anomalyLevel + descriptor.weight),
      replayFocus: { clusterKey: `${county}:${descriptor.category}`.toLowerCase(), source: "telemetry", lastJumpAt: Date.now() },
      replayCursor: tick,
    }));
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
  replayFrames: [],
  replayCursor: 0,
  setReplayCursor: (cursor) => set({ replayCursor: cursor }),
  recordReplayFrame: (event) =>
    set((state) => {
      const tick = Math.min(120, Math.floor((Date.now() - event.timestamp) / 1000) + 35);
      const clusterKey = `${event.county}:${event.category}`.toLowerCase();
      const frame: ReplayFrame = {
        tick,
        capturedAt: Date.now(),
        event,
        anomalyLevel: state.anomalyLevel,
        activeRegion: state.activeRegion,
        clusterKey,
        ghostTrail: [
          { lat: -0.0236 + (event.aiRiskScore - 50) * 0.002, lng: 37.9062 + (event.turnout - 50) * 0.002, intensity: 0.8 },
          { lat: -0.0236 + (event.tdaStability - 50) * 0.0015, lng: 37.9062 + (event.aiRiskScore - 50) * 0.0015, intensity: 0.5 },
        ],
      };
      const replayFrames = [frame, ...state.replayFrames.filter((f) => f.event.id !== event.id)].slice(0, 120);
      return { replayFrames };
    }),
  getReplayFrameAtTick: (tick) => {
    const frames = get().replayFrames;
    if (!frames.length) return null;
    return frames.reduce((closest, frame) => {
      const dist = Math.abs(frame.tick - tick);
      const best = Math.abs(closest.tick - tick);
      return dist < best ? frame : closest;
    }, frames[0]);
  },
}));
