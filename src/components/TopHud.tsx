import { Bell, Cog, ShieldCheck } from "lucide-react";

interface TopHudProps {
  lastUpdated: string;
}

const tabs = ["Network", "Anomalies", "Sentiment", "Logistics"];

export function TopHud({ lastUpdated }: TopHudProps) {
  return (
    <header className="z-20 flex h-16 items-center justify-between border-b border-cyan-400/20 bg-[#081116]/90 px-6 backdrop-blur">
      <div className="flex items-center gap-7">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`font-ui text-xs uppercase tracking-[0.12em] ${index === 0 ? "text-[#00e5ff]" : "text-[#7e8d9a]"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="chip font-ui"><ShieldCheck size={13} />System Secure</span>
        <span className="chip font-mono">Linked / Cam_01</span>
        <span className="chip font-mono">{lastUpdated || "--:--:--"} UTC</span>
        <button className="icon-chip"><Bell size={14} /></button>
        <button className="icon-chip"><Cog size={14} /></button>
      </div>
    </header>
  );
}
