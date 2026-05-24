"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useObservatoryStore, type TelemetryEvent } from "../store/useObservatoryStore";

export function useRealtimeTelemetry() {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const ingestTelemetry = useObservatoryStore((s) => s.ingestTelemetry);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("telemetry", (event: TelemetryEvent) => {
      setEvents((prev) => [event, ...prev.slice(0, 40)]);
      ingestTelemetry(event);
    });

    return () => {
      socket.disconnect();
    };
  }, [ingestTelemetry]);

  return events;
}
