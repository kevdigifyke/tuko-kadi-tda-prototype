"use client";

import { motion } from "framer-motion";

const panels = [
  ["AI Risk Engine", "Monitoring national anomaly propagation patterns."],
  ["TDA Intelligence", "Persistent topology structures actively updating."],
  ["Simulation Engine", "Synthetic election scenario replay active."],
];

export default function CommandSidebar() {
  return (
    <div className="h-full space-y-3 rounded-2xl border border-white/10 bg-black/35 p-3 backdrop-blur-xl">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">National Intelligence</h2>
      {panels.map(([title, body], i) => (
        <motion.div key={title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="mt-2 text-xs text-zinc-300">{body}</p>
        </motion.div>
      ))}
    </div>
  );
}
