"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRealtimeTelemetry } from "../../hooks/useRealtimeTelemetry";
import { useObservatoryStore } from "../../store/useObservatoryStore";

type Severity = "critical" | "high" | "moderate" | "low";

const severityStyles: Record<Severity, string> = {
  critical: "border-rose-400/50 bg-rose-500/15 text-rose-200",
  high: "border-orange-300/40 bg-orange-500/15 text-orange-200",
  moderate: "border-amber-300/40 bg-amber-400/15 text-amber-100",
  low: "border-cyan-300/30 bg-cyan-400/15 text-cyan-100",
};

const severityOf = (score: number): Severity => {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 45) return "moderate";
  return "low";
};

export default function TelemetryFeed() {
  const events = useRealtimeTelemetry();
  const liveCount = useObservatoryStore((s) => s.liveEventCount);

  return (
    <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Live Telemetry</h2>
        <span className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-2 py-0.5 text-[10px] text-cyan-100">{liveCount} events</span>
      </div>

      <div className="h-[calc(100%-52px)] space-y-3 overflow-y-auto p-3">
        <AnimatePresence>
          {events.map((event, index) => {
            const severity = severityOf(event.anomalyScore ?? 0);
            return (
              <motion.div
                key={`${event.timestamp}-${index}`}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.28 }}
                className={`rounded-xl border p-3 shadow-lg ${severityStyles[severity]}`}
              >
                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <span className="uppercase tracking-widest">{severity}</span>
                  <span className="text-white/70">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{event.county}</p>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                </div>
                <p className="mt-1 text-xs">Anomaly risk {Math.round(event.anomalyScore ?? 0)}% · turnout {Math.round(event.turnout ?? 0)}%</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
