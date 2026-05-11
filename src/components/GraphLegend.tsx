import type { ReactNode } from "react";

type GraphLegendProps = {
  className?: string;
  compact?: boolean;
};

type LegendRowProps = {
  swatch?: ReactNode;
  label: string;
  description: string;
};

function LegendRow({ swatch, label, description }: LegendRowProps) {
  return (
    <li className="flex items-start gap-2 text-xs text-[#dce4e5]">
      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center">{swatch}</span>
      <p>
        <span className="font-semibold text-white">{label}:</span> {description}
      </p>
    </li>
  );
}

export function GraphLegend({ className = "", compact = false }: GraphLegendProps) {
  return (
    <details
      className={`rounded-lg border border-white/20 bg-[#0b1618]/95 text-[#dce4e5] shadow-lg backdrop-blur ${className}`}
      open={!compact}
    >
      <summary className="cursor-pointer list-none border-b border-white/10 px-3 py-2 text-sm font-semibold text-cyan-100">
        Graph Key · Visual Language
      </summary>
      <div className="space-y-3 px-3 py-3">
        <ul className="space-y-2">
          <LegendRow
            swatch={<span className="h-3 w-3 rounded-full bg-cyan-400" />}
            label="Blue / Cyan node"
            description="Normal, low-risk, or informational cluster."
          />
          <LegendRow
            swatch={<span className="h-3 w-3 rounded-full bg-amber-300" />}
            label="Yellow / Amber node"
            description="Medium-risk review signal."
          />
          <LegendRow
            swatch={<span className="h-3 w-3 rounded-full bg-rose-400" />}
            label="Red / Salmon node"
            description="High-risk or critical anomaly cluster requiring human review."
          />
          <LegendRow
            swatch={<span className="h-3 w-3 rounded-full bg-violet-400" />}
            label="Purple accent"
            description="AI/TDA relationship, semantic bridge, or derived intelligence layer."
          />
          <LegendRow swatch={<span className="h-3 w-3 rounded-full border border-white/80" />} label="Node size" description="Number of affected polling stations or cluster weight." />
          <LegendRow swatch={<span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(34,211,238,0.65)]" />} label="Node glow" description="Severity, urgency, or review priority." />
          <LegendRow swatch={<span className="h-[2px] w-4 rounded bg-cyan-200" />} label="Edge / line" description="Relationship between clusters based on geography, anomaly type, or feature similarity." />
          <LegendRow swatch={<span className="h-3 w-3 animate-pulse rounded-full bg-rose-300" />} label="Pulsing node" description="Recently updated or emerging anomaly pattern." />
          <LegendRow swatch={<span className="h-3 w-3 rounded-full border-2 border-cyan-100 ring-2 ring-cyan-300/60" />} label="Selected ring" description="Currently inspected cluster." />
          <LegendRow swatch={<span className="text-[10px]">⌕</span>} label="Hover tooltip" description="Quick cluster preview." />
          <LegendRow swatch={<span className="text-[10px]">▣</span>} label="Evidence panel" description="Full explanation and reviewer guidance." />
        </ul>

        <div className="rounded border border-white/15 bg-black/20 p-2 text-[11px]">
          <p className="font-semibold text-cyan-100">Topology modes</p>
          <ul className="mt-1 space-y-1">
            <li><span className="font-semibold text-white">Centralized:</span> strongest anomaly gravity center.</li>
            <li><span className="font-semibold text-white">Decentralized:</span> regional or anomaly-type hubs.</li>
            <li><span className="font-semibold text-white">Distributed:</span> peer-to-peer similarity mesh.</li>
          </ul>
        </div>

        <p className="text-[11px] text-amber-100">
          “Synthetic demo data. Not official election results. Flags indicate review signals, not proven malpractice.”
        </p>
      </div>
    </details>
  );
}
