import { ClusterNode } from "@/src/types/graph";

export function EvidencePanel({ cluster }: { cluster: ClusterNode }) {
  return (
    <section className="panel-glow rounded-2xl border border-purple-300/20 bg-[#121922] p-4">
      <h2 className="font-tech mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#b197fc]">Evidence Panel</h2>
      <div className="rounded-xl border border-slate-700/80 bg-[#0f161d] p-3">
        <h3 className="font-tech text-lg text-white">{cluster.label}</h3>
        <p className="mt-1 text-sm text-[#bac9cc]">Status: <span className="text-[#ff8a65]">Flagged · Requires review</span></p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-red-300/30 bg-red-500/10 p-2"><p className="text-[#bac9cc]">Severity</p><p className="font-tech text-base text-[#ff6f52]">{cluster.severity}%</p></div>
        <div className="rounded-lg border border-yellow-300/35 bg-yellow-500/10 p-2"><p className="text-[#bac9cc]">Confidence</p><p className="font-tech text-base text-[#ffd866]">{cluster.confidence}%</p></div>
        <div className="rounded-lg border border-slate-600 bg-[#111922] p-2"><p className="text-[#bac9cc]">Affected stations</p><p className="font-tech text-base text-white">{cluster.stations}</p></div>
        <div className="rounded-lg border border-slate-600 bg-[#111922] p-2"><p className="text-[#bac9cc]">Affected wards</p><p className="font-tech text-base text-white">{cluster.wards}</p></div>
      </div>
      <div className="mt-3 rounded-xl border border-purple-400/20 bg-purple-900/10 p-3">
        <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-[#c2a7ff]">Why flagged</p>
        <p className="mt-1.5 text-sm text-[#dce4e5]">{cluster.whyFlagged}</p>
      </div>
      <div className="mt-3 rounded-xl border border-slate-700 bg-[#0f161d] p-3">
        <p className="font-tech mb-2 text-[11px] uppercase tracking-[0.16em] text-[#bac9cc]">Observed signals</p>
        <ul className="space-y-1.5 text-sm text-[#bac9cc]">
          {cluster.signals.map((signal) => <li key={signal}>• {signal}</li>)}
        </ul>
      </div>
      <p className="mt-3 text-xs text-[#bac9cc]">Primary issue: <span className="text-white">{cluster.issue}</span></p>
      <div className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
        <button className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-[#00e5ff]">View source forms</button>
        <button className="rounded-lg border border-purple-400/30 bg-purple-500/10 px-3 py-2 text-[#c2a7ff]">Compare on map</button>
        <button className="rounded-lg border border-green-400/30 bg-green-500/10 px-3 py-2 text-[#6dff9f]">Route for review</button>
      </div>
    </section>
  );
}
