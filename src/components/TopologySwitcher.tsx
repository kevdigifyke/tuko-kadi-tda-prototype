"use client";

import {
  TOPOLOGY_MODES,
  TOPOLOGY_MODE_DESCRIPTIONS,
  TOPOLOGY_MODE_LABELS,
  type TopologyMode,
} from "@/src/types/topology";

type Props = {
  value: TopologyMode;
  onChange: (mode: TopologyMode) => void;
};

export function TopologySwitcher({ value, onChange }: Props) {
  return (
    <div className="rounded-lg border border-white/15 bg-[#10191b]/90 p-2 backdrop-blur">
      <div className="flex flex-wrap gap-1">
        {TOPOLOGY_MODES.map((mode) => {
          const active = mode === value;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange(mode)}
              className={`rounded px-2.5 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border border-cyan-300/70 bg-gradient-to-r from-cyan-400/20 to-violet-400/20 text-cyan-100"
                  : "border border-white/15 bg-[#151d1e] text-[#bac9cc] hover:text-[#dce4e5]"
              }`}
            >
              {TOPOLOGY_MODE_LABELS[mode]}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-[#8fa6ad]">{TOPOLOGY_MODE_DESCRIPTIONS[value]}</p>
    </div>
  );
}
