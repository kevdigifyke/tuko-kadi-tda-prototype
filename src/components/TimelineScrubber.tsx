"use client";

import { Pause, Play } from "lucide-react";

interface Props { isPlaying: boolean; onToggle: () => void; }

const times = ["6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM"];

export function TimelineScrubber({ isPlaying, onToggle }: Props) {
  return (
    <section className="panel-glow rounded-2xl border border-slate-700/80 bg-[#121922] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-tech text-sm font-semibold uppercase tracking-[0.14em] text-[#00e5ff]">Time Machine Replay</h2>
        <button onClick={onToggle} className="rounded-lg border border-cyan-300/40 bg-cyan-400/10 p-2 text-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.15)]">{isPlaying ? <Pause size={16} /> : <Play size={16} />}</button>
      </div>
      <div className="relative overflow-x-auto pb-1">
        <div className="absolute left-0 right-0 top-3 h-px bg-gradient-to-r from-cyan-400/20 via-cyan-300/55 to-cyan-400/20" />
        <div className="flex min-w-max items-start gap-3 pr-6">
          {times.map((time, index) => {
            const active = time === "10PM";
            return (
              <div key={time} className="flex min-w-[58px] flex-col items-center">
                <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-[#ffd600] shadow-[0_0_16px_#ffd600]" : "bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]"}`} />
                <span className={`mt-2 text-[10px] ${active ? "text-[#ffd866]" : "text-[#bac9cc]"}`}>{time}</span>
                <span className="mt-1 h-1 w-6 rounded-full bg-[#7c4dff]" style={{ opacity: (index % 3 === 0 ? 0.8 : 0.25) }} />
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-xs text-[#bac9cc]">Selected replay point: <span className="font-tech text-[#ffd600]">10:41 PM</span> · Event density: high</p>
    </section>
  );
}
