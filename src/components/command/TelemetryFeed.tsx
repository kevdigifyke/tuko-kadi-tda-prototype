"use client";

import { useRealtimeTelemetry } from "../../hooks/useRealtimeTelemetry";

export default function TelemetryFeed() {
  const events = useRealtimeTelemetry();

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3 bg-zinc-950 border-l border-zinc-800">
      <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
        Live Telemetry
      </h2>

      {events.map((event, index) => (
        <div
          key={index}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-3"
        >
          <div className="text-xs text-zinc-400">
            {new Date(event.timestamp).toLocaleTimeString()}
          </div>

          <div className="mt-1 text-sm font-semibold text-white">
            {event.county}
          </div>

          <div className="mt-1 text-xs text-red-400">
            Anomaly Risk: {Math.round(event.anomalyScore)}
          </div>
        </div>
      ))}
    </div>
  );
}