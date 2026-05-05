import { ClusterNode } from "@/src/types/graph";

export function EvidencePanel({ cluster }: { cluster: ClusterNode }) {
  return (
    <section className="panel-glow rounded-2xl border border-purple-400/20 bg-[#121922] p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#7C4DFF]">Evidence Panel</h2>
      <h3 className="text-lg font-semibold text-white">{cluster.label}</h3>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <p>Severity: <span className="text-[#FF3D00]">{cluster.severity}%</span></p>
        <p>Confidence: <span className="text-[#FFD600]">{cluster.confidence}%</span></p>
        <p>Affected stations: <span className="text-white">{cluster.stations}</span></p>
        <p>Affected wards: <span className="text-white">{cluster.wards}</span></p>
      </div>
      <p className="mt-2 text-sm text-slate-200">Primary issue: <span className="text-white">{cluster.issue}</span></p>
      <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/40 p-3">
        <p className="text-xs uppercase tracking-wide text-[#7C4DFF]">Why flagged</p>
        <p className="mt-1 text-sm text-slate-300">{cluster.whyFlagged}</p>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
        {cluster.signals.map((signal) => <li key={signal}>{signal}</li>)}
      </ul>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <button className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-2 text-[#00E5FF]">View Forms</button>
        <button className="rounded-md border border-purple-400/30 bg-purple-400/10 px-2 py-2 text-[#b197fc]">Compare on Map</button>
        <button className="rounded-md border border-green-400/30 bg-green-400/10 px-2 py-2 text-[#00C853]">Send for Review</button>
      </div>
    </section>
  );
}
