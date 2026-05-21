"use client";
import type { LiveIntelligenceEvent } from "@/src/lib/intelligence/liveIntelligenceFeed";

export function IntelligenceFeed({ events }: { events: LiveIntelligenceEvent[] }) {
  return <section className="rounded-xl border border-cyan-300/30 bg-black/35 p-4">
    <h3 className="mb-3 text-sm font-semibold text-cyan-200">Live Intelligence Stream</h3>
    <div className="space-y-2 text-xs">{events.slice(-8).reverse().map((event) => <div key={event.id} className="rounded border border-cyan-400/20 bg-cyan-500/5 p-2">
      <p className="font-mono text-zinc-400">{new Date(event.timestamp).toLocaleTimeString()} · {event.county} · {event.priority}</p>
      <p className="text-zinc-100">{event.detail}</p>
    </div>)}</div>
  </section>;
}
