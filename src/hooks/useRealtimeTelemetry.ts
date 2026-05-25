"use client";

import { useEffect } from "react";

import {
  useSimulationStore,
  type TelemetryEvent,
  type TelemetrySeverity,
} from "@/src/store/useSimulationStore";

const telemetryTemplates = [
  { title: "Turnout surge detected", category: "VOTER FLOW", severity: "INFO" },
  { title: "AI anomaly escalation", category: "ANOMALY AI", severity: "CRITICAL" },
  { title: "Polling delay detected", category: "OPERATIONS", severity: "WARNING" },
  { title: "Cluster propagation shift", category: "TDA CLUSTER", severity: "WARNING" },
  { title: "Network instability", category: "NETWORK", severity: "WARNING" },
  { title: "Simulation divergence detected", category: "MODEL OPS", severity: "CRITICAL" },
  { title: "TDA persistence anomaly", category: "TDA CORE", severity: "CRITICAL" },
  { title: "High-risk synchronization event", category: "SYNC GRID", severity: "CRITICAL" },
] as const;

const counties = [
  "Nairobi West",
  "Mandera",
  "Kisumu Central",
  "Nakuru",
  "Turkana",
  "Mombasa",
  "Garissa",
  "Eldoret",
  "Machakos",
  "Uasin Gishu",
];

function sampleSeverity(baseSeverity: TelemetrySeverity): TelemetrySeverity {
  const roll = Math.random();
  if (baseSeverity === "CRITICAL" || roll > 0.83) return "CRITICAL";
  if (baseSeverity === "WARNING" || roll > 0.56) return "WARNING";
  return "INFO";
}

function buildTelemetryEvent(): TelemetryEvent {
  const template = telemetryTemplates[Math.floor(Math.random() * telemetryTemplates.length)];
  const county = counties[Math.floor(Math.random() * counties.length)];
  const severity = sampleSeverity(template.severity);
  const status = severity === "CRITICAL" ? "ESCALATED" : severity === "WARNING" ? "TRACKING" : "LIVE";

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
    title: template.title,
    severity,
    category: template.category,
    county,
    status,
  };
}

export function useRealtimeTelemetry() {
  const events = useSimulationStore((state) => state.telemetryEvents);
  const pushTelemetryEvent = useSimulationStore((state) => state.pushTelemetryEvent);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let active = true;

    const scheduleNextEvent = () => {
      const delay = 2000 + Math.random() * 2000;
      timeoutId = setTimeout(() => {
        if (!active) return;
        pushTelemetryEvent(buildTelemetryEvent());
        scheduleNextEvent();
      }, delay);
    };

    scheduleNextEvent();

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pushTelemetryEvent]);

  return events;
}
