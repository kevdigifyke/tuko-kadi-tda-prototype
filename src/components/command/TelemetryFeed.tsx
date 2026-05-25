"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useRealtimeTelemetry } from "../../hooks/useRealtimeTelemetry";
import { useSimulationStore } from "@/src/store/useSimulationStore";
import { pollingStations } from "@/src/data/geo/pollingStations";

const severityStyles = {
  INFO: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
  WARNING: "text-amber-300 border-amber-500/40 bg-amber-500/10",
  CRITICAL: "text-rose-300 border-rose-500/50 bg-rose-500/10 shadow-[0_0_24px_rgba(244,63,94,0.28)]",
} as const;

export default function TelemetryFeed() {
  const events = useRealtimeTelemetry();
  const liveEventCount = useSimulationStore((state) => state.liveEventCount);
  const activeAlerts = useSimulationStore((state) => state.activeAlerts);
  const dismissAlert = useSimulationStore((state) => state.dismissAlert);
  const anomalyLevel = useSimulationStore((state) => state.anomalyLevel);
  const setActiveRegion = useSimulationStore((state) => state.setActiveRegion);
  const setTick = useSimulationStore((state) => state.setTick);
  const setFocusedTelemetryId = useSimulationStore((state) => state.setFocusedTelemetryId);
  const setReplayFocus = useSimulationStore((state) => state.setReplayFocus);
  const focusedTelemetryId = useSimulationStore((state) => state.focusedTelemetryId);
  const replayFrameAtTick = useSimulationStore((state) => state.getReplayFrameAtTick(state.tick));
  const streamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    streamRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [events.length]);

  useEffect(() => {
    if (!activeAlerts.length) return;
    const timers = activeAlerts.map((alert) => setTimeout(() => dismissAlert(alert.id), 2200));
    return () => timers.forEach(clearTimeout);
  }, [activeAlerts, dismissAlert]);

  const isEscalated = useMemo(() => activeAlerts.length > 0, [activeAlerts.length]);

  return (
    <motion.div className="relative h-full overflow-hidden p-4 bg-zinc-950 border-l border-zinc-800" animate={isEscalated ? { boxShadow: ["inset 0 0 0 rgba(244,63,94,0)", "inset 0 0 24px rgba(244,63,94,0.24)", "inset 0 0 0 rgba(244,63,94,0)"] } : {}} transition={{ duration: 1.3 }}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Live Telemetry</h2>
        <motion.div key={liveEventCount} initial={{ scale: 0.8, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">{liveEventCount} events · L{anomalyLevel}</motion.div>
      </div>
      {replayFrameAtTick && <div className="mb-2 rounded border border-fuchsia-500/35 bg-fuchsia-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-fuchsia-200">Replay focus cue · {replayFrameAtTick.event.title} · T+{replayFrameAtTick.tick}</div>}
      <AnimatePresence>{activeAlerts[0] && <motion.div key={activeAlerts[0].id} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} className="mb-3 rounded-lg border border-rose-400/50 bg-rose-500/15 p-2 text-xs text-rose-100">CRITICAL ALERT · {activeAlerts[0].title} — {activeAlerts[0].county}</motion.div>}</AnimatePresence>
      <div ref={streamRef} className="h-[calc(100%-4rem)] overflow-y-auto pr-1 space-y-2 telemetry-shimmer">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.button
              type="button"
              key={event.id}
              onClick={() => {
                const station = pollingStations.find((s) => s.county === event.county || s.constituency === event.constituency || s.ward === event.ward);
                const layer = event.ward ? "ward" : event.constituency ? "constituency" : "county";
                const name = layer === "ward" ? event.ward : layer === "constituency" ? event.constituency : event.county;
                setActiveRegion({ id: `${layer}:${name}`.toLowerCase(), name, layer, center: station ? [station.lat, station.lng] : [-0.0236, 37.9062], severity: event.intelligenceSeverity, flashToken: Date.now() });
                setTick(Math.min(120, Math.floor((Date.now() - event.timestamp) / 1000) + 35));
                setFocusedTelemetryId(event.id);
                setReplayFocus({ clusterKey: `${event.county}:${event.category}`.toLowerCase(), source: "telemetry", lastJumpAt: Date.now() });
              }}
              layout initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.32, ease: "easeOut" }}
              className={`w-full text-left rounded-xl border p-3 backdrop-blur-sm transition-all hover:border-cyan-400/60 hover:shadow-[0_0_22px_rgba(34,211,238,0.22)] ${focusedTelemetryId === event.id ? "ring-1 ring-cyan-300/65" : ""} ${severityStyles[event.severity]}`}
            >
              <div className="flex items-center justify-between gap-2"><div className="text-[11px] text-zinc-300">{new Date(event.timestamp).toLocaleTimeString()}</div><motion.div className="flex items-center gap-1 text-[10px] font-semibold" animate={event.severity === "CRITICAL" ? { opacity: [1, 0.45, 1] } : {}} transition={{ repeat: Infinity, duration: 1.2 }}><motion.span className="h-2 w-2 rounded-full bg-current" animate={{ scale: [1, 1.6, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />{event.severity}</motion.div></div>
              <div className="mt-1 text-sm font-semibold text-white">{event.title}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wide"><span className="rounded border border-zinc-600 px-2 py-0.5 text-zinc-200">{event.category}</span><span className="rounded border border-zinc-600 px-2 py-0.5 text-zinc-200">{event.county}</span><span className="rounded border border-zinc-600 px-2 py-0.5 text-zinc-300">{event.status}</span><span className="rounded border border-cyan-700/40 bg-cyan-400/10 px-2 py-0.5 text-cyan-200">SYNC</span></div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
