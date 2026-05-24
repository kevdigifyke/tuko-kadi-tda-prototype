"use client";

export default function BottomReplayRail() {
  return (
    <div className="h-24 border-t border-zinc-800 bg-black px-6 py-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
        Election Replay Timeline
      </div>

      <input
        type="range"
        min="0"
        max="100"
        className="w-full"
      />

      <div className="flex justify-between text-[10px] text-zinc-500 mt-2">
        <span>06:00</span>
        <span>09:00</span>
        <span>12:00</span>
        <span>15:00</span>
        <span>18:00</span>
      </div>
    </div>
  );
}