"use client";

import { useEffect } from "react";
import { useSimulationStore } from "@/src/store/useSimulationStore";

export function SimulationEngineRuntime() {
  const { isRunning, speed, advance } = useSimulationStore();

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => advance(), Math.max(250, 1000 - speed * 120));
    return () => clearInterval(interval);
  }, [isRunning, speed, advance]);

  return null;
}
