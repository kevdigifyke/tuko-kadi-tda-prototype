"use client";

import { AppShell } from "@/src/components/shell/AppShell";
import { EvidencePanel } from "@/src/components/EvidencePanel";
import { GesturePanel } from "@/src/components/GesturePanel";
import { TdaGraph } from "@/src/components/TdaGraph";
import { TimelineScrubber } from "@/src/components/TimelineScrubber";
import { getClusterById, getClusterGraph, getDefaultCluster, getGraphEdges, getGraphNodes } from "@/src/lib/generatedElectionData";
import type { GestureCommandEvent } from "@/src/hooks/useGestureCommands";
import { useCallback, useEffect, useMemo, useState } from "react";

type ForensicMode = "Live Pulse" | "Forensic Cluster" | "Time Machine";

const FORENSIC_MODES: ForensicMode[] = [
  "Live Pulse",
  "Forensic Cluster",
  "Time Machine",
];

export default function Anomalies() {
  const graphNodes = useMemo(() => getGraphNodes(), []);
  const graphEdges = useMemo(() => getGraphEdges(), []);
  const [selectedId, setSelectedId] = useState(getDefaultCluster().id);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentMode, setCurrentMode] = useState<ForensicMode>("Forensic Cluster");
  const [gestureModeActive, setGestureModeActive] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState("");

  const selected = useMemo(
    () => getClusterById(selectedId),
    [selectedId],
  );

  const selectNextCluster = useCallback(() => {
    setSelectedId((prev) => {
      const currentIndex = graphNodes.findIndex((node) => node.id === prev);
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % graphNodes.length : 0;
      return graphNodes[nextIndex].id;
    });
  }, [graphNodes]);

  const switchNextMode = useCallback(() => {
    setCurrentMode((prev) => {
      const currentIndex = FORENSIC_MODES.indexOf(prev);
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % FORENSIC_MODES.length : 0;
      return FORENSIC_MODES[nextIndex];
    });
  }, []);

  const resetView = useCallback(() => {
    setSelectedId(getDefaultCluster().id);
    setCurrentMode("Forensic Cluster");
    setFrozen(false);
  }, []);

  const onGestureCommand = useCallback((event: GestureCommandEvent) => {
    setCommandFeedback(event.label);

    switch (event.command) {
      case "GESTURE_MODE_ACTIVE":
        setGestureModeActive(true);
        break;
      case "GRAPH_SELECT_NEXT":
        selectNextCluster();
        break;
      case "MODE_SWITCH_NEXT":
        switchNextMode();
        break;
      case "FREEZE_VIEW_TOGGLE":
        setFrozen((prev) => !prev);
        break;
      case "RESET_VIEW":
        resetView();
        break;
      case "TIMELINE_PLAY_PAUSE":
        setIsPlaying((prev) => !prev);
        break;
      case "NONE":
      default:
        break;
    }
  }, [resetView, selectNextCluster, switchNextMode]);

  useEffect(() => {
    if (!commandFeedback) return;

    const timer = window.setTimeout(() => {
      setCommandFeedback("");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [commandFeedback]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setIsPlaying((prev) => !prev);
      }

      const key = event.key.toLowerCase();

      if (key === "r") {
        resetView();
      }

      if (key === "m") {
        switchNextMode();
      }

      if (key === "f") {
        setFrozen((prev) => !prev);
      }

      if (event.key === "ArrowRight") {
        selectNextCluster();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resetView, selectNextCluster, switchNextMode]);

  return (
    <AppShell>
      <div className="space-y-3">
        <div className="hidden items-center justify-between md:flex">
          <div>
            <p className="panel-kicker text-[#00daf3]">
              Anomalies // Forensic Command Stage
            </p>
            <h1 className="sr-only">Anomaly Network Command</h1>
            <p className="mt-1 text-sm text-[#bac9cc]">Mode: {currentMode}</p>
            <p className="mt-1 text-xs text-[#8fa6ad]">Risk: {selected.riskLevel} • Reviewer: {selected.reviewerStatus}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded border border-[#ffb4ab]/45 bg-[#93000a]/30 px-2 py-1 text-xs font-semibold text-[#ffdad6]">Risk {selected.riskLevel}</span>
            <span className="rounded border border-white/20 bg-[#151d1e]/95 px-2 py-1 text-xs text-[#dce4e5]">{selected.reviewerStatus}</span>
            {gestureModeActive && (
              <span className="rounded border border-cyan-300/50 bg-cyan-400/15 px-2 py-1 text-xs font-semibold text-cyan-100">
                Gesture Mode Active
              </span>
            )}
            {frozen && (
              <span className="rounded border border-amber-300/50 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-100">
                Frozen View
              </span>
            )}
            {commandFeedback && (
              <span className="rounded border border-white/20 bg-[#151d1e]/95 px-2 py-1 text-xs text-[#dce4e5]">
                {commandFeedback}
              </span>
            )}
            <div className="rounded-md border border-[#ffb4ab]/45 bg-[#93000a]/30 px-4 py-2 text-sm font-semibold text-[#ffdad6]">
              Human review recommended
            </div>
          </div>
        </div>

        <section className="relative min-h-[calc(100svh-128px)] overflow-hidden rounded-xl border border-white/10 bg-[#080f11] md:min-h-[calc(100svh-144px)] xl:min-h-[calc(100svh-150px)]">
          <TdaGraph selectedId={selectedId} onSelect={setSelectedId} nodes={graphNodes} edges={graphEdges} />

          <div className="relative z-10 flex min-h-[calc(100svh-128px)] flex-col gap-3 p-3 md:min-h-[calc(100svh-144px)] md:p-4 xl:hidden">
            <div className="w-full rounded-md border-l-4 border-[#ffb4ab] bg-[#151d1e]/95 p-3">
              <p className="panel-kicker text-[#ffb4ab]">Live Anomaly Detected</p>
              <p className="font-mono text-4xl font-bold leading-none text-[#dce4e5]">
                {getClusterGraph().nodes.length}
              </p>
              <p className="text-sm text-[#bac9cc]">Mode: {currentMode}</p>
            </div>

            <GesturePanel onGestureCommand={onGestureCommand} />
            <EvidencePanel cluster={selected} />

            <div className="mt-auto">
              <TimelineScrubber
                isPlaying={isPlaying}
                onToggle={() => setIsPlaying((state) => !state)}
                events={selected.timelineEvents}
              />
            </div>
          </div>

          <div className="absolute inset-0 z-10 hidden xl:block">
            <div className="absolute left-6 top-6 w-[245px] border-l-4 border-[#ffb4ab] bg-[#151d1e]/92 p-4 backdrop-blur">
              <p className="panel-kicker text-[#ffb4ab]">Live Anomaly Detected</p>
              <p className="font-mono text-5xl font-bold leading-none text-[#dce4e5]">
                {getClusterGraph().nodes.length}
              </p>
              <p className="mt-1 text-sm text-[#bac9cc]">Mode: {currentMode}</p>
            <p className="mt-1 text-xs text-[#8fa6ad]">Risk: {selected.riskLevel} • Reviewer: {selected.reviewerStatus}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {gestureModeActive && (
                  <span className="rounded border border-cyan-300/50 bg-cyan-400/15 px-2 py-1 text-[10px] font-semibold text-cyan-100">
                    Gesture Mode Active
                  </span>
                )}
                {frozen && (
                  <span className="rounded border border-amber-300/50 bg-amber-400/10 px-2 py-1 text-[10px] font-semibold text-amber-100">
                    Frozen View
                  </span>
                )}
                {commandFeedback && (
                  <span className="rounded border border-white/20 bg-[#151d1e]/95 px-2 py-1 text-[10px] text-[#dce4e5]">
                    {commandFeedback}
                  </span>
                )}
              </div>
            </div>

            <div className="absolute left-6 top-40">
              <GesturePanel onGestureCommand={onGestureCommand} />
            </div>

            <div className="absolute right-6 top-20">
              <EvidencePanel cluster={selected} />
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-20">
              <TimelineScrubber
                isPlaying={isPlaying}
                onToggle={() => setIsPlaying((state) => !state)}
                events={selected.timelineEvents}
              />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
