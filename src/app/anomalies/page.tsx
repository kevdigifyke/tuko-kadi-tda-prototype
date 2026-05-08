"use client";
import { AppShell } from "@/src/components/shell/AppShell";
import { useEffect, useMemo, useState } from "react";
import { TdaGraph } from "@/src/components/TdaGraph";
import { mockNodes } from "@/src/data/mockGraph";
import { GesturePanel } from "@/src/components/GesturePanel";
import { GestureCommand } from "@/src/hooks/useGestureCommands";
import { EvidencePanel } from "@/src/components/EvidencePanel";
import { TimelineScrubber } from "@/src/components/TimelineScrubber";

export default function Anomalies() {
  const [selectedId, setSelectedId] = useState("ne-04");
  const [isPlaying, setIsPlaying] = useState(true);
  const selected = useMemo(() => mockNodes.find((n) => n.id === selectedId) ?? mockNodes[0], [selectedId]);
  const [freezeView, setFreezeView] = useState(false);

  const onGestureCommand = (command: GestureCommand) => {
    if (command === "GRAPH_SELECT") {
      const idx = mockNodes.findIndex((n) => n.id === selectedId);
      const next = mockNodes[(idx + 1) % mockNodes.length];
      setSelectedId(next.id);
    }
    if (command === "MODE_SWITCH" || command === "TIMELINE_PLAY_PAUSE") setIsPlaying((prev) => !prev);
    if (command === "RESET_VIEW") setSelectedId("ne-04");
    if (command === "FREEZE_VIEW" || command === "GESTURE_MODE_ACTIVE") setFreezeView((prev) => !prev);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      if (event.key.toLowerCase() === "r") setSelectedId("ne-04");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AppShell>
      <div className="space-y-3">
        <div className="panel-kicker text-[#00daf3]">Anomalies // Forensic Command Stage</div>

        <div className="relative min-h-[76vh] overflow-hidden rounded-xl border border-white/10 bg-[#080f11] md:min-h-[79vh]">
          <TdaGraph selectedId={selectedId} onSelect={setSelectedId} />

          <div className="relative z-10 flex min-h-[76vh] flex-col gap-3 p-3 md:min-h-[79vh] md:p-4 xl:hidden">
            <div className="w-full rounded-md border-l-4 border-[#ffb4ab] bg-[#151d1e]/95 p-3">
              <p className="panel-kicker text-[#ffb4ab]">Live Anomaly Detected</p>
              <p className="font-mono text-4xl font-bold leading-none text-[#dce4e5]">14</p>
              <p className="text-sm text-[#bac9cc]">Forensic Cluster View {freezeView ? "Frozen" : "Active"}</p>
            </div>
            <GesturePanel onCommand={onGestureCommand} />
            <EvidencePanel cluster={selected} />
            <div className="mt-auto"><TimelineScrubber isPlaying={isPlaying} onToggle={() => setIsPlaying((s) => !s)} /></div>
          </div>

          <div className="absolute inset-0 z-10 hidden xl:block">
            <div className="absolute left-6 top-6 w-[245px] border-l-4 border-[#ffb4ab] bg-[#151d1e]/92 p-4">
              <p className="panel-kicker text-[#ffb4ab]">Live Anomaly Detected</p>
              <p className="font-mono text-5xl font-bold leading-none text-[#dce4e5]">14</p>
              <p className="text-sm text-[#bac9cc]">Forensic Cluster View {freezeView ? "Frozen" : "Active"}</p>
            </div>

            <div className="absolute left-6 top-40"><GesturePanel onCommand={onGestureCommand} /></div>
            <div className="absolute right-6 top-20"><EvidencePanel cluster={selected} /></div>
            <div className="absolute bottom-5 left-6 right-6"><TimelineScrubber isPlaying={isPlaying} onToggle={() => setIsPlaying((s) => !s)} /></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
