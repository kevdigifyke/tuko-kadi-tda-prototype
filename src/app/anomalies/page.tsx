"use client";

import { EvidencePanel } from "@/src/components/EvidencePanel";
import { GesturePanel } from "@/src/components/GesturePanel";
import { GraphLegend } from "@/src/components/GraphLegend";
import { AppShell } from "@/src/components/shell/AppShell";
import { TdaGraph } from "@/src/components/TdaGraph";
import { TimelineScrubber } from "@/src/components/TimelineScrubber";
import { TopologySwitcher } from "@/src/components/TopologySwitcher";
import type { GestureCommandEvent } from "@/src/hooks/useGestureCommands";
import { getClusterById, getClusterGraph, getDefaultCluster, getGraphEdges, getGraphNodes } from "@/src/lib/generatedElectionData";
import { layoutTopologyNodes } from "@/src/lib/topologyLayouts";
import { TOPOLOGY_MODE_DESCRIPTIONS, TOPOLOGY_MODE_LABELS, TOPOLOGY_MODES, type TopologyMode } from "@/src/types/topology";
import { useCallback, useEffect, useMemo, useState } from "react";

type ForensicMode = "Live Pulse" | "Forensic Cluster" | "Time Machine";
const FORENSIC_MODES: ForensicMode[] = ["Live Pulse", "Forensic Cluster", "Time Machine"];

export default function Anomalies() {
  const graphNodes = useMemo(() => getGraphNodes(), []);
  const graphEdges = useMemo(() => getGraphEdges(), []);
  const [selectedId, setSelectedId] = useState(getDefaultCluster().id);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentMode, setCurrentMode] = useState<ForensicMode>("Forensic Cluster");
  const [topologyMode, setTopologyMode] = useState<TopologyMode>("decentralized");
  const [gestureModeActive, setGestureModeActive] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState("");

  const selected = useMemo(() => getClusterById(selectedId), [selectedId]);
  const positionedNodes = useMemo(() => layoutTopologyNodes({ nodes: graphNodes, edges: graphEdges, selectedId, topologyMode }), [graphEdges, graphNodes, selectedId, topologyMode]);

  const selectNextCluster = useCallback(() => {
    setSelectedId((prev) => graphNodes[(Math.max(0, graphNodes.findIndex((n) => n.id === prev)) + 1) % graphNodes.length].id);
  }, [graphNodes]);

  const switchNextMode = useCallback(() => {
    setCurrentMode((prev) => FORENSIC_MODES[(FORENSIC_MODES.indexOf(prev) + 1) % FORENSIC_MODES.length]);
  }, []);

  const cycleTopologyMode = useCallback(() => {
    setTopologyMode((prev) => TOPOLOGY_MODES[(TOPOLOGY_MODES.indexOf(prev) + 1) % TOPOLOGY_MODES.length]);
  }, []);

  const resetView = useCallback(() => {
    setSelectedId(getDefaultCluster().id);
    setCurrentMode("Forensic Cluster");
    setTopologyMode("decentralized");
    setFrozen(false);
  }, []);

  const onGestureCommand = useCallback((event: GestureCommandEvent) => {
    setCommandFeedback(event.label);
    switch (event.command) {
      case "GESTURE_MODE_ACTIVE": setGestureModeActive(true); break;
      case "GRAPH_SELECT_NEXT": selectNextCluster(); break;
      case "MODE_SWITCH_NEXT": cycleTopologyMode(); break;
      case "FREEZE_VIEW_TOGGLE": setFrozen((prev) => !prev); break;
      case "RESET_VIEW": resetView(); break;
      case "TIMELINE_PLAY_PAUSE": setIsPlaying((prev) => !prev); break;
      default: break;
    }
  }, [cycleTopologyMode, resetView, selectNextCluster]);

  useEffect(() => {
    if (!commandFeedback) return;
    const timer = window.setTimeout(() => setCommandFeedback(""), 1800);
    return () => window.clearTimeout(timer);
  }, [commandFeedback]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") { event.preventDefault(); setIsPlaying((prev) => !prev); }
      const key = event.key.toLowerCase();
      if (key === "r") resetView();
      if (key === "m") switchNextMode();
      if (key === "t") cycleTopologyMode();
      if (key === "f") setFrozen((prev) => !prev);
      if (event.key === "ArrowRight") selectNextCluster();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cycleTopologyMode, resetView, selectNextCluster, switchNextMode]);

  return <AppShell>
    <div className="space-y-3">
      <section className="relative min-h-[calc(100svh-128px)] overflow-hidden rounded-xl border border-white/10 bg-[#080f11] md:min-h-[calc(100svh-144px)] xl:min-h-[calc(100svh-150px)]">
        <TdaGraph selectedId={selectedId} onSelect={setSelectedId} nodes={positionedNodes} edges={graphEdges} topologyMode={topologyMode} />
        <div className="relative z-10 flex min-h-[calc(100svh-128px)] flex-col gap-3 p-3 md:min-h-[calc(100svh-144px)] md:p-4 xl:hidden">
          <div className="w-full rounded-md border-l-4 border-[#ffb4ab] bg-[#151d1e]/95 p-3">
            <p className="panel-kicker text-[#ffb4ab]">Live Anomaly Detected</p>
            <p className="font-mono text-4xl font-bold leading-none text-[#dce4e5]">{getClusterGraph().nodes.length}</p>
            <p className="text-sm text-[#bac9cc]">Mode: {currentMode} • Topology: {TOPOLOGY_MODE_LABELS[topologyMode]}</p>
          </div>
          <TopologySwitcher value={topologyMode} onChange={setTopologyMode} />
          <GraphLegend />
          <GesturePanel onGestureCommand={onGestureCommand} />
          <EvidencePanel cluster={selected} />
          <div className="mt-auto"><TimelineScrubber isPlaying={isPlaying} onToggle={() => setIsPlaying((state) => !state)} events={selected.timelineEvents} /></div>
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 hidden xl:block">
          <div className="pointer-events-auto absolute left-6 top-6 w-[250px] border-l-4 border-[#ffb4ab] bg-[#151d1e]/92 p-4 backdrop-blur">
            <p className="panel-kicker text-[#ffb4ab]">Live Anomaly Detected</p>
            <p className="font-mono text-5xl font-bold leading-none text-[#dce4e5]">{getClusterGraph().nodes.length}</p>
            <p className="mt-1 text-sm text-[#bac9cc]">Mode: {currentMode}</p>
            <p className="mt-1 text-xs text-cyan-200">Topology: {TOPOLOGY_MODE_LABELS[topologyMode]}</p>
            <p className="mt-1 text-[11px] text-[#8fa6ad]">{TOPOLOGY_MODE_DESCRIPTIONS[topologyMode]}</p>
          </div>
          <div className="pointer-events-auto absolute left-6 top-44"><GesturePanel onGestureCommand={onGestureCommand} /></div>
          <div className="pointer-events-auto absolute right-6 top-6 w-[300px]"><TopologySwitcher value={topologyMode} onChange={setTopologyMode} /><div className="mt-2"><GraphLegend /></div></div>
          <div className="pointer-events-auto absolute right-6 top-[280px]"><EvidencePanel cluster={selected} /></div>
          <div className="pointer-events-auto absolute bottom-6 left-6 right-6 z-20"><TimelineScrubber isPlaying={isPlaying} onToggle={() => setIsPlaying((state) => !state)} events={selected.timelineEvents} /></div>
        </div>
      </section>
    </div>
  </AppShell>;
}
