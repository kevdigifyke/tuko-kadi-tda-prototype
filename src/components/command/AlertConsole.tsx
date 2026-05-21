"use client";
import type { LiveIntelligenceEvent } from "@/src/lib/intelligence/liveIntelligenceFeed";

export function AlertConsole({ events }: { events: LiveIntelligenceEvent[] }) {
  return <section className="rounded-xl border border-red-400/40 bg-black/45 p-4">
    <h3 className="mb-2 text-sm font-semibold text-red-300">Operational Alert Console</h3>
    <div className="max-h-52 space-y-1 overflow-auto font-mono text-xs">{events.slice(-12).reverse().map((e) => <p key={e.id} className="text-red-100"><span className="text-red-400">[{e.priority}]</span> {e.county}: {e.type}</p>)}</div>
  </section>;
}
