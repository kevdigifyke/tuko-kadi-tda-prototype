"use client";

import { useMemo, useState } from "react";

import { safeguardsSummary } from "@/src/lib/legitimacy/civicSafeguards";
import { ethicsFramework, ethicsSummary } from "@/src/lib/legitimacy/ethicsFramework";
import { methodologySummary, simulationMethodology } from "@/src/lib/legitimacy/simulationMethodology";
import { syntheticDataDocumentation, syntheticDataSummary } from "@/src/lib/legitimacy/syntheticDataDocumentation";

const compactList = (items: string[]) => items.slice(0, 2).join(" · ");

export default function ResearchReadinessPanel() {
  const [expanded, setExpanded] = useState(false);

  const summaries = useMemo(() => [
    {
      label: "Methodology",
      value: methodologySummary,
      detail: simulationMethodology.map((model) => `${model.modelFamily}: ${compactList(model.outputs)}`),
      tone: "border-cyan-500/25 bg-cyan-500/5 text-cyan-100",
    },
    {
      label: "Ethics",
      value: ethicsSummary,
      detail: ethicsFramework.slice(0, 3).map((section) => `${section.title}: ${compactList(section.commitments)}`),
      tone: "border-emerald-500/25 bg-emerald-500/5 text-emerald-100",
    },
    {
      label: "Transparency",
      value: `${syntheticDataSummary.status}; ${syntheticDataSummary.indicator}; Source: ${syntheticDataSummary.provenance}.`,
      detail: syntheticDataDocumentation.slice(0, 3).map((section) => `${section.title}: ${section.description}`),
      tone: "border-fuchsia-500/25 bg-fuchsia-500/5 text-fuchsia-100",
    },
    {
      label: "Safeguards",
      value: safeguardsSummary,
      detail: [
        "Misuse prevention notices are documented for non-publication, non-targeting, and export restraint.",
        "Interpretation warnings distinguish hypotheses, visual intensity, and prototype indicators from evidence.",
        "Operational disclaimers require verification, legal review, and human authorization before real-world use.",
      ],
      tone: "border-amber-500/25 bg-amber-500/5 text-amber-100",
    },
  ], []);

  return (
    <section className="rounded-xl border border-purple-500/20 bg-zinc-950/58 p-3 opacity-95 shadow-[0_0_22px_rgba(168,85,247,0.05)]">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={expanded}
        aria-controls="research-readiness-details"
      >
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-purple-300/90">
            Research Readiness
          </span>
          <span className="mt-1 block text-[10px] text-zinc-500">
            Academic publication · conference demonstrations · research mode
          </span>
        </span>
        <span className="rounded-full border border-purple-500/35 bg-purple-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-purple-100">
          {expanded ? "Collapse" : "Expand"}
        </span>
      </button>

      <div id="research-readiness-details" className="mt-3 space-y-2">
        {summaries.slice(0, expanded ? summaries.length : 2).map((summary) => (
          <article key={summary.label} className={`rounded border p-2 ${summary.tone}`}>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.16em]">{summary.label} Summary</h4>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{summary.value}</p>
            {expanded && (
              <ul className="mt-2 space-y-1 border-t border-white/10 pt-2 text-[10px] leading-relaxed text-zinc-400">
                {summary.detail.map((detail) => (
                  <li key={detail}>• {detail}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
