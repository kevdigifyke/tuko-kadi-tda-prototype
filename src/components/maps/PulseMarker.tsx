"use client";

import { CircleMarker, Popup } from "react-leaflet";
import { calculateSpatialRisk } from "../../lib/tda/spatialRiskEngine";

type MarkerStation = { id: string; lat: number; lng: number; name: string; turnout?: number; status?: string; tdaStability?: number; simulationStatus?: string; aiRiskScore?: number; anomalyScore?: number; severity?: "GREEN" | "AMBER" | "RED" | "MAGENTA"; }
interface PulseMarkerProps { station: MarkerStation; }

const severityStyles = {
  GREEN: { color: "#22c55e", ring: 9, core: 3.4, opacity: 0.12 },
  AMBER: { color: "#f59e0b", ring: 11, core: 3.8, opacity: 0.16 },
  RED: { color: "#ef4444", ring: 13, core: 4.2, opacity: 0.22 },
  MAGENTA: { color: "#d946ef", ring: 14, core: 4.4, opacity: 0.2 },
} as const;

export default function PulseMarker({ station }: PulseMarkerProps) {
  const riskScore = station.aiRiskScore ?? calculateSpatialRisk(station);
  const sev = station.severity ?? (riskScore > 85 ? "RED" : riskScore > 60 ? "AMBER" : "GREEN");
  const style = severityStyles[sev as keyof typeof severityStyles] ?? severityStyles.GREEN;

  return (
    <>
      <CircleMarker center={[station.lat, station.lng]} radius={style.ring} pathOptions={{ color: style.color, fillColor: style.color, fillOpacity: style.opacity, weight: 0.8 }} />
      <CircleMarker center={[station.lat, station.lng]} radius={style.ring * 0.7} pathOptions={{ color: style.color, fillColor: style.color, fillOpacity: style.opacity * 0.85, weight: 0.5 }} />
      <CircleMarker center={[station.lat, station.lng]} radius={style.core} pathOptions={{ color: style.color, fillColor: style.color, fillOpacity: 0.9, weight: 1 }}>
        <Popup>
          <div className="space-y-1 text-sm min-w-[220px]">
            <div className="font-semibold">{station.name}</div>
            <div>AI Risk Score: {riskScore}</div>
            <div>Turnout %: {station.turnout ?? 0}</div>
            <div>Telemetry State: {station.status ?? "LIVE"}</div>
            <div>TDA Stability: {station.tdaStability ?? 72}</div>
            <div>Simulation Status: {station.simulationStatus ?? "PREDICTIVE"}</div>
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}
