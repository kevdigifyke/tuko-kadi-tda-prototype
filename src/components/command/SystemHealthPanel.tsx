"use client";
import type { SystemHealthSnapshot } from "@/src/lib/system/systemHealthEngine";

export function SystemHealthPanel({ health }: { health: SystemHealthSnapshot }) {
  const items = Object.entries(health).filter(([key]) => key !== "overall");
  return <section className="rounded-xl border border-emerald-300/30 bg-black/35 p-4">
    <h3 className="mb-2 text-sm font-semibold text-emerald-200">System Health: {health.overall}</h3>
    <div className="grid grid-cols-2 gap-2 text-xs">{items.map(([k, v]) => <div key={k} className="rounded border border-emerald-400/20 bg-emerald-500/5 p-2"><p className="text-zinc-400">{k}</p><p className="font-mono text-emerald-100">{v}%</p></div>)}</div>
  </section>;
}
