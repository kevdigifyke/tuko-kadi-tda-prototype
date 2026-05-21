"use client";

import { CircleMarker, Tooltip } from "react-leaflet";
import { useMemo } from "react";
import { motion } from "framer-motion";
import type { InfluenceStation } from "@/lib/tda/networkInfluenceEngine";
import { predictElectionRisk } from "@/lib/ai/predictiveRiskEngine";

const palette = { LOW: "#38bdf8", GUARDED: "#facc15", ELEVATED: "#fb923c", CRITICAL: "#ef4444" };

export default function AIRiskOverlay({ stations }: { stations: InfluenceStation[] }) {
  const predictions = useMemo(() => stations.map((station) => ({ station, prediction: predictElectionRisk(station, stations) })), [stations]);

  return <>{predictions.map(({ station, prediction }) => {
    const color = palette[prediction.escalationLevel];
    const confidenceScale = Math.max(0.7, prediction.confidence / 100);
    return (
      <CircleMarker key={station.id} center={[station.lat, station.lng]} radius={6 + (prediction.riskScore / 100) * 22 * confidenceScale} pathOptions={{ color, fillColor: color, fillOpacity: 0.17 + (prediction.confidence / 100) * 0.3, weight: prediction.escalationLevel === "CRITICAL" ? 3 : 2, opacity: 0.8 }}>
        <CircleMarker center={[station.lat, station.lng]} radius={2 + (prediction.riskScore / 100) * 8} pathOptions={{ color, fillColor: color, fillOpacity: 0.8, weight: 1 }}>
          <Tooltip sticky>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-semibold">{station.name}</p><p>{prediction.escalationLevel} • Risk {prediction.riskScore}</p><p>Confidence {prediction.confidence}% • Spread {prediction.spreadProbability}%</p>
            </motion.div>
          </Tooltip>
        </CircleMarker>
      </CircleMarker>
    );
  })}</>;
}
