import type { AfricanCountryElectionData } from "@/src/data/africa/mockAfricanElectionData";

type Props = {
  countries: AfricanCountryElectionData[];
  selectedCountryCode: string;
  onSelectCountry: (code: string) => void;
};

const mapLayout: Record<string, { x: number; y: number }> = {
  NG: { x: 32, y: 44 },
  GH: { x: 26, y: 47 },
  KE: { x: 61, y: 43 },
  UG: { x: 58, y: 40 },
  TZ: { x: 60, y: 51 },
  RW: { x: 56, y: 45 },
  ZA: { x: 57, y: 73 },
};

const riskColor = (risk: number) => {
  if (risk >= 70) return "#ff5a5a";
  if (risk >= 50) return "#ffc14d";
  return "#00e5ff";
};

export function AfricaElectionMap({ countries, selectedCountryCode, onSelectCountry }: Props) {
  return (
    <div className="command-card p-4">
      <p className="panel-kicker text-cyan-200">Continental election map</p>
      <div className="relative mt-3 h-[420px] overflow-hidden rounded-xl border border-cyan-300/20 bg-[#071013]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,229,255,0.08),transparent_60%),repeating-linear-gradient(90deg,transparent,transparent_29px,rgba(255,255,255,.03)_30px),repeating-linear-gradient(0deg,transparent,transparent_29px,rgba(255,255,255,.03)_30px)]" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <path d="M20 20 L76 22 L80 60 L64 85 L30 82 L15 45 Z" fill="rgba(0,229,255,.07)" stroke="rgba(0,229,255,.35)" />
          <path d="M26 47 L58 43" stroke="#7c4dff" strokeDasharray="1.5 1.5" opacity="0.8" />
          <path d="M32 44 L61 43" stroke="#00e5ff" strokeDasharray="2 1" opacity="0.9" />
          <path d="M61 43 L57 73" stroke="#fec931" strokeDasharray="2 2" opacity="0.9" />
          {countries.map((c) => {
            const p = mapLayout[c.code];
            if (!p) return null;
            const active = c.code === selectedCountryCode;
            return (
              <g key={c.code} onClick={() => onSelectCountry(c.code)} className="cursor-pointer">
                <circle cx={p.x} cy={p.y} r={active ? 3.4 : 2.6} fill={riskColor(c.democraticRiskScore)} opacity={0.9} />
                <circle cx={p.x} cy={p.y} r={active ? 6 : 4.6} fill="none" stroke={riskColor(c.democraticRiskScore)} opacity={active ? 0.8 : 0.4} />
                <text x={p.x + 2} y={p.y - 2} fill="#dce4e5" fontSize="2.8">{c.code}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-cyan-300/20 bg-black/30 p-2 text-xs">Regional overlays: East / West / Southern intelligence lanes</div>
        <div className="rounded-lg border border-yellow-300/20 bg-black/30 p-2 text-xs">Cross-border propagation vectors active</div>
        <div className="rounded-lg border border-rose-300/20 bg-black/30 p-2 text-xs">Continental heatmap weighted by anomaly density</div>
      </div>
    </div>
  );
}
