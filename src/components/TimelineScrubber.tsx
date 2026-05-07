"use client";

import { Pause, Play } from "lucide-react";

interface Props {
  isPlaying: boolean;
  onToggle: () => void;
}

const times = ["18:00", "20:00", "22:00", "NOW", "02:00", "04:00", "06:00"];

export function TimelineScrubber({ isPlaying, onToggle }: Props) {
  return (
    <section className="flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-cyan-300/35 bg-[linear-gradient(180deg,rgba(8,16,20,.96),rgba(10,18,22,.93))] px-4 py-3 shadow-[0_0_0_1px_rgba(0,229,255,.12),0_0_22px_rgba(0,229,255,.24)] xl:h-[96px] xl:flex-row xl:items-center xl:gap-4 xl:px-5 xl:py-0">
      <div className="shrink-0 xl:w-[112px]">
        <p className="panel-kicker text-[#00e5ff]">Time Machine</p>
        <p className="font-ui text-sm text-[#a9bac5]">Replay Mode</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? "Pause replay" : "Play replay"}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00e5ff] text-[#04232b] shadow-[0_0_24px_rgba(0,229,255,.35)] transition hover:scale-105 xl:h-14 xl:w-14"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="h-1.5 rounded-full bg-cyan-200/20">
          <div className="h-1.5 w-3/5 rounded-full bg-[#00e5ff]" />
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-[#6f8290]">
          {times.map((time) => (
            <span
              key={time}
              className={`whitespace-nowrap ${
                time === "NOW" ? "font-semibold text-[#00e5ff]" : ""
              }`}
            >
              {time}
            </span>
          ))}
        </div>
      </div>

      <p className="shrink-0 whitespace-nowrap text-left font-mono text-sm text-[#c5d4dc] xl:w-[112px] xl:text-right">
        1.5x Speed
        <br />
        Live Synced
      </p>
    </section>
  );
}
