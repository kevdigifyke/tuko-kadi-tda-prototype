"use client";
import { motion } from "framer-motion";

export function TelemetryPanel({ anomalyCount }: { anomalyCount: number }) {
  const cards = [
    ["Active stations monitored", "12,844"],
    ["Live anomaly count", `${anomalyCount}`],
    ["AI prediction load", "71%"],
    ["Propagation events", "236"],
    ["Network influence chains", "94"],
    ["Election system uptime", "99.982%"],
  ];
  return <section className="rounded-xl border border-amber-300/35 bg-black/35 p-4"><h3 className="mb-3 text-sm font-semibold text-amber-200">National Telemetry</h3>
  <div className="grid grid-cols-2 gap-2">{cards.map(([k, v], idx) => <motion.div key={k} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 4, delay: idx * 0.2 }} className="rounded border border-amber-400/25 bg-amber-500/5 p-2"><p className="text-[11px] text-zinc-400">{k}</p><p className="font-mono text-sm text-amber-100">{v}</p></motion.div>)}</div></section>;
}
