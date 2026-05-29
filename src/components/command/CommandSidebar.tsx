"use client";

import CognitiveIntelligencePanel from "./CognitiveIntelligencePanel";
import SignalIntelligencePanel from "./SignalIntelligencePanel";
import TransparencyLayerPanel from "../legitimacy/TransparencyLayerPanel";
import ResearchReadinessPanel from "../research/ResearchReadinessPanel";

export default function CommandSidebar() {
  return (
    <div className="h-full space-y-3 overflow-y-auto border-r border-cyan-950/60 bg-black/88 p-3 text-zinc-300">
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400/90">
        National Intelligence
      </h2>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/62 p-3">
        <h3 className="text-sm font-semibold text-white">
          AI Risk Engine
        </h3>

        <p className="text-xs text-zinc-400 mt-2">
          Monitoring national anomaly propagation patterns.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/62 p-3">
        <h3 className="text-sm font-semibold text-white">
          TDA Intelligence
        </h3>

        <p className="text-xs text-zinc-400 mt-2">
          Persistent topology structures actively updating.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/62 p-3">
        <h3 className="text-sm font-semibold text-white">
          Simulation Engine
        </h3>

        <p className="text-xs text-zinc-400 mt-2">
          Synthetic election scenario replay active.
        </p>
      </div>

      <TransparencyLayerPanel />

      <ResearchReadinessPanel />

      <SignalIntelligencePanel />

      <CognitiveIntelligencePanel />
    </div>
  );
}