"use client";

import { useState } from "react";

import { syntheticDataSummary } from "@/src/lib/legitimacy/syntheticDataDocumentation";
import { civicSafeguards } from "@/src/lib/legitimacy/civicSafeguards";

const statusRows = [
  { label: "Simulation Status", value: syntheticDataSummary.status, tone: "text-emerald-200" },
  { label: "Synthetic Data Indicator", value: syntheticDataSummary.indicator, tone: "text-cyan-200" },
  { label: "Confidence Level", value: `Confidence: ${syntheticDataSummary.confidenceLevel}`, tone: "text-amber-200" },
  { label: "Data Provenance", value: `Source: ${syntheticDataSummary.provenance}`, tone: "text-fuchsia-200" },
  { label: "Operational Scope", value: syntheticDataSummary.operationalScope, tone: "text-zinc-200" },
];

export default function TransparencyLayerPanel() {
  const [expanded, setExpanded] = useState(false);
  const primaryWarnings = civicSafeguards.flatMap((section) => section.notices).slice(0, 3);

  return (
    <section className="rounded-xl border border-cyan-500/25 bg-zinc-950/62 p-3 opacity-95 shadow-[0_0_24px_rgba(34,211,238,0.07)]">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={expanded}
        aria-controls="transparency-layer-details"
      >
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300/90">
            Transparency Layer
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-emerald-300/80">
            {syntheticDataSummary.status}
          </span>
        </span>
        <span className="rounded-full border border-cyan-500/35 bg-cyan-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-100">
          {expanded ? "Collapse" : "Expand"}
        </span>
      </button>

      <div className="mt-3 grid gap-2 text-[10px] uppercase tracking-wider">
        {statusRows.slice(0, expanded ? statusRows.length : 3).map((row) => (
          <div key={row.label} className="rounded border border-zinc-800/80 bg-black/35 px-2 py-1.5">
            <div className="text-[9px] text-zinc-500">{row.label}</div>
            <div className={`mt-0.5 normal-case tracking-normal ${row.tone}`}>{row.value}</div>
          </div>
        ))}
      </div>

      {expanded && (
        <div id="transparency-layer-details" className="mt-3 space-y-2 border-t border-cyan-950/80 pt-3">
          <p className="text-[11px] leading-relaxed text-zinc-400">
            Research display only. Outputs identify hypotheses and interface states, not verified electoral facts.
          </p>
          <div className="space-y-1">
            {primaryWarnings.map((warning) => (
              <div key={warning} className="rounded border border-amber-500/20 bg-amber-500/5 px-2 py-1 text-[10px] leading-relaxed text-amber-100/90">
                {warning}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
