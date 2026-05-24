"use client";

import { motion } from "framer-motion";

import { useObservatoryStore } from "../../store/useObservatoryStore";

export default function BottomReplayRail() {
  const replayTick = useObservatoryStore((s) => s.replayTick);
  const isReplayPlaying = useObservatoryStore((s) => s.isReplayPlaying);
  const replaySpeed = useObservatoryStore((s) => s.replaySpeed);
  const telemetry = useObservatoryStore((s) => s.telemetryEvents);
  const setReplayTick = useObservatoryStore((s) => s.setReplayTick);
  const setReplayPlaying = useObservatoryStore((s) => s.setReplayPlaying);
  const setReplaySpeed = useObservatoryStore((s) => s.setReplaySpeed);

  return (
    <div className="h-24 border-t border-zinc-800 bg-black px-6 py-4">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider text-zinc-500">
        <span>Election Replay Timeline</span>
        <div className="flex gap-2">
          <button onClick={() => setReplayPlaying(!isReplayPlaying)} className="rounded border border-zinc-700 px-2 py-0.5">{isReplayPlaying ? "Pause" : "Play"}</button>
          <button onClick={() => setReplaySpeed(replaySpeed === 1 ? 2 : replaySpeed === 2 ? 4 : 1)} className="rounded border border-zinc-700 px-2 py-0.5">{replaySpeed}x</button>
        </div>
      </div>

      <div className="relative">
        <input type="range" min="0" max="120" value={replayTick} onChange={(e) => setReplayTick(Number(e.target.value))} className="w-full" />
        <motion.div animate={{ x: `${(replayTick / 120) * 100}%` }} className="pointer-events-none absolute -top-1 h-5 w-5 rounded-full bg-cyan-400/40 blur-sm" />
        <div className="absolute left-0 right-0 top-3 flex justify-between px-2">
          {telemetry.slice(0, 6).map((event) => (
            <span key={event.id} className={`h-2 w-2 rounded-full ${event.severity === "CRITICAL" ? "bg-red-500" : "bg-cyan-400"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
