"use client";

import { useState } from "react";

import CognitiveIntelligencePanel from "./CognitiveIntelligencePanel";
import SignalIntelligencePanel from "./SignalIntelligencePanel";
import TransparencyLayerPanel from "../legitimacy/TransparencyLayerPanel";
import ResearchReadinessPanel from "../research/ResearchReadinessPanel";
import { StatusChip } from "../ui/StatusChip";

function CollapsibleCard({
  title,
  eyebrow,
  summary,
  status = "GREEN",
  defaultOpen = false,
  children,
}: {
  title: string;
  eyebrow: string;
  summary: string;
  status?: "GREEN" | "AMBER" | "RED" | "CRITICAL";
  defaultOpen?: boolean;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-xl border border-zinc-800/80 bg-zinc-950/62 p-3">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-start justify-between gap-3 text-left" aria-expanded={open}>
        <span>
          <span className="panel-kicker block text-cyan-300/85">{eyebrow}</span>
          <span className="mt-1 block text-sm font-semibold text-white">{title}</span>
        </span>
        <span className="text-xs text-cyan-200">{open ? "▾" : "▸"}</span>
      </button>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-xs leading-relaxed text-zinc-400">{summary}</p>
        <StatusChip status={status} />
      </div>
      <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="mt-3 border-t border-white/10 pt-3 text-xs text-zinc-400">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function CommandSidebar({ focusMode = false }: { focusMode?: boolean }) {
  const [intelligenceBriefOpen, setIntelligenceBriefOpen] = useState(false);

  return (
    <div className="h-full space-y-3 overflow-y-auto border-r border-cyan-950/60 bg-black/88 p-3 text-zinc-300">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400/90">Intelligence</h2>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">Collapsed by default to prioritize map visibility</p>
        </div>
      </div>

      <CollapsibleCard title="AI Risk Engine" eyebrow="Telemetry" summary="National anomaly propagation monitor." status="AMBER">
        Existing telemetry, anomaly, and propagation signals remain active; this panel only summarizes their operational state.
      </CollapsibleCard>

      <CollapsibleCard title="Observatory Intelligence" eyebrow="Map layer" summary="Topology structures and civic signal overlays." status="GREEN">
        Map-first hierarchy keeps geography visible while preserving access to semantic geo and civic intelligence summaries.
      </CollapsibleCard>

      <CollapsibleCard title="Simulation Engine" eyebrow="Replay" summary="Synthetic election scenario replay active." status="AMBER">
        Replay cognition, scenario playback, and telemetry evolution continue to use the existing simulation store.
      </CollapsibleCard>

      <TransparencyLayerPanel />

      <ResearchReadinessPanel />

      <section className="rounded-xl border border-cyan-950/70 bg-zinc-950/58 shadow-[0_0_22px_rgba(45,212,191,0.05)]">
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

      {!focusMode && <SignalIntelligencePanel />}
    </div>
  );
}
