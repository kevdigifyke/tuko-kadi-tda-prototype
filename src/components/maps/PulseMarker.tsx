"use client";

import { CircleMarker, Popup } from "react-leaflet";
import { calculateSpatialRisk } from "../../lib/tda/spatialRiskEngine";
import type { TelemetryEvent } from "@/src/store/useSimulationStore";

type MarkerStation = { id: string; lat: number; lng: number; name: string; turnout?: number; status?: string; tdaStability?: number; simulationStatus?: string; aiRiskScore?: number; anomalyScore?: number; severity?: "GREEN" | "AMBER" | "RED" | "MAGENTA"; };
interface PulseMarkerProps {
  station: MarkerStation;
  cinematicPulse?: boolean;
  isFocused?: boolean;
  dimmed?: boolean;
  criticalBoost?: boolean;
  propagationPulse?: boolean;
  linkedTelemetry?: TelemetryEvent[];
  affectedStations?: number;
  propagationCluster?: string;
  turnoutPressure?: string;
  confidence?: number;
  anomalyType?: string;
  onFocusIntelligence?: () => void;
  onReplayTrace?: () => void;
}

const severityStyles = {
  GREEN: { color: "#22c55e", ring: 9, core: 3.4, opacity: 0.12 },
  AMBER: { color: "#f59e0b", ring: 11, core: 3.8, opacity: 0.16 },
  RED: { color: "#ef4444", ring: 13, core: 4.2, opacity: 0.22 },
  MAGENTA: { color: "#d946ef", ring: 14, core: 4.4, opacity: 0.2 },
} as const;

const severityLabel = (sev: keyof typeof severityStyles) => sev === "RED" || sev === "MAGENTA" ? "CRITICAL" : sev === "AMBER" ? "WARNING" : "STABLE";

export default function PulseMarker({
  station,
  cinematicPulse = true,
  isFocused = false,
  dimmed = false,
  criticalBoost = false,
  propagationPulse = false,
  linkedTelemetry = [],
  affectedStations = 1,
  propagationCluster = "Local telemetry mesh",
  turnoutPressure = "Moderate",
  confidence,
  anomalyType,
  onFocusIntelligence,
  onReplayTrace,
}: PulseMarkerProps) {
  const riskScore = station.aiRiskScore ?? calculateSpatialRisk(station);
  const sev = station.severity ?? (riskScore > 85 ? "RED" : riskScore > 60 ? "AMBER" : "GREEN");
  const style = severityStyles[sev as keyof typeof severityStyles] ?? severityStyles.GREEN;
  const confidenceScore = confidence ?? Math.min(96, Math.max(58, Math.round((riskScore + (station.tdaStability ?? 72)) / 2)));
  const signals = linkedTelemetry.length ? linkedTelemetry.slice(0, 3).map((event) => event.title) : [anomalyType ?? "Turnout Pressure", station.simulationStatus ?? "Predictive Drift"];
  const replayAvailable = linkedTelemetry.length > 0 || station.simulationStatus === "DIVERGENT" || criticalBoost;

  return (
    <>
      <CircleMarker center={[station.lat, station.lng]} radius={style.ring * (criticalBoost ? 1.12 : 1)} pathOptions={{ color: style.color, fillColor: style.color, fillOpacity: dimmed ? style.opacity * 0.35 : cinematicPulse ? style.opacity * 1.2 : style.opacity, weight: isFocused ? 1.4 : 0.8, className: `${cinematicPulse ? "anomaly-pulse" : ""} ${criticalBoost ? "anomaly-critical" : ""} ${propagationPulse ? "anomaly-ripple" : ""}` }} />
      <CircleMarker center={[station.lat, station.lng]} radius={style.ring * (isFocused ? 0.82 : 0.7)} pathOptions={{ color: style.color, fillColor: style.color, fillOpacity: dimmed ? style.opacity * 0.3 : style.opacity * 0.85, weight: 0.5 }} />
      <CircleMarker center={[station.lat, station.lng]} radius={style.core * (isFocused ? 1.18 : 1)} pathOptions={{ color: style.color, fillColor: style.color, fillOpacity: dimmed ? 0.5 : 0.9, weight: isFocused ? 1.5 : 1 }}>
        <Popup className="tactical-intel-popup">
          <div className="min-w-[245px] space-y-2 text-[11px] text-zinc-200">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-rose-300">Anomaly Cluster</div>
              <div className="mt-1 text-sm font-semibold text-cyan-100">{station.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-1 rounded border border-cyan-400/15 bg-cyan-400/5 p-2">
              <span className="text-zinc-400">Type</span><span className="text-right text-cyan-100">{anomalyType ?? station.status ?? "Simulation Anomaly"}</span>
              <span className="text-zinc-400">Severity</span><span className="text-right text-rose-200">{severityLabel(sev as keyof typeof severityStyles)}</span>
              <span className="text-zinc-400">Confidence</span><span className="text-right text-emerald-200">{confidenceScore}%</span>
              <span className="text-zinc-400">Affected Stations</span><span className="text-right text-zinc-100">{affectedStations}</span>
              <span className="text-zinc-400">Propagation</span><span className="text-right text-violet-200">{propagationCluster}</span>
              <span className="text-zinc-400">Turnout Pressure</span><span className="text-right text-amber-200">{turnoutPressure}</span>
            </div>
            <div className="rounded border border-zinc-700/70 bg-black/35 p-2">
              <div className="mb-1 text-[10px] uppercase tracking-[0.16em] text-cyan-300">Linked Telemetry: {linkedTelemetry.length} Events</div>
              <ul className="space-y-0.5 text-zinc-300">
                {signals.map((signal) => <li key={signal}>• {signal}</li>)}
              </ul>
            </div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-emerald-300">{replayAvailable ? "Replay Trace Available" : "Replay Trace Pending"}</div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button type="button" onClick={onFocusIntelligence} className="rounded border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-200/70">Focus Intelligence</button>
              <button type="button" onClick={onReplayTrace} className="rounded border border-violet-400/30 bg-violet-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-violet-100 transition hover:border-violet-200/70">Replay Trace</button>
            </div>
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}
