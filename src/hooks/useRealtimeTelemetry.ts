"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

import { type TelemetryEvent, useObservatoryStore } from "../store/useObservatoryStore";

const counties = ["Nairobi", "Kisumu", "Mandera", "Nakuru", "Mombasa", "Uasin Gishu", "Turkana"];
const messages = [
  { category: "Turnout", message: "Turnout spike detected" },
  { category: "Propagation", message: "Propagation anomaly detected" },
  { category: "Escalation", message: "AI escalation triggered" },
  { category: "Sync", message: "Cluster synchronization shift" },
] as const;

const severities: TelemetryEvent["severity"][] = ["INFO", "WARNING", "CRITICAL"];

export function useRealtimeTelemetry() {
  const replayTick = useObservatoryStore((s) => s.replayTick);
  const addTelemetryEvent = useObservatoryStore((s) => s.addTelemetryEvent);
  const clearOldEvents = useObservatoryStore((s) => s.clearOldEvents);

  useEffect(() => {
    const socket = io("http://localhost:4000", { autoConnect: true });
    socket.on("telemetry", (event: { county?: string; anomalyScore?: number; timestamp?: number }) => {
      const sev = (event.anomalyScore ?? 0) > 80 ? "CRITICAL" : (event.anomalyScore ?? 0) > 55 ? "WARNING" : "INFO";
      addTelemetryEvent({
        county: event.county ?? counties[Math.floor(Math.random() * counties.length)],
        message: `Live feed anomaly risk ${(event.anomalyScore ?? 0).toFixed(1)} registered`,
        severity: sev,
        category: "Propagation",
        timestamp: event.timestamp ?? Date.now(),
        replayTick,
      });
    });

    return () => socket.disconnect();
  }, [addTelemetryEvent, replayTick]);

  useEffect(() => {
    const timer = setInterval(() => {
      const county = counties[Math.floor(Math.random() * counties.length)];
      const template = messages[Math.floor(Math.random() * messages.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      addTelemetryEvent({
        county,
        message: `${template.message} — ${county}`,
        severity,
        category: template.category,
        timestamp: Date.now(),
        replayTick,
      });
      clearOldEvents();
    }, 2600);

    return () => clearInterval(timer);
  }, [addTelemetryEvent, clearOldEvents, replayTick]);

  return useObservatoryStore((s) => s.telemetryEvents);
}
