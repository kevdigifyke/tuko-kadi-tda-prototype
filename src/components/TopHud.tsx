interface TopHudProps {
  mode: string;
  anomalies: number;
  lastUpdated: string;
}

function TelemetryChip({ label, value, tone = "cyan" }: { label: string; value: string; tone?: "cyan" | "purple" | "yellow" | "red" }) {
  const tones = {
    cyan: "text-[#00daf3] border-cyan-400/25 bg-cyan-400/10",
    purple: "text-[#b197fc] border-purple-400/25 bg-purple-400/10",
    yellow: "text-[#ffd866] border-yellow-400/30 bg-yellow-400/12",
    red: "text-[#ff8a65] border-red-400/35 bg-red-500/10",
  } as const;

  return (
    <div className={`rounded-xl border px-3 py-2 ${tones[tone]}`}>
      <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-[#bac9cc]">{label}</p>
      <p className="font-tech mt-0.5 text-xs md:text-sm">{value}</p>
    </div>
  );
}

export function TopHud({ mode, anomalies, lastUpdated }: TopHudProps) {
  return (
    <header className="panel-glow relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#121922] px-5 py-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/65 to-transparent" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <span className="font-tech inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-400/12 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-[#00e5ff]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]" />
            Live Monitor
          </span>
          <div>
            <p className="font-tech text-xl font-semibold text-white">Tuko Kadi Command Center</p>
            <p className="text-xs text-[#bac9cc]">Election Intelligence & Forensic Review Console</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <TelemetryChip label="Mode" value={mode} tone="purple" />
          <TelemetryChip label="Anomalies" value={`${anomalies} flagged`} tone="red" />
          <TelemetryChip label="Sync" value={lastUpdated || "--:--:--"} tone="cyan" />
          <TelemetryChip label="Webcam" value="Tracking Online" tone="yellow" />
        </div>
      </div>
    </header>
  );
}
