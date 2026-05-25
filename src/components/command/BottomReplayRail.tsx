"use client";

import { motion } from "framer-motion";
import { useSimulationStore } from "@/src/store/useSimulationStore";

export default function BottomReplayRail() {
  const tick = useSimulationStore((s) => s.tick);
  const setTick = useSimulationStore((s) => s.setTick);
  const events = useSimulationStore((s) => s.telemetryEvents.slice(0, 6));

  return (
    <div className="h-24 border-t border-zinc-800 bg-black px-6 py-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3 flex justify-between"><span>Election Replay Timeline</span><span className="text-cyan-300">T+{tick}</span></div>
      <div className="relative">
        <input type="range" min="0" max="120" value={tick} onChange={(e) => setTick(Number(e.target.value))} className="w-full" />
        <motion.div className="pointer-events-none absolute -top-1 h-5 w-5 rounded-full border border-cyan-400/50 bg-cyan-400/20" animate={{ left: `${(tick / 120) * 100}%`, boxShadow: ["0 0 0 rgba(34,211,238,0.1)", "0 0 14px rgba(34,211,238,0.35)", "0 0 0 rgba(34,211,238,0.1)"] }} transition={{ duration: 1.2, repeat: Infinity }} />
      </div>
      <div className="mt-1 flex gap-2 overflow-hidden">{events.map((event, idx) => <span key={event.id} className={`h-1.5 rounded-full ${idx === 0 ? "bg-cyan-300 w-10" : "bg-zinc-600 w-6"}`} />)}</div>
    </div>
  );
}
