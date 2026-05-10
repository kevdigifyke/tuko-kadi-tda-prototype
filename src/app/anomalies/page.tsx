"use client";

import { AppShell } from "@/src/components/shell/AppShell";
import { EvidencePanel } from "@/src/components/EvidencePanel";
import { GesturePanel } from "@/src/components/GesturePanel";
import { TdaGraph } from "@/src/components/TdaGraph";
import { TimelineScrubber } from "@/src/components/TimelineScrubber";
import { mockNodes } from "@/src/data/mockGraph";
import { useEffect, useMemo, useState } from "react";

export default function Anomalies() {
  const [selectedId, setSelectedId] = useState("ne-04");
  const [isPlaying, setIsPlaying] = useState(true);

  const selected = useMemo(
    () => mockNodes.find((node) => node.id === selectedId) ?? mockNodes[0],
    [selectedId],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setIsPlaying((prev) => !prev);
      }

      if (event.key.toLowerCase() === "r") {
        setSelectedId("ne-04");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AppShell>
      <div className="space-y-3">
        <div className="hidden items-center justify-between md:flex">
          <div>
            <p className="panel-kicker text-[#00daf3]">
              Anomalies // Forensic Command Stage
            </p>
            <h1 className="sr-only">Anomaly Network Command</h1>
          </div>

          <div className="rounded-md border border-[#ffb4ab]/45 bg-[#93000a]/30 px-4 py-2 text-sm font-semibold text-[#ffdad6]">
            Human review recommended
          </div>
        </div>

        <section className="relative min-h-[calc(100svh-128px)] overflow-hidden rounded-xl border border-white/10 bg-[#080f11] md:min-h-[calc(100svh-144px)] xl:min-h-[calc(100svh-150px)]">
          <TdaGraph selectedId={selectedId} onSelect={setSelectedId} />

          <div className="relative z-10 flex min-h-[calc(100svh-128px)] flex-col gap-3 p-3 md:min-h-[calc(100svh-144px)] md:p-4 xl:hidden">
            <div className="w-full rounded-md border-l-4 border-[#ffb4ab] bg-[#151d1e]/95 p-3">
              <p className="panel-kicker text-[#ffb4ab]">
                Live Anomaly Detected
              </p>
              <p className="font-mono text-4xl font-bold leading-none text-[#dce4e5]">
                14
              </p>
              <p className="text-sm text-[#bac9cc]">
                Forensic Cluster View Active
              </p>
            </div>

            <GesturePanel />
            <EvidencePanel cluster={selected} />

            <div className="mt-auto">
              <TimelineScrubber
                isPlaying={isPlaying}
                onToggle={() => setIsPlaying((state) => !state)}
              />
            </div>
          </div>

          <div className="absolute inset-0 z-10 hidden xl:block">
            <div className="absolute left-6 top-6 w-[245px] border-l-4 border-[#ffb4ab] bg-[#151d1e]/92 p-4 backdrop-blur">
              <p className="panel-kicker text-[#ffb4ab]">
                Live Anomaly Detected
              </p>
              <p className="font-mono text-5xl font-bold leading-none text-[#dce4e5]">
                14
              </p>
              <p className="mt-1 text-sm text-[#bac9cc]">
                Forensic Cluster View Active
              </p>
            </div>

            <div className="absolute left-6 top-40">
              <GesturePanel />
            </div>

            <div className="absolute right-6 top-20">
              <EvidencePanel cluster={selected} />
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-20">
              <TimelineScrubber
                isPlaying={isPlaying}
                onToggle={() => setIsPlaying((state) => !state)}
              />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
