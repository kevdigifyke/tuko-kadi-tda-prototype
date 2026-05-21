"use client";

import { CircleMarker, Popup } from "react-leaflet";

interface PulseMarkerProps {
  station: any;
}

export default function PulseMarker({ station }: PulseMarkerProps) {
  const riskScore = station.spatialRisk ?? 0;

  const outerRadius = 10 + (station.turnout / 100) * 16;
  const innerRadius = 4 + (station.turnout / 100) * 8;

  const anomalyColor =
    station.anomalyScore >= 0.85
      ? "#ef4444"
      : station.anomalyScore >= 0.65
      ? "#f97316"
      : station.anomalyScore >= 0.45
      ? "#facc15"
      : "#10b981";

  const riskLabel =
    riskScore >= 85
      ? "CRITICAL"
      : riskScore >= 70
      ? "HIGH RISK"
      : riskScore >= 45
      ? "WATCHLIST"
      : "STABLE";

  return (
    <>
      <CircleMarker
        center={[station.lat, station.lng]}
        radius={outerRadius}
        pathOptions={{
          color: anomalyColor,
          fillColor: anomalyColor,
          fillOpacity: 0.16,
          weight: 1,
          className: "transition-all duration-700 ease-out",
        }}
      />

      <CircleMarker
        center={[station.lat, station.lng]}
        radius={innerRadius}
        pathOptions={{
          color: anomalyColor,
          fillColor: anomalyColor,
          fillOpacity: 0.88,
          weight: 2,
          className: "transition-all duration-700 ease-out",
        }}
      >
        <Popup>
          <div className="space-y-2 min-w-[220px]">
            <h3 className="font-bold text-base">{station.name}</h3>
            <p className="text-xs text-zinc-500">Polling Intelligence Node</p>
            <p className="text-sm"><span className="font-semibold">County:</span> {station.county}</p>
            <p className="text-sm"><span className="font-semibold">Constituency:</span> {station.constituency}</p>
            <p className="text-sm"><span className="font-semibold">Ward:</span> {station.ward}</p>
            <p className="text-sm"><span className="font-semibold">Turnout:</span> {station.turnout}%</p>
            <p className="text-sm"><span className="font-semibold">Anomaly Score:</span> {station.anomalyScore}</p>
            <p className="text-sm"><span className="font-semibold">Spatial Risk Index:</span> {riskScore}/100</p>
            <p className="text-sm"><span className="font-semibold">Cumulative Votes:</span> {station.cumulativeVotes}</p>
            <p className="text-sm"><span className="font-semibold">Crowd Index:</span> {station.crowdIndex}</p>
            <div className="font-bold text-sm" style={{ color: anomalyColor }}>{riskLabel}</div>
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}
