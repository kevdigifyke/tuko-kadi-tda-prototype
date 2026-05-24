"use client";

import { motion } from "framer-motion";

import { useObservatoryStore, type ObservatoryMode } from "../../store/useObservatoryStore";

const modes: ObservatoryMode[] = ["Observatory", "Simulations", "Anomalies", "Analytics", "Maps"];

export default function CommandSidebar() {
  const mode = useObservatoryStore((s) => s.mode);
  const setMode = useObservatoryStore((s) => s.setMode);
  const overlay = useObservatoryStore((s) => s.overlayVisibility);
  const selectedCounty = useObservatoryStore((s) => s.selectedCounty);

  return (
    <div className="h-full bg-black border-r border-zinc-800 p-4 space-y-4">
      <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">National Intelligence</h2>
      <div className="grid grid-cols-2 gap-2">
        {modes.map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`rounded-lg border px-2 py-2 text-xs ${mode === m ? "border-cyan-400 text-cyan-300 bg-cyan-400/10" : "border-zinc-700 text-zinc-400"}`}>
            {m}
          </button>
        ))}
      </div>

      {["AI Prediction", "TDA Topology", "Simulation Evolution", "Propagation", "System Health"].map((title, idx) => {
        const key = ["aiPrediction", "tdaTopology", "simulationEvolution", "propagation", "systemHealth"][idx] as const;
        return (
          <motion.div key={title} animate={{ opacity: overlay[key] ? 1 : 0.35, scale: overlay[key] ? 1 : 0.98 }} className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="text-xs text-zinc-400 mt-2">{overlay[key] ? "Overlay active and synchronized" : "Overlay reduced for current mode"}</p>
          </motion.div>
        );
      })}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-300">Focused County: <span className="text-cyan-300">{selectedCounty ?? "National"}</span></div>
    </div>
  );
}
