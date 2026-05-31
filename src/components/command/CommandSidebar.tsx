"use client";

import { useState } from "react";

import CognitiveIntelligencePanel from "./CognitiveIntelligencePanel";
import SignalIntelligencePanel from "./SignalIntelligencePanel";
import TransparencyLayerPanel from "../legitimacy/TransparencyLayerPanel";
import ResearchReadinessPanel from "../research/ResearchReadinessPanel";

export default function CommandSidebar({ focusMode = false }: { focusMode?: boolean }) {
  const [intelligenceBriefOpen, setIntelligenceBriefOpen] = useState(false);

  return (
    <div className="h-full space-y-3 overflow-y-auto border-r border-cyan-950/60 bg-black/88 p-3 text-zinc-300">
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400/90">
        KuraScope EOIS
      </h2>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/62 p-3">
        <h3 className="text-sm font-semibold text-white">
          AI Risk Engine
        </h3>

        <p className="text-xs text-zinc-400 mt-2">
          Monitoring national anomaly propagation patterns.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/62 p-3">
        <h3 className="text-sm font-semibold text-white">
          Observatory Intelligence
        </h3>

        <p className="text-xs text-zinc-400 mt-2">
          Persistent topology structures actively updating.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/62 p-3">
        <h3 className="text-sm font-semibold text-white">
          Simulation Engine
        </h3>

        <p className="text-xs text-zinc-400 mt-2">
          Synthetic election scenario replay active.
        </p>
      </div>

      <TransparencyLayerPanel />

      <ResearchReadinessPanel />

      <SignalIntelligencePanel />

      <section className={`rounded-xl border border-cyan-950/70 bg-zinc-950/58 shadow-[0_0_22px_rgba(45,212,191,0.05)] transition-all duration-300 ${focusMode ? "pointer-events-none opacity-0" : "opacity-100"}`}>
        <button
          type="button"
          onClick={() => setIntelligenceBriefOpen((current) => !current)}
          className="flex w-full items-center justify-between px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300/90 transition hover:text-cyan-100"
          aria-expanded={intelligenceBriefOpen}
        >
          <span>{intelligenceBriefOpen ? "▾" : "▸"} Intelligence Brief</span>
          <span className="text-[10px] font-normal tracking-[0.18em] text-zinc-500">Cognition</span>
        </button>
        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${intelligenceBriefOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden px-3 pb-3">
            <CognitiveIntelligencePanel compact />
          </div>
        </div>
      </section>
    </div>
  );
}
