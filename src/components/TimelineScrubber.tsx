"use client";

import { Pause, Play } from "lucide-react";

interface Props { isPlaying: boolean; onToggle: () => void; }

const times = ["18:00", "20:00", "22:00", "NOW", "02:00", "04:00", "06:00"];

export function TimelineScrubber({ isPlaying, onToggle }: Props) {
  return (
    <section className="floating-dock h-[96px] px-4 py-3 md:h-[104px] md:px-5">
      <div className="min-w-[100px]">
        <p className="panel-kicker text-[#00daf3]">Time Machine</p>
        <p className="text-sm text-[#bac9cc]">Replay Mode</p>
      </div>
      <button onClick={onToggle} className="ml-1 rounded-2xl bg-[#00e5ff] p-3 text-[#04232b] md:p-4">{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
      <div className="mx-3 flex-1 md:mx-5">
        <div className="h-1.5 rounded-full bg-cyan-200/20">
          <div className="h-1.5 w-3/5 rounded-full bg-[#00e5ff]" />
        </div>
        <div className="mt-3 flex justify-between font-mono text-[11px] text-[#6f8290]">
          {times.map((t) => <span key={t} className={t === "NOW" ? "text-[#00e5ff]" : ""}>{t}</span>)}
        </div>
      </div>
      <p className="hidden text-right font-mono text-sm text-[#c5d4dc] md:block">1.5x Speed<br />Live Synced</p>
    </section>
  );
}
