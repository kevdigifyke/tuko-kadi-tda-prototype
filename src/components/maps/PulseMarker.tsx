"use client";

import { CircleMarker, Popup } from "react-leaflet";
import { calculateSpatialRisk } from "@/lib/tda/spatialRiskEngine";

interface PulseMarkerProps {
  station: any;
}

export default function PulseMarker({
  station,
}: PulseMarkerProps) {

  // =========================
  // TDA + GEO RISK ENGINE
  // =========================
  const riskScore = calculateSpatialRisk(station);

  const isCriticalRisk = station.riskColor === "red" || riskScore >= 85;
  const isHighRisk = station.riskColor === "orange" || riskScore >= 70;
  const isMediumRisk = station.riskColor === "yellow" || riskScore >= 45;

  // =========================
  // DYNAMIC VISUAL SYSTEM
  // =========================
  let outerRadius = 10;
  let innerRadius = 5;

  let outerColor = "#00ff66";
  let innerColor = "#00ff66";

  let riskLabel = "STABLE";

  if (isCriticalRisk) {
    outerRadius = 24;
    innerRadius = 9;

    outerColor = "#ff0000";
    innerColor = "#ff4444";

    riskLabel = "CRITICAL";
  } else if (isHighRisk) {
    outerRadius = 18;
    innerRadius = 7;

    outerColor = "#ff6600";
    innerColor = "#ffaa00";

    riskLabel = "HIGH RISK";
  } else if (isMediumRisk) {
    outerRadius = 14;
    innerRadius = 6;

    outerColor = "#ffd700";
    innerColor = "#ffee55";

    riskLabel = "WATCHLIST";
  }

  return (
    <>
      {/* OUTER PULSE RING */}
      <CircleMarker
        center={[station.lat, station.lng]}
        radius={outerRadius}
        pathOptions={{
          color: outerColor,
          fillColor: outerColor,
          fillOpacity: 0.15,
          weight: 1,
        }}
      />

      {/* INNER CORE */}
      <CircleMarker
        center={[station.lat, station.lng]}
        radius={innerRadius}
        pathOptions={{
          color: innerColor,
          fillColor: innerColor,
          fillOpacity: 0.9,
          weight: 2,
        }}
      >
        <Popup>
          <div className="space-y-2 min-w-[220px]">

            <div>
              <h3 className="font-bold text-base">
                {station.name}
              </h3>

              <p className="text-xs text-zinc-500">
                Polling Intelligence Node
              </p>
            </div>

            <div className="space-y-1 text-sm">
              <p>
                <span className="font-semibold">
                  County:
                </span>{" "}
                {station.county}
              </p>

              <p>
                <span className="font-semibold">
                  Constituency:
                </span>{" "}
                {station.constituency}
              </p>

              <p>
                <span className="font-semibold">
                  Ward:
                </span>{" "}
                {station.ward}
              </p>
            </div>

            <div className="border-t border-zinc-300 pt-2 space-y-1 text-sm">

              <p>
                <span className="font-semibold">
                  Turnout:
                </span>{" "}
                {station.turnout}%
              </p>

              <p>
                <span className="font-semibold">
                  Anomaly Score:
                </span>{" "}
                {station.anomalyScore}
              </p>

              <p>
                <span className="font-semibold">
                  Spatial Risk Index:
                </span>{" "}
                {riskScore}/100
              </p>
            </div>

            <div
              className={`font-bold text-sm ${
                isCriticalRisk
                  ? "text-red-600"
                  : isHighRisk
                  ? "text-orange-500"
                  : isMediumRisk
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {riskLabel}
            </div>

          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}