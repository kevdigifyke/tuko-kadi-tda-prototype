"use client";

import { Pause, Play } from "lucide-react";

interface Props { isPlaying: boolean; onToggle: () => void; }

const times = ["18:00", "20:00", "22:00", "NOW", "02:00", "04:00", "06:00"];

export function TimelineScrubber({ isPlaying, onToggle }: Props) {
  return (
    <section className="flex min-h-[96px] w-full items-center gap-3 overflow-hidden rounded-2xl border border-cyan-300/40 bg-[linear-gradient(180deg,rgba(5,15,20,.95),rgba(2,9,12,.92))] px-4 py-3 shadow-[0_0_20px_rgba(0,229,255,.22)] backdrop-blur md:min-h-[90px] md:gap-4 md:px-5">
      <div className="shrink-0">
        <p className="panel-kicker whitespace-nowrap text-[#00e5ff]">Time Machine</p>
        <p className="font-ui text-sm text-[#a9bac5]">Replay Mode</p>
      </div>
      <button onClick={onToggle} className="shrink-0 rounded-2xl bg-[#00e5ff] p-3 text-[#04232b] md:p-4">{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
      <div className="min-w-0 flex-1">
        <div className="h-1 rounded-full bg-cyan-200/20">
          <div className="h-1 w-3/5 rounded-full bg-[#00e5ff]" />
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] text-[#6f8290] sm:text-[11px]">
          {times.map((t) => <span key={t} className={t === "NOW" ? "text-[#00e5ff]" : ""}>{t}</span>)}
        </div>
      </div>
      <p className="shrink-0 text-right font-mono text-xs text-[#c5d4dc] sm:text-sm">1.5x Speed<br />Live Synced</p>
    </section>
  );
}
