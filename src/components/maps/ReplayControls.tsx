"use client";

interface ReplayControlsProps {
  isPlaying: boolean;
  currentIndex: number;
  maxIndex: number;
  speed: number;
  speedOptions: readonly number[];
  currentTimeLabel: string;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onScrub: (index: number) => void;
  onSpeedChange: (speed: number) => void;
}

export default function ReplayControls({
  isPlaying,
  currentIndex,
  maxIndex,
  speed,
  speedOptions,
  currentTimeLabel,
  onPlay,
  onPause,
  onReset,
  onScrub,
  onSpeedChange,
}: ReplayControlsProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-[1000] rounded-xl border border-cyan-500/30 bg-zinc-950/85 p-4 shadow-[0_0_35px_rgba(34,211,238,0.2)] backdrop-blur">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm text-cyan-100">
        <span className="font-semibold tracking-wide">Temporal Replay Controls</span>
        <span className="rounded-md border border-cyan-500/30 px-2 py-1 text-cyan-300">{currentTimeLabel}</span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={onPlay} className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500">Play</button>
        <button onClick={onPause} className="rounded bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-500">Pause</button>
        <button onClick={onReset} className="rounded bg-rose-700 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-600">Reset</button>

        <div className="ml-auto flex items-center gap-2 text-xs text-zinc-200">
          <span>Speed</span>
          <select
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            className="rounded border border-cyan-500/40 bg-zinc-900 px-2 py-1"
          >
            {speedOptions.map((option) => (
              <option key={option} value={option}>{option}x</option>
            ))}
          </select>
          <span className={isPlaying ? "text-emerald-400" : "text-zinc-400"}>{isPlaying ? "LIVE" : "PAUSED"}</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={maxIndex}
        value={currentIndex}
        onChange={(event) => onScrub(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700"
      />
    </div>
  );
}
