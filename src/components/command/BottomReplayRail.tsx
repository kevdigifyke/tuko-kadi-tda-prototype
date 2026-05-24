"use client";

import { useObservatoryStore, type ReplaySpeed } from "../../store/useObservatoryStore";

const speeds: ReplaySpeed[] = [0.5, 1, 2, 4];

export default function BottomReplayRail() {
  const replayPosition = useObservatoryStore((s) => s.replayPosition);
  const replaySpeed = useObservatoryStore((s) => s.replaySpeed);
  const setReplayPosition = useObservatoryStore((s) => s.setReplayPosition);
  const setReplaySpeed = useObservatoryStore((s) => s.setReplaySpeed);

  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-black/50 px-4 py-3 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Election Replay Timeline</p>
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          {speeds.map((speed) => (
            <button key={speed} onClick={() => setReplaySpeed(speed)} className={`rounded px-2 py-1 ${replaySpeed === speed ? "bg-cyan-400/20 text-cyan-100" : "bg-white/5 hover:bg-white/10"}`}>
              {speed}x
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <input type="range" min="0" max="100" value={replayPosition} onChange={(e) => setReplayPosition(Number(e.target.value))} className="w-full accent-cyan-300" />
        <div className="pointer-events-none absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between text-[9px] text-rose-300/70">
          <span>●</span><span>●</span><span>●</span><span>●</span>
        </div>
      </div>
    </div>
  );
}
