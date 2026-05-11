"use client";

import { useState } from "react";

interface GraphLegendProps {
  className?: string;
  defaultOpen?: boolean;
}

const LEGEND_ITEMS = [
  { label: "Blue / Cyan node", meaning: "Normal, low-risk, or informational cluster.", swatch: "cyan" },
  { label: "Yellow / Amber node", meaning: "Medium-risk review signal.", swatch: "amber" },
  { label: "Red / Salmon node", meaning: "High-risk or critical anomaly cluster requiring human review.", swatch: "red" },
  { label: "Purple accent", meaning: "AI/TDA relationship, semantic bridge, or derived intelligence layer.", swatch: "purple" },
  { label: "Node size", meaning: "Number of affected polling stations or cluster weight.", swatch: "size" },
  { label: "Node glow", meaning: "Severity, urgency, or review priority.", swatch: "glow" },
  { label: "Edge / line", meaning: "Relationship between clusters based on geography, anomaly type, or feature similarity.", swatch: "edge" },
  { label: "Pulsing node", meaning: "Recently updated or emerging anomaly pattern.", swatch: "pulse" },
  { label: "Selected ring", meaning: "Currently inspected cluster.", swatch: "selected" },
  { label: "Hover tooltip", meaning: "Quick cluster preview.", swatch: "hover" },
  { label: "Evidence panel", meaning: "Full explanation and reviewer guidance.", swatch: "panel" },
] as const;

function Swatch({ type }: { type: (typeof LEGEND_ITEMS)[number]["swatch"] }) {
  switch (type) {
    case "cyan":
      return <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.7)]" />;
    case "amber":
      return <span className="h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(255,210,110,0.6)]" />;
    case "red":
      return <span className="h-3 w-3 rounded-full bg-[#ff9c94] shadow-[0_0_10px_rgba(255,120,104,0.7)]" />;
    case "purple":
      return <span className="h-3 w-3 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(137,93,255,0.75)]" />;
    case "size":
      return (
        <span className="relative flex h-3 w-5 items-center justify-center">
          <span className="absolute left-0 h-1.5 w-1.5 rounded-full bg-cyan-200" />
          <span className="absolute right-0 h-3 w-3 rounded-full bg-cyan-300/90" />
        </span>
      );
    case "glow":
      return <span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_0_4px_rgba(125,239,255,0.25),0_0_14px_rgba(125,239,255,0.65)]" />;
    case "edge":
      return <span className="h-[2px] w-5 rounded bg-cyan-200/70" />;
    case "pulse":
      return <span className="h-3 w-3 animate-pulse rounded-full bg-[#ffb4ab] shadow-[0_0_10px_rgba(255,120,104,0.8)]" />;
    case "selected":
      return <span className="h-3 w-3 rounded-full border border-[#ffb4ab] ring-2 ring-[#ffb4ab]/50" />;
    case "hover":
      return <span className="h-3 w-3 rounded border border-cyan-200/85" />;
    case "panel":
      return <span className="h-3 w-4 rounded-sm border border-white/30 bg-[#1d2728]" />;
    default:
      return null;
  }
}

export function GraphLegend({ className = "", defaultOpen = false }: GraphLegendProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`pointer-events-auto ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="inline-flex items-center gap-2 rounded-md border border-cyan-300/35 bg-[#101a1c]/95 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-[#162327]"
        aria-expanded={open}
        aria-controls="graph-legend-panel"
      >
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-cyan-200/70 text-[10px]">?</span>
        Graph Key
      </button>

      {open && (
        <div id="graph-legend-panel" className="mt-2 w-[min(92vw,340px)] rounded-lg border border-white/15 bg-[#111a1c]/95 p-3 text-[11px] text-[#c7d4d7] shadow-2xl backdrop-blur">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-200">Graph Intelligence Legend</p>
          <ul className="space-y-1.5">
            {LEGEND_ITEMS.map((item) => (
              <li key={item.label} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-5 shrink-0 items-center justify-center"><Swatch type={item.swatch} /></span>
                <p><span className="font-semibold text-[#e4edef]">{item.label}:</span> {item.meaning}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded border border-amber-300/30 bg-amber-200/10 px-2 py-1.5 text-[10px] text-amber-100">
            Synthetic demo data. Not official election results. Flags indicate review signals, not proven malpractice.
          </p>
        </div>
      )}
    </div>
  );
}
