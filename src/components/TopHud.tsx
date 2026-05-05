interface TopHudProps {
  mode: string;
  anomalies: number;
  lastUpdated: string;
}

export function TopHud({ mode, anomalies, lastUpdated }: TopHudProps) {
  return (
    <header className="panel-glow flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-[#121922] px-5 py-4">
      <div className="flex items-center gap-4">
        <span className="rounded-full border border-cyan-400/50 bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-[#00E5FF]">LIVE</span>
        <h1 className="text-lg font-semibold tracking-wide text-white">Tuko Kadi Election Intelligence</h1>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-300 md:grid-cols-4">
        <p>Mode: <span className="text-[#7C4DFF]">{mode}</span></p>
        <p>Anomalies: <span className="text-[#FF3D00]">{anomalies}</span></p>
        <p>Updated: <span className="text-[#00E5FF]">{lastUpdated}</span></p>
        <p>Webcam: <span className="text-[#FFD600]">Simulated</span></p>
      </div>
    </header>
  );
}
