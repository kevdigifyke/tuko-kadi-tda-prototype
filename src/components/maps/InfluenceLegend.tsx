"use client";

import { motion } from "framer-motion";

type InfluenceLegendProps = {
  stationCount: number;
  connectionCount: number;
  maxRisk: number;
};

export default function InfluenceLegend({ stationCount, connectionCount, maxRisk }: InfluenceLegendProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 z-[1000] w-72 rounded-xl border border-cyan-400/40 bg-black/70 p-4 text-xs text-cyan-100 backdrop-blur"
    >
      <h3 className="mb-2 text-sm font-semibold text-cyan-200">Network Influence Legend</h3>
      <ul className="space-y-1.5">
        <li><span className="font-semibold text-red-400">Red</span>: High influence propagation</li>
        <li><span className="font-semibold text-yellow-300">Yellow</span>: Moderate influence propagation</li>
        <li><span className="font-semibold text-cyan-300">Cyan</span>: Weak influence propagation</li>
        <li>Propagation risk scale: <span className="font-semibold">0-100</span></li>
        <li>Connected station count indicates local network density.</li>
      </ul>
      <div className="mt-3 border-t border-cyan-500/30 pt-2 text-[11px] text-cyan-200/90">
        <div>Nodes: {stationCount}</div>
        <div>Links: {connectionCount}</div>
        <div>Peak propagated risk: {maxRisk.toFixed(1)}</div>
      </div>
    </motion.div>
  );
}
