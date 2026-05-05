"use client";

import { useEffect, useMemo, useState } from "react";
import { TopHud } from "@/src/components/TopHud";
import { GesturePanel } from "@/src/components/GesturePanel";
import { TdaGraph } from "@/src/components/TdaGraph";
import { EvidencePanel } from "@/src/components/EvidencePanel";
import { TimelineScrubber } from "@/src/components/TimelineScrubber";
import { Sidebar } from "@/src/components/Sidebar";
import { mockNodes } from "@/src/data/mockGraph";

export default function Home() {
  const [selectedId, setSelectedId] = useState("ne-04");
  const [isPlaying, setIsPlaying] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const selectedCluster = useMemo(() => mockNodes.find((n) => n.id === selectedId) ?? mockNodes[0], [selectedId]);

  useEffect(() => {
    const syncClock = () => setLastUpdated(new Date().toLocaleTimeString());
    syncClock();
    const interval = setInterval(syncClock, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <main className="h-screen overflow-hidden bg-[#061014] text-[#e5f6f8]">
      <div className="grid h-full grid-cols-1 md:grid-cols-[250px_1fr]">
        <Sidebar />
        <section className="relative h-full min-h-0">
          <TopHud lastUpdated={lastUpdated} />
          <div className="relative h-[calc(100%-4rem)]">
            <TdaGraph selectedId={selectedId} onSelect={setSelectedId} />
            <div className="absolute inset-0 z-10 hidden xl:block">
              <div className="absolute left-6 top-40"><GesturePanel /></div>
              <div className="absolute right-8 top-40"><EvidencePanel cluster={selectedCluster} /></div>
              <div className="absolute bottom-8 left-6 right-6"><TimelineScrubber isPlaying={isPlaying} onToggle={() => setIsPlaying((s) => !s)} /></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
