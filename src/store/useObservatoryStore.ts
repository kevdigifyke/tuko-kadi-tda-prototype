"use client";

import { create } from "zustand";

export type ReplaySpeed = 0.5 | 1 | 2 | 4;

export interface TelemetryEvent {
  timestamp: string;
  county?: string;
  anomalyScore?: number;
  turnout?: number;
}

interface ObservatoryState {
  replayPosition: number;
  replaySpeed: ReplaySpeed;
  isPlaying: boolean;
  selectedRegion: string;
  anomalyCount: number;
  activeStations: number;
  highRiskRegions: number;
  turnoutAverage: number;
  liveEventCount: number;
  setSelectedRegion: (region: string) => void;
  setReplayPosition: (value: number) => void;
  setReplaySpeed: (value: ReplaySpeed) => void;
  togglePlay: () => void;
  ingestTelemetry: (event: TelemetryEvent) => void;
}

export const useObservatoryStore = create<ObservatoryState>((set) => ({
  replayPosition: 38,
  replaySpeed: 1,
  isPlaying: true,
  selectedRegion: "National",
  anomalyCount: 24,
  activeStations: 21876,
  highRiskRegions: 11,
  turnoutAverage: 63.2,
  liveEventCount: 0,
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setReplayPosition: (value) => set({ replayPosition: value }),
  setReplaySpeed: (value) => set({ replaySpeed: value }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  ingestTelemetry: (event: TelemetryEvent) =>
    set((state) => ({
      liveEventCount: state.liveEventCount + 1,
      anomalyCount: Math.max(0, Math.round((state.anomalyCount * 0.85 + (event.anomalyScore ?? 0) * 0.18) * 10) / 10),
      highRiskRegions: Math.max(1, Math.min(47, state.highRiskRegions + ((event.anomalyScore ?? 0) > 72 ? 1 : 0))),
      turnoutAverage: Math.max(0, Math.min(100, Math.round((state.turnoutAverage * 0.92 + ((event.turnout ?? 55) * 0.08)) * 10) / 10)),
      activeStations: Math.max(0, state.activeStations + ((event.turnout ?? 50) > 70 ? 2 : 1)),
      selectedRegion: event.county ?? state.selectedRegion,
    })),
}));
