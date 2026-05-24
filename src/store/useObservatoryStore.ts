"use client";

import { create } from "zustand";

export type ObservatoryMode = "Observatory" | "Simulations" | "Anomalies" | "Analytics" | "Maps";
export type TelemetrySeverity = "INFO" | "WARNING" | "CRITICAL";

export type TelemetryEvent = {
  id: string;
  county: string;
  message: string;
  severity: TelemetrySeverity;
  category: "Turnout" | "Propagation" | "Escalation" | "Sync";
  timestamp: number;
  replayTick: number;
};

type OverlayVisibility = {
  aiPrediction: boolean;
  tdaTopology: boolean;
  simulationEvolution: boolean;
  propagation: boolean;
  systemHealth: boolean;
};

type ObservatoryState = {
  mode: ObservatoryMode;
  replayTick: number;
  replaySpeed: number;
  isReplayPlaying: boolean;
  selectedCounty: string | null;
  activeAnomaly: string | null;
  telemetryEvents: TelemetryEvent[];
  simulationStatus: "idle" | "running" | "escalated";
  overlayVisibility: OverlayVisibility;
  mapSyncEnabled: boolean;
  alerts: TelemetryEvent[];
  setMode: (mode: ObservatoryMode) => void;
  setReplayTick: (tick: number) => void;
  setReplaySpeed: (speed: number) => void;
  setReplayPlaying: (playing: boolean) => void;
  setSelectedCounty: (county: string | null) => void;
  setActiveAnomaly: (anomaly: string | null) => void;
  addTelemetryEvent: (event: Omit<TelemetryEvent, "id">) => void;
  dismissAlert: (id: string) => void;
  clearOldEvents: () => void;
};

const MODE_OVERLAY: Record<ObservatoryMode, OverlayVisibility> = {
  Observatory: { aiPrediction: true, tdaTopology: true, simulationEvolution: true, propagation: true, systemHealth: true },
  Simulations: { aiPrediction: true, tdaTopology: false, simulationEvolution: true, propagation: true, systemHealth: true },
  Anomalies: { aiPrediction: true, tdaTopology: true, simulationEvolution: false, propagation: true, systemHealth: true },
  Analytics: { aiPrediction: false, tdaTopology: true, simulationEvolution: true, propagation: false, systemHealth: true },
  Maps: { aiPrediction: false, tdaTopology: false, simulationEvolution: false, propagation: true, systemHealth: true },
};

export const useObservatoryStore = create<ObservatoryState>((set) => ({
  mode: "Observatory",
  replayTick: 14,
  replaySpeed: 1,
  isReplayPlaying: true,
  selectedCounty: null,
  activeAnomaly: null,
  telemetryEvents: [],
  simulationStatus: "running",
  overlayVisibility: MODE_OVERLAY.Observatory,
  mapSyncEnabled: true,
  alerts: [],
  setMode: (mode) => set({ mode, overlayVisibility: MODE_OVERLAY[mode] }),
  setReplayTick: (replayTick) => set({ replayTick }),
  setReplaySpeed: (replaySpeed) => set({ replaySpeed }),
  setReplayPlaying: (isReplayPlaying) => set({ isReplayPlaying }),
  setSelectedCounty: (selectedCounty) => set({ selectedCounty }),
  setActiveAnomaly: (activeAnomaly) => set({ activeAnomaly }),
  addTelemetryEvent: (event) =>
    set((state) => {
      const e = { ...event, id: crypto.randomUUID() };
      const nextEvents = [e, ...state.telemetryEvents].slice(0, 40);
      const nextAlerts = e.severity === "CRITICAL" ? [e, ...state.alerts].slice(0, 6) : state.alerts;
      return {
        telemetryEvents: nextEvents,
        alerts: nextAlerts,
        selectedCounty: e.county,
        activeAnomaly: e.severity === "CRITICAL" ? e.message : state.activeAnomaly,
        simulationStatus: e.severity === "CRITICAL" ? "escalated" : "running",
      };
    }),
  dismissAlert: (id) => set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
  clearOldEvents: () =>
    set((state) => ({
      telemetryEvents: state.telemetryEvents.slice(0, 30),
      alerts: state.alerts.slice(0, 5),
    })),
}));
