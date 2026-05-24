"use client";

import { AlertTriangle, Info, Siren, Waves } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useRealtimeTelemetry } from "../../hooks/useRealtimeTelemetry";
import { useObservatoryStore } from "../../store/useObservatoryStore";

export default function TelemetryFeed() {
  useRealtimeTelemetry();
  const events = useObservatoryStore((s) => s.telemetryEvents);
  const mode = useObservatoryStore((s) => s.mode);
  const filtered = events.filter((e) => (mode === "Anomalies" ? e.severity !== "INFO" : true));

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3 bg-zinc-950 border-l border-zinc-800">
      <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Live Telemetry · {filtered.length}</h2>
      <AnimatePresence initial={false}>
        {filtered.map((event) => (
          <motion.div key={event.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
              <span className={`px-2 py-0.5 rounded ${event.severity === "CRITICAL" ? "bg-red-500/20 text-red-300" : event.severity === "WARNING" ? "bg-amber-500/20 text-amber-300" : "bg-cyan-500/20 text-cyan-300"}`}>{event.category}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-white">
              {event.severity === "CRITICAL" ? <Siren className="size-4 text-red-400" /> : event.severity === "WARNING" ? <AlertTriangle className="size-4 text-amber-300" /> : <Info className="size-4 text-cyan-300" />}
              <span className="font-medium">{event.message}</span>
            </div>
            <div className="mt-1 text-xs text-zinc-400">{event.county}</div>
            <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity }} className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-wider text-cyan-300"><Waves className="size-3" /> Live stream</motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
