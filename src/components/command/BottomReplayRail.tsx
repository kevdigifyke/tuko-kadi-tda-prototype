"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useSimulationStore } from "@/src/store/useSimulationStore";

type ReplaySeverity = "INFO" | "WARNING" | "CRITICAL";

const severityTone: Record<ReplaySeverity, { rail: string; glow: string; text: string }> = {
  INFO: { rail: "bg-cyan-300", glow: "shadow-[0_0_14px_rgba(34,211,238,0.45)]", text: "text-cyan-200" },
  WARNING: { rail: "bg-amber-300", glow: "shadow-[0_0_14px_rgba(251,191,36,0.42)]", text: "text-amber-200" },
  CRITICAL: { rail: "bg-rose-400", glow: "shadow-[0_0_18px_rgba(244,63,94,0.55)]", text: "text-rose-200" },
};

const timestampForTick = (tick: number) => {
  const hour = 7 + Math.floor(tick / 10);
  const minute = String((tick * 5) % 60).padStart(2, "0");
  return `${String(hour).padStart(2, "0")}:${minute} EAT`;
};

export default function BottomReplayRail() {
  const tick = useSimulationStore((s) => s.tick);
  const setTick = useSimulationStore((s) => s.setTick);
  const telemetryEvents = useSimulationStore((s) => s.telemetryEvents);
  const focusedTelemetryId = useSimulationStore((s) => s.focusedTelemetryId);
  const setFocusedTelemetryId = useSimulationStore((s) => s.setFocusedTelemetryId);
  const setReplayFocus = useSimulationStore((s) => s.setReplayFocus);
  const replayFrames = useSimulationStore((s) => s.replayFrames);

  const events = useMemo(() => telemetryEvents.slice(0, 10), [telemetryEvents]);
  const activeEvent = events.find((event) => event.id === focusedTelemetryId) ?? events[0];
  const markers = useMemo(
    () => replayFrames.map((frame, idx) => ({
      tick: frame.tick,
      severity: frame.event.severity,
      id: `${frame.event.id}-${frame.tick}`,
      title: frame.event.title,
      category: frame.event.category,
      isPropagation: idx % 3 === 0 || frame.event.aiRiskScore >= 70,
    })).slice(0, 22),
    [replayFrames],
  );
  const progress = Math.min(100, Math.max(0, (tick / 120) * 100));

  return (
    <div className="h-32 border-t border-cyan-950/70 bg-[radial-gradient(circle_at_50%_0%,rgba(8,145,178,0.16),rgba(0,0,0,0.96)_52%)] px-6 py-3">
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="text-cyan-300/90">Replay Cognition Rail</span>
          <span className="rounded-full border border-cyan-500/25 bg-cyan-400/5 px-2 py-0.5 text-cyan-200/75">Propagation + anomaly bookmarks</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span>{timestampForTick(tick)}</span>
          <span className="text-cyan-200">T+{tick}</span>
        </div>
      </div>

      <div className="relative h-9 rounded-full border border-cyan-500/15 bg-zinc-950/85 px-3 shadow-[inset_0_0_24px_rgba(8,145,178,0.16)]">
        <div className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-cyan-900/70" />
        <motion.div className="absolute left-3 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-rose-300" animate={{ width: `calc(${progress}% - 1.5rem)` }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }} />
        <input
          aria-label="Tactical replay timeline"
          type="range"
          min="0"
          max="120"
          value={tick}
          onChange={(e) => setTick(Number(e.target.value))}
          className="tactical-replay-range absolute inset-x-3 top-0 h-9 cursor-pointer opacity-0"
        />
        {markers.map((marker) => {
          const tone = severityTone[marker.severity];
          return (
            <button
              key={marker.id}
              type="button"
              title={`${marker.title} · ${timestampForTick(marker.tick)}`}
              onClick={() => setTick(marker.tick)}
              className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/60 ${tone.rail} ${tone.glow} ${marker.isPropagation ? "h-5 w-1.5" : "h-3 w-1"}`}
              style={{ left: `${(marker.tick / 120) * 100}%` }}
            >
              <span className="sr-only">Jump to {marker.category} at T+{marker.tick}</span>
            </button>
          );
        })}
        <motion.div
          className="pointer-events-none absolute top-1/2 z-20 h-7 w-7 -translate-y-1/2 rounded-full border border-cyan-200/70 bg-cyan-300/15 shadow-[0_0_28px_rgba(34,211,238,0.5)]"
          animate={{ left: `calc(${progress}% - 0.875rem)`, scale: [1, 1.08, 1] }}
          transition={{ left: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }, scale: { duration: 1.6, repeat: Infinity } }}
        >
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200" />
        </motion.div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="flex gap-2 overflow-hidden">
          {events.map((event, idx) => {
            const isFocused = activeEvent?.id === event.id;
            const tone = severityTone[event.severity];
            return (
              <motion.button
                key={event.id}
                type="button"
                onClick={() => {
                  setFocusedTelemetryId(event.id);
                  const jumpTick = Math.min(120, Math.floor((Date.now() - event.timestamp) / 1000) + 35);
                  setTick(jumpTick);
                  setReplayFocus({ clusterKey: `${event.county}:${event.category}`.toLowerCase(), source: "rail", lastJumpAt: Date.now() });
                }}
                className={`group h-5 rounded-full border px-2 text-[9px] uppercase tracking-[0.14em] transition-all ${isFocused ? "border-cyan-200/70 bg-cyan-400/15 text-cyan-100" : "border-zinc-700/70 bg-zinc-950/60 text-zinc-500 hover:border-cyan-500/40 hover:text-cyan-200"}`}
                animate={isFocused ? { boxShadow: ["0 0 0 rgba(34,211,238,0)", "0 0 18px rgba(34,211,238,0.28)", "0 0 0 rgba(34,211,238,0)"] } : {}}
                transition={{ duration: 1.4, repeat: Infinity, delay: idx * 0.04 }}
              >
                <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${tone.rail}`} />{event.county}
              </motion.button>
            );
          })}
        </div>
        {activeEvent && (
          <div className="max-w-[360px] truncate text-right text-[10px] uppercase tracking-[0.14em] text-zinc-400">
            Active anomaly: <span className={severityTone[activeEvent.severity].text}>{activeEvent.title}</span>
          </div>
        )}
      </div>
    </div>
  );
}
