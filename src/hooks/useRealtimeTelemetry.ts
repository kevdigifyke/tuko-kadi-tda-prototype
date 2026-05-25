"use client";

import { useEffect } from "react";

import {
  useSimulationStore,
  type TelemetryEvent,
  type TelemetrySeverity,
  type IntelligenceSeverity,
} from "@/src/store/useSimulationStore";

const telemetryTemplates = [
  { title: "Turnout spike", category: "VOTER FLOW", severity: "WARNING" },
  { title: "Ballot delay", category: "OPERATIONS", severity: "WARNING" },
  { title: "AI anomaly escalation", category: "ANOMALY AI", severity: "CRITICAL" },
  { title: "Propagation shift", category: "TDA CLUSTER", severity: "CRITICAL" },
  { title: "Network instability", category: "NETWORK", severity: "WARNING" },
  { title: "Synchronization anomaly", category: "SYNC GRID", severity: "CRITICAL" },
  { title: "Simulation divergence", category: "MODEL OPS", severity: "CRITICAL" },
] as const;

const regionTriples = [
  { county: "Nairobi", constituency: "Westlands", ward: "Parklands/Highridge" },
  { county: "Mombasa", constituency: "Nyali", ward: "Frere Town" },
  { county: "Kisumu", constituency: "Kisumu Central", ward: "Railways" },
  { county: "Nakuru", constituency: "Naivasha", ward: "Biashara" },
  { county: "Turkana", constituency: "Turkana Central", ward: "Lobokat" },
  { county: "Machakos", constituency: "Mavoko", ward: "Athi River" },
] as const;

const simulationStatuses: TelemetryEvent["simulationStatus"][] = ["STABLE", "PREDICTIVE", "DIVERGENT"];

function sampleSeverity(baseSeverity: TelemetrySeverity): TelemetrySeverity {
  const roll = Math.random();
  if (baseSeverity === "CRITICAL" || roll > 0.83) return "CRITICAL";
  if (baseSeverity === "WARNING" || roll > 0.5) return "WARNING";
  return "INFO";
}

function toIntelligenceSeverity(severity: TelemetrySeverity): IntelligenceSeverity {
  if (severity === "CRITICAL") return Math.random() > 0.6 ? "MAGENTA" : "RED";
  if (severity === "WARNING") return "AMBER";
  return "GREEN";
}

function buildTelemetryEvent(): TelemetryEvent {
  const template = telemetryTemplates[Math.floor(Math.random() * telemetryTemplates.length)];
  const region = regionTriples[Math.floor(Math.random() * regionTriples.length)];
  const severity = sampleSeverity(template.severity);
  const status = severity === "CRITICAL" ? "ESCALATED" : severity === "WARNING" ? "TRACKING" : "LIVE";

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
    title: template.title,
    severity,
    category: template.category,
    county: region.county,
    constituency: region.constituency,
    ward: region.ward,
    status,
    intelligenceSeverity: toIntelligenceSeverity(severity),
    turnout: Math.round(45 + Math.random() * 45),
    aiRiskScore: Math.round(22 + Math.random() * 78),
    tdaStability: Math.round(35 + Math.random() * 65),
    simulationStatus: simulationStatuses[Math.floor(Math.random() * simulationStatuses.length)],
  };
}

export function useRealtimeTelemetry() {
  const events = useSimulationStore((state) => state.telemetryEvents);
  const pushTelemetryEvent = useSimulationStore((state) => state.pushTelemetryEvent);
  const recordReplayFrame = useSimulationStore((state) => state.recordReplayFrame);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let active = true;

    const scheduleNextEvent = () => {
      const delay = 1800 + Math.random() * 2000;
      timeoutId = setTimeout(() => {
        if (!active) return;
        const event = buildTelemetryEvent();
        pushTelemetryEvent(event);
        recordReplayFrame(event);
        scheduleNextEvent();
      }, delay);
    };

    scheduleNextEvent();

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pushTelemetryEvent, recordReplayFrame]);

  return events;
}
