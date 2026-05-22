import { africanElectionData, continentalFeed } from "@/src/data/africa/mockAfricanElectionData";

const severityTone: Record<string, string> = {
  low: "text-cyan-300 border-cyan-300/30",
  medium: "text-yellow-300 border-yellow-300/30",
  high: "text-orange-300 border-orange-300/30",
  critical: "text-rose-300 border-rose-300/40",
};

export function ContinentalFeed() {
  return (
    <section className="command-card p-4">
      <h3 className="panel-kicker text-cyan-200">Continental intelligence feed</h3>
      <div className="mt-3 space-y-2">
        {continentalFeed.map((item) => {
          const country = africanElectionData.find((c) => c.code === item.countryCode);
          return <article key={item.id} className="rounded-lg border border-white/10 bg-black/25 p-3"><div className="flex flex-wrap items-center gap-2"><span className={`rounded border px-2 py-0.5 text-xs uppercase ${severityTone[item.severity]}`}>{item.severity}</span><span className="panel-kicker text-[#bac9cc]">{item.category}</span><span className="text-xs text-[#8ea2a7]">{new Date(item.timestamp).toLocaleString()}</span></div><p className="mt-2 text-sm">{item.title}</p><p className="mt-1 text-xs text-[#bac9cc]">{country?.country ?? item.countryCode} · Cross-border influence index {country?.neighboringInfluence ?? "--"}</p></article>;
        })}
      </div>
    </section>
  );
}
