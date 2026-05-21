"use client";
import { motion } from "framer-motion";

export function CommandHeader() {
  return <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-cyan-300/40 bg-black/35 p-4 backdrop-blur-md">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">Tuko Kadi Sovereign Operations</p>
        <h1 className="text-xl font-semibold text-cyan-50">National Election Command Center</h1>
      </div>
      <p className="font-mono text-xs text-zinc-300">Realtime Strategic Intelligence Grid</p>
    </div>
  </motion.header>;
}
