"use client";

import { Pause, Play } from "lucide-react";

interface Props { isPlaying: boolean; onToggle: () => void; }

const times = ["18:00", "20:00", "22:00", "NOW", "02:00", "04:00", "06:00"];

export function TimelineScrubber({ isPlaying, onToggle }: Props) {
  return (
    <section className="floating-dock">
      <div>
        <p className="panel-kicker text-[#00e5ff]">Time Machine</p>
        <p className="font-ui text-sm text-[#a9bac5]">Replay Mode</p>
      </div>
      <button onClick={onToggle} className="ml-4 rounded-2xl bg-[#00e5ff] p-4 text-[#04232b]">{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
      <div className="mx-5 flex-1">
        <div className="h-1 rounded-full bg-cyan-200/20">
          <div className="h-1 w-3/5 rounded-full bg-[#00e5ff]" />
        </div>
        <div className="mt-3 flex justify-between text-[11px] text-[#6f8290]">
          {times.map((t) => <span key={t} className={t === "NOW" ? "text-[#00e5ff]" : ""}>{t}</span>)}
        </div>
      </div>
      <p className="font-mono text-sm text-[#c5d4dc]">1.5x Speed<br />Live Synced</p>
    </section>
  );
}
