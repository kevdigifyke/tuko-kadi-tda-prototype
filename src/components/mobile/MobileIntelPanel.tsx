import IncidentFeed from "./IncidentFeed";
import { mockFieldReports, mockObservers, regionalCoverageGaps } from "@/data/mobile/mockFieldReports";

export default function MobileIntelPanel() {
  const activeObservers = mockObservers.filter((observer) => observer.status === "active").length;
  const inactiveObservers = mockObservers.length - activeObservers;

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-3 md:p-4">
      <header className="rounded-2xl border border-cyan-600/25 bg-gradient-to-br from-cyan-900/30 to-zinc-900 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Field Intelligence Layer</p>
        <h1 className="mt-1 text-xl font-bold text-zinc-100 md:text-2xl">Mobile Election Operations Console</h1>
        <p className="mt-1 text-xs text-zinc-300">Real-time ground reporting, observer check-ins, and tactical response.</p>
      </header>

      <section className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3"><p className="text-xs text-zinc-300">Active Observers</p><p className="text-lg font-bold text-emerald-300">{activeObservers}</p></div>
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3"><p className="text-xs text-zinc-300">Inactive Observers</p><p className="text-lg font-bold text-zinc-100">{inactiveObservers}</p></div>
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-3"><p className="text-xs text-zinc-300">Coverage Gaps</p><p className="text-lg font-bold text-orange-300">{regionalCoverageGaps.length}</p></div>
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3"><p className="text-xs text-zinc-300">Reports Inbound</p><p className="text-lg font-bold text-cyan-300">{mockFieldReports.length}</p></div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
          <h2 className="text-sm font-semibold text-zinc-100">Field Submission</h2>
          <input className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-sm" placeholder="Polling station lookup" />
          <select className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-sm"><option>Incident category</option><option>violence</option><option>intimidation</option><option>delayed opening</option><option>ballot shortages</option><option>network disruption</option><option>suspicious turnout spikes</option></select>
          <textarea className="h-24 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-sm" placeholder="Field incident report" />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-sm" placeholder="Geo-tag lat" />
            <input className="rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-sm" placeholder="Geo-tag lng" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-xs">Media Upload Placeholder</button>
            <input className="rounded-lg border border-zinc-700 bg-zinc-950 p-2 text-sm" placeholder="Turnout %" />
          </div>
          <button className="w-full rounded-lg bg-cyan-500/90 p-2 text-sm font-semibold text-black">Transmit Report</button>
        </div>
        <IncidentFeed reports={mockFieldReports} />
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3">
        <h2 className="mb-2 text-sm font-semibold">Observer Status Tracking</h2>
        <div className="space-y-2 text-xs">
          {mockObservers.map((observer) => (
            <div key={observer.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 p-2">
              <div>
                <p className="font-semibold text-zinc-100">{observer.name}</p>
                <p className="text-zinc-400">{observer.county} • {observer.constituency}</p>
              </div>
              <div className="text-right">
                <p className={observer.status === "active" ? "text-emerald-300" : "text-zinc-400"}>{observer.status}</p>
                <p className="text-zinc-500">{new Date(observer.lastCheckIn).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-orange-500/30 bg-orange-500/10 p-2 text-xs">
          <p className="font-semibold text-orange-300">Regional Coverage Gaps</p>
          <p className="text-zinc-300">{regionalCoverageGaps.join(" • ")}</p>
        </div>
      </section>
    </main>
  );
}
