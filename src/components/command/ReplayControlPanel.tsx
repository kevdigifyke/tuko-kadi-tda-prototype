"use client";

interface Props { playing: boolean; speed: number; phase: number; futureMode: boolean; onTogglePlay: () => void; onSpeed: (v:number)=>void; onPhase:(v:number)=>void; onFuture:()=>void; }

export function ReplayControlPanel({ playing, speed, phase, futureMode, onTogglePlay, onSpeed, onPhase, onFuture }: Props) {
  return <section className="rounded-xl border border-cyan-300/30 bg-black/35 p-4">
    <h3 className="mb-3 text-sm font-semibold text-cyan-100">Replay Command</h3>
    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-200">
      <button onClick={onTogglePlay} className="rounded border border-cyan-400/50 px-3 py-1">{playing ? "Pause" : "Play"}</button>
      <button onClick={onFuture} className="rounded border border-amber-300/50 px-3 py-1">{futureMode ? "Future Simulation: ON" : "Future Simulation: OFF"}</button>
      <label>Speed <input type="range" min={1} max={4} step={0.5} value={speed} onChange={(e)=>onSpeed(Number(e.target.value))} /></label>
      <label>Timeline <input type="range" min={0} max={1} step={0.01} value={phase} onChange={(e)=>onPhase(Number(e.target.value))} /></label>
    </div>
  </section>;
}
