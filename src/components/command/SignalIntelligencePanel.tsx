"use client";

import { useMemo } from "react";

import { buildGeospatialCivicSignals } from "@/src/lib/geospatialCivicSignals";
import { useSimulationStore } from "@/src/store/useSimulationStore";

const tone = (value: number, inverse = false) => {
  const adjusted = inverse ? 100 - value : value;
  if (adjusted >= 72) return "border-rose-500/40 bg-rose-500/10 text-rose-100";
  if (adjusted >= 52) return "border-amber-500/40 bg-amber-500/10 text-amber-100";
  return "border-cyan-500/35 bg-cyan-500/10 text-cyan-100";
};

export default function SignalIntelligencePanel() {
  const tick = useSimulationStore((state) => state.tick);
  const telemetry = useSimulationStore((state) => state.telemetryEvents);
  const civicSignals = useMemo(() => buildGeospatialCivicSignals({ tick, telemetry }), [telemetry, tick]);
  const { summary } = civicSignals;

  const metrics = [
    { label: "Environmental", value: summary.environmentalPressure },
    { label: "Mobility", value: summary.mobilityPressure },
    { label: "Accessibility", value: summary.accessibilityScore, inverse: true },
    { label: "Congestion", value: summary.congestionScore },
    { label: "Turnout", value: summary.turnoutPressure },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-zinc-950/58 p-3 opacity-90 shadow-[0_0_22px_rgba(16,185,129,0.05)]">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300/90">Signal Intelligence</h3>
        <p className="mt-1 text-[10px] text-zinc-500">Simulation-first civic context; no live APIs connected.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider">
        {metrics.map((metric) => (
          <div key={metric.label} className={`rounded border px-2 py-1 ${tone(metric.value, metric.inverse)}`}>
            <div className="text-[9px] text-zinc-400">{metric.label}</div>
            <div className="text-sm font-semibold">{metric.value}%</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2 text-[11px] text-zinc-300">
        {summary.narrative}
      </div>

      <div className="space-y-1">
        {civicSignals.bottlenecks.map((station) => (
          <div key={station.id} className="flex items-center justify-between rounded border border-zinc-800/80 bg-black/35 px-2 py-1 text-[10px]">
            <span className="truncate text-zinc-300">{station.county}</span>
            <span className="text-amber-200">Stress {station.operationalStress}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
