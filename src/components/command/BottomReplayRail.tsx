"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useSimulationStore } from "@/src/store/useSimulationStore";

export default function BottomReplayRail() {
  const tick = useSimulationStore((s) => s.tick);
  const setTick = useSimulationStore((s) => s.setTick);
  const telemetryEvents = useSimulationStore((s) => s.telemetryEvents);
  const focusedTelemetryId = useSimulationStore((s) => s.focusedTelemetryId);
  const setFocusedTelemetryId = useSimulationStore((s) => s.setFocusedTelemetryId);
  const setReplayFocus = useSimulationStore((s) => s.setReplayFocus);
  const replayFrames = useSimulationStore((s) => s.replayFrames);

  const events = useMemo(() => telemetryEvents.slice(0, 10), [telemetryEvents]);
  const severityBar = (severity: "INFO" | "WARNING" | "CRITICAL") => severity === "CRITICAL" ? "bg-rose-400" : severity === "WARNING" ? "bg-amber-300" : "bg-cyan-300";
  const activeEvent = events.find((event) => event.id === focusedTelemetryId) ?? events[0];
  const markers = useMemo(() => replayFrames.map((f) => ({ tick: f.tick, severity: f.event.severity, id: f.event.id })).slice(0, 18), [replayFrames]);

  return (
    <div className="h-28 border-t border-zinc-800 bg-black px-6 py-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3 flex justify-between"><span>Election Replay Timeline</span><span className="text-cyan-300">T+{tick}</span></div>
      <div className="relative">
        <input type="range" min="0" max="120" value={tick} onChange={(e) => setTick(Number(e.target.value))} className="w-full" />
        <div className="pointer-events-none absolute -top-2 left-0 h-6 w-full">
          {markers.map((marker) => (
            <div key={marker.id} className={`absolute h-2 w-1 rounded-full opacity-75 ${severityBar(marker.severity)}`} style={{ left: `${(marker.tick / 120) * 100}%` }} />
          ))}
        </div>
        <motion.div className="pointer-events-none absolute -top-1 h-5 w-5 rounded-full border border-cyan-400/50 bg-cyan-400/20" animate={{ left: `${(tick / 120) * 100}%`, boxShadow: ["0 0 0 rgba(34,211,238,0.1)", "0 0 14px rgba(34,211,238,0.35)", "0 0 0 rgba(34,211,238,0.1)"] }} transition={{ duration: 1.2, repeat: Infinity }} />
      </div>
      <div className="mt-1 flex gap-2 overflow-hidden">
        {events.map((event, idx) => {
          const isFocused = activeEvent?.id === event.id;
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
              className={`h-1.5 rounded-full ${severityBar(event.severity)} ${idx === 0 ? "w-10" : "w-6"} ${isFocused ? "ring-1 ring-cyan-300/60" : ""}`}
              animate={isFocused ? { opacity: [0.45, 1, 0.45], scaleY: [1, 1.7, 1], boxShadow: ["0 0 0 rgba(244,63,94,0)", "0 0 8px rgba(244,63,94,0.45)", "0 0 0 rgba(244,63,94,0)"] } : { opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          );
        })}
      </div>
      {activeEvent && <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-zinc-400">Active anomaly: <span className="text-cyan-200">{activeEvent.title}</span> · <span className="text-fuchsia-300">Temporal cluster engaged</span></div>}
    </div>
  );
}
