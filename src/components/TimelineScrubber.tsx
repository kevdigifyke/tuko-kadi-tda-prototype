"use client";

import { Pause, Play } from "lucide-react";

interface Props {
  isPlaying: boolean;
  onToggle: () => void;
  progress: number;
  onScrub: (progress: number) => void;
  currentTimestamp: string;
  replaySpeedLabel: string;
  markers: Array<{ timestamp: string; label: string }>;
  events?: Array<{ timestamp: string; label: string }>;
}

export function TimelineScrubber({ isPlaying, onToggle, progress, onScrub, currentTimestamp, replaySpeedLabel, events = [], markers }: Props) {
  return (
    <section className="flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-cyan-300/35 bg-[linear-gradient(180deg,rgba(8,16,20,.96),rgba(10,18,22,.93))] px-4 py-3 shadow-[0_0_0_1px_rgba(0,229,255,.12),0_0_22px_rgba(0,229,255,.24)] xl:h-[112px] xl:flex-row xl:items-center xl:gap-4 xl:px-5 xl:py-0">
      <div className="shrink-0 xl:w-[140px]"><p className="panel-kicker text-[#00e5ff]">Time Machine</p><p className="font-ui text-sm text-[#a9bac5]">Replay Mode</p></div>
      <button type="button" onClick={onToggle} aria-label={isPlaying ? "Pause replay" : "Play replay"} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00e5ff] text-[#04232b] shadow-[0_0_24px_rgba(0,229,255,.35)] transition hover:scale-105 xl:h-14 xl:w-14">{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
      <div className="min-w-0 flex-1">
        <input type="range" min={0} max={1} step={0.001} value={progress} onChange={(e) => onScrub(Number(e.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-cyan-200/20" />
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#8da6b4]">{markers.slice(0, 3).map((m) => <span key={m.timestamp+m.label}><strong className="text-[#00e5ff]">{m.timestamp}</strong> {m.label}</span>)}</div>
        {events.length > 0 && <p className="mt-1 truncate text-xs text-[#9ab8c8]">{events.slice(0, 2).map((event) => event.label).join(" • ")}</p>}
      </div>
      <p className="shrink-0 whitespace-nowrap text-left font-mono text-sm text-[#c5d4dc] xl:w-[132px] xl:text-right">{replaySpeedLabel}<br />{currentTimestamp}</p>
    </section>
  );
}
