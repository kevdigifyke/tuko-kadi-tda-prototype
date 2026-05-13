"use client";

import { AppShell } from "@/src/components/shell/AppShell";
import { EvidencePanel } from "@/src/components/EvidencePanel";
import { GesturePanel } from "@/src/components/GesturePanel";
import { TopologyGraph } from "@/src/components/anomalies/TopologyGraph";
import { TimelineScrubber } from "@/src/components/TimelineScrubber";
import { getClusterById, getDefaultCluster, getGraphEdges, getGraphNodes } from "@/src/lib/generatedElectionData";
import { TOPOLOGY_MODES, cycleTopology, type TopologyMode } from "@/src/lib/topologyModes";
import type { GestureCommandEvent } from "@/src/hooks/useGestureCommands";
import ocrResults from "@/src/data/generated/ocr-results.json";
import documentConflicts from "@/src/data/generated/document-conflicts.json";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "tuko-topology-mode";

export default function Anomalies() {
  const graphNodes = useMemo(() => getGraphNodes(), []);
  const graphEdges = useMemo(() => getGraphEdges(), []);
  const [selectedId, setSelectedId] = useState(getDefaultCluster().id);
  const [isPlaying, setIsPlaying] = useState(true);
  const [gestureModeActive, setGestureModeActive] = useState(false);
  const [hudMessage, setHudMessage] = useState("");
  const [topologyMode, setTopologyMode] = useState<TopologyMode>("centralized");
  const [simulationFrozen, setSimulationFrozen] = useState(false);
  const [timelinePhase, setTimelinePhase] = useState(0.45);
  const selected = useMemo(() => getClusterById(selectedId), [selectedId]);
  const ocrInstability = useMemo(() => ocrResults.documents.reduce((acc, d) => acc + (1 - d.ocrConfidence), 0) / ocrResults.documents.length + documentConflicts.conflicts.length * 0.1, []);

  useEffect(() => { const saved = localStorage.getItem(STORAGE_KEY) as TopologyMode | null; if (saved) setTopologyMode(saved); }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, topologyMode); }, [topologyMode]);
  useEffect(() => { if (!hudMessage) return; const t = window.setTimeout(() => setHudMessage(""), 1400); return () => window.clearTimeout(t); }, [hudMessage]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => setTimelinePhase((v) => (v + 0.02) % 1), 120);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const switchTopology = useCallback((next: TopologyMode) => { setTopologyMode(next); setHudMessage(`Topology: ${next[0].toUpperCase()}${next.slice(1)}`); }, []);

  const onGestureCommand = useCallback((event: GestureCommandEvent) => {
    if (event.command === "GESTURE_MODE_ACTIVE") { setGestureModeActive(true); switchTopology(cycleTopology(topologyMode, 1)); }
    if (event.command === "MODE_SWITCH_NEXT") switchTopology(cycleTopology(topologyMode, 1));
    if (event.command === "FREEZE_VIEW_TOGGLE" || event.command === "RESET_VIEW") setSimulationFrozen((s) => !s);
    if (event.command === "GRAPH_SELECT_NEXT") {
      const ids = graphNodes.map((node) => node.id);
      const idx = Math.max(0, ids.indexOf(selectedId));
      setSelectedId(ids[(idx + 1) % ids.length]);
    }
  }, [switchTopology, topologyMode, graphNodes, selectedId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") switchTopology("centralized");
      if (event.key === "2") switchTopology("decentralized");
      if (event.key === "3") switchTopology("distributed");
      if (event.key.toLowerCase() === "t" && event.shiftKey) switchTopology(cycleTopology(topologyMode, 1));
      if (event.code === "Space") { event.preventDefault(); setIsPlaying((s) => !s); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [switchTopology, topologyMode]);

  return <AppShell><section className="relative min-h-[calc(100svh-120px)] overflow-hidden rounded-xl border border-white/10 bg-[#080f11]">
    <TopologyGraph selectedId={selectedId} onSelect={setSelectedId} nodes={graphNodes} edges={graphEdges} topologyMode={topologyMode} isPlaying={isPlaying} timelinePhase={timelinePhase} simulationFrozen={simulationFrozen} />

    <div className="pointer-events-none absolute left-0 top-0 z-20 flex h-full w-full">
      <div className="pointer-events-auto m-4 w-[290px]"><GesturePanel onGestureCommand={onGestureCommand} /></div>
      <div className="pointer-events-none flex-1" />
      {selectedId && <div className="pointer-events-auto m-4 w-[360px]"><EvidencePanel cluster={selected} /></div>}
    </div>

    <div className="pointer-events-auto absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-xl border border-cyan-300/35 bg-[#0b1618]/65 px-3 py-2 backdrop-blur">
      <p className="text-center text-[10px] uppercase tracking-[0.18em] text-cyan-100/75">Topology Mode</p>
      <div className="mt-2 flex gap-2">{TOPOLOGY_MODES.map((mode) => <button key={mode.key} title={`${mode.label} (${mode.shortcut})`} onClick={() => switchTopology(mode.key)} className={`rounded-md border px-3 py-1 text-xs ${topologyMode===mode.key?"border-cyan-200 bg-cyan-300/20 text-cyan-100":"border-white/15 bg-black/30 text-[#c1d0d4]"}`}>{mode.label.toUpperCase()}</button>)}</div>
    </div>

    {hudMessage && <div className="absolute left-1/2 top-20 z-30 -translate-x-1/2 rounded-md border border-cyan-300/50 bg-[#071315]/85 px-3 py-1 text-xs text-cyan-100">{hudMessage}</div>}
    <div className="absolute right-4 top-4 z-30 rounded border border-amber-300/45 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">OCR-linked cluster instability: +{ocrInstability.toFixed(2)}</div>

    <div className="absolute bottom-4 left-4 right-4 z-20"><TimelineScrubber isPlaying={isPlaying} onToggle={() => setIsPlaying((s) => !s)} events={selected.timelineEvents} /></div>
    {gestureModeActive && <div className="absolute left-4 top-4 z-30 rounded border border-cyan-300/40 bg-cyan-300/10 px-2 py-1 text-[10px] text-cyan-100">Gesture topology switching active</div>}
  </section></AppShell>;
}
