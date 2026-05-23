"use client";

import { useSimulationStore } from "@/src/store/useSimulationStore";

export function SimulationReplayLayer() {
  const { timeline } = useSimulationStore();

  return (
    <div className="relative rounded-xl border border-white/15 bg-[#060a10] p-3 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,229,255,.12),transparent_35%),radial-gradient(circle_at_80%_50%,rgba(124,77,255,.14),transparent_45%)]" />
      <h3 className="relative text-cyan-200 font-semibold">Live Synthetic Replay Layer ({timeline.timeLabel})</h3>
      <div className="relative mt-3 grid grid-cols-8 gap-1">
        {timeline.stations.map((s) => (
          <div key={s.id} className="h-7 rounded-sm" style={{
            background: s.isActive
              ? `rgba(${Math.round(255 * s.simulatedAnomalyScore)},${Math.round(220 - 130 * s.simulatedAnomalyScore)},255,0.8)`
              : "rgba(255,255,255,0.08)",
            boxShadow: s.isActive ? `0 0 ${6 + s.pulse * 10}px rgba(0,229,255,0.4)` : "none",
          }} title={`${s.id} • modeled turnout ${s.turnoutPercent}%`} />
        ))}
      </div>
      <p className="relative mt-2 text-xs text-[#bac9cc]">Animated proxy for pulse markers, heatmap evolution, simulated risk cluster growth, graph topology stress, and estimated propagation flow.</p>
    </div>
  );
}
