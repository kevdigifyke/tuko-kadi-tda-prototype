"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import TelemetryFeed from "./TelemetryFeed";
import CommandSidebar from "./CommandSidebar";
import BottomReplayRail from "./BottomReplayRail";
import { useObservatoryStore } from "../../store/useObservatoryStore";

const IEBCBoundaryMap = dynamic(() => import("../maps/IEBCBoundaryMap"), { ssr: false });

export default function NationalCommandCenter() {
  const alerts = useObservatoryStore((s) => s.alerts);
  const dismissAlert = useObservatoryStore((s) => s.dismissAlert);
  const replayTick = useObservatoryStore((s) => s.replayTick);
  const mode = useObservatoryStore((s) => s.mode);
  const isReplayPlaying = useObservatoryStore((s) => s.isReplayPlaying);
  const replaySpeed = useObservatoryStore((s) => s.replaySpeed);
  const setReplayTick = useObservatoryStore((s) => s.setReplayTick);

  useEffect(() => {
    if (!isReplayPlaying) return;
    const timer = setInterval(() => {
      setReplayTick((replayTick + replaySpeed) % 120);
    }, 1200);
    return () => clearInterval(timer);
  }, [isReplayPlaying, replaySpeed, replayTick, setReplayTick]);

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <div className="grid grid-cols-4 gap-3 border-b border-zinc-800 p-3 text-xs">
        {[
          ["Telemetry Throughput", `${Math.round(82 + replayTick / 4)} evt/m`],
          ["AI Confidence", `${Math.min(99, 74 + replayTick / 5)}%`],
          ["Propagation Load", `${Math.round(31 + replayTick / 3)}%`],
          ["Mode", mode],
        ].map(([k, v]) => (
          <motion.div key={String(k)} animate={{ boxShadow: ["0 0 0px #00ffff00", "0 0 14px #00ffff33", "0 0 0px #00ffff00"] }} transition={{ duration: 2.4, repeat: Infinity }} className="rounded border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-zinc-500">{k}</p><p className="mt-1 text-cyan-300 text-sm">{v}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 shrink-0"><CommandSidebar /></div>
        <div className="flex-1 relative"><IEBCBoundaryMap /></div>
        <div className="w-80 shrink-0"><TelemetryFeed /></div>
      </div>

      <AnimatePresence>
        {alerts.slice(0, 2).map((alert) => (
          <motion.div key={alert.id} initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="absolute top-3 left-1/2 z-[1200] w-[460px] -translate-x-1/2 rounded border border-red-500/60 bg-red-950/90 px-4 py-2 text-sm">
            <div className="flex items-center justify-between"><span>{alert.message}</span><button className="text-red-300" onClick={() => dismissAlert(alert.id)}>Dismiss</button></div>
          </motion.div>
        ))}
      </AnimatePresence>

      <BottomReplayRail />
    </div>
  );
}
