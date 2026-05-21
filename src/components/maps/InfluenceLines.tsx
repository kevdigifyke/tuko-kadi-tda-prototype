"use client";

import { Polyline, Tooltip } from "react-leaflet";

import type { InfluenceConnection, InfluenceStationResult } from "@/src/lib/tda/networkInfluenceEngine";

type InfluenceLinesProps = {
  connections: InfluenceConnection[];
  stations: InfluenceStationResult[];
};

const getColor = (weight: number) => {
  if (weight >= 0.7) return "#ef4444";
  if (weight >= 0.4) return "#facc15";
  return "#22d3ee";
};

export default function InfluenceLines({ connections, stations }: InfluenceLinesProps) {
  return (
    <>
      {connections.map((connection) => {
        const source = stations.find((station) => station.id === connection.sourceId);
        const target = stations.find((station) => station.id === connection.targetId);
        if (!source || !target) return null;

        const color = getColor(connection.weight);

        return (
            <Polyline
              key={`${connection.sourceId}-${connection.targetId}`}
              positions={[
                [source.lat, source.lng],
                [target.lat, target.lng],
              ]}
              pathOptions={{
                color,
                weight: 2 + connection.weight * 3,
                opacity: 0.7,
                dashArray: "8 10",
              }}
            >
              <Tooltip sticky>
                <div className="text-xs space-y-1">
                  <div className="font-semibold">Influence Propagation</div>
                  <div>{source.name} → {target.name}</div>
                  <div>Weight: {(connection.weight * 100).toFixed(1)}%</div>
                  <div>Distance: {connection.distanceKm.toFixed(2)} km</div>
                </div>
              </Tooltip>
            </Polyline>
        );
      })}
    </>
  );
}
