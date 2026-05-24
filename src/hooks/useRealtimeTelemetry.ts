"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useRealtimeTelemetry() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("telemetry", (event) => {
      setEvents((prev) => [event, ...prev.slice(0, 20)]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return events;
}