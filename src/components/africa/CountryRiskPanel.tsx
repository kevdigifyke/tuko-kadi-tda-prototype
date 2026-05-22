import type { AfricanCountryElectionData } from "@/src/data/africa/mockAfricanElectionData";

type Props = { country: AfricanCountryElectionData };

const scoreTone = (value: number) => (value >= 70 ? "text-rose-300" : value >= 50 ? "text-yellow-300" : "text-cyan-300");

export function CountryRiskPanel({ country }: Props) {
  const metrics = [
    ["Stability Index", country.stabilityIndex],
    ["Election Volatility", country.electionVolatility],
    ["Anomaly Density", country.anomalyDensity],
    ["Democratic Risk Score", country.democraticRiskScore],
  ] as const;

  return <section className="command-card p-4"><h3 className="panel-kicker text-cyan-200">Country risk panel · {country.country}</h3><div className="mt-3 grid gap-3 sm:grid-cols-2">{metrics.map(([label, value]) => <div key={label} className="rounded-lg border border-white/10 bg-black/25 p-3"><p className="text-xs text-[#bac9cc]">{label}</p><p className={`mt-1 text-data-lg ${scoreTone(value)}`}>{value}</p></div>)}</div><div className="mt-3 rounded-lg border border-white/10 bg-black/25 p-3"><p className="panel-kicker text-[#bac9cc]">Active election alerts</p><ul className="mt-2 space-y-1 text-sm">{country.activeAlerts.map((a) => <li key={a} className="text-[#dce4e5]">• {a}</li>)}</ul></div></section>;
}
