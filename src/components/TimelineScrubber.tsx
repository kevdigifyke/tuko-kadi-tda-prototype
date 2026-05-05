"use client";

import { Pause, Play } from "lucide-react";

interface Props { isPlaying: boolean; onToggle: () => void; }

const times = ["6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM"];

export function TimelineScrubber({ isPlaying, onToggle }: Props) {
  return (
    <section className="panel-glow rounded-2xl border border-slate-700 bg-[#121922] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#00E5FF]">Time Machine Replay</h2>
        <button onClick={onToggle} className="rounded-md border border-cyan-400/40 bg-cyan-400/10 p-2 text-[#00E5FF]">{isPlaying ? <Pause size={15} /> : <Play size={15} />}</button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto">
        {times.map((time) => <div key={time} className="flex min-w-[56px] flex-col items-center"><span className="h-2 w-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" /><span className="mt-1 text-[10px] text-slate-400">{time}</span></div>)}
      </div>
      <p className="mt-3 text-xs text-slate-300">Selected time: <span className="text-[#FFD600]">10:41 PM</span></p>
    </section>
  );
}
