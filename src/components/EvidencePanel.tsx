import { ClusterNode } from "@/src/types/graph";

export function EvidencePanel({ cluster }: { cluster: ClusterNode }) {
  return (
    <section className="floating-panel w-full max-w-[380px] p-5">
      <h2 className="panel-kicker text-[#ffb4ab]">Cluster Details // Nairobi East Pattern 04</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="panel-kicker text-[#bac9cc]">Severity</p>
          <p className="font-mono text-4xl font-bold text-[#ffb4ab]">{cluster.severity}%</p>
        </div>
        <div>
          <p className="panel-kicker text-[#bac9cc]">AI Confidence</p>
          <p className="font-mono text-4xl font-bold text-[#dce4e5]">{cluster.confidence}%</p>
        </div>
      </div>

      <p className="panel-kicker mt-5 text-[#bac9cc]">Active Signals</p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed">
        <div className="border-l-2 border-[#ffb4ab] bg-[#2a1f2a]/60 p-3">
          <p className="font-semibold text-[#dce4e5]">Mismatch Detected</p>
          <p className="text-[#bac9cc]">{cluster.whyFlagged}</p>
        </div>
        <div className="border-l-2 border-[#fec931] bg-[#252819]/60 p-3">
          <p className="font-semibold text-[#dce4e5]">Late Upload Spike</p>
          <p className="text-[#bac9cc]">{cluster.issue}</p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <button className="w-full rounded-md border border-cyan-300/40 bg-cyan-400/10 px-3 py-2 text-left text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20">Geospatial Review</button>
        <button className="w-full rounded-md border border-cyan-300/30 bg-[#151d1e] px-3 py-2 text-left text-sm font-semibold text-[#dce4e5] transition hover:border-cyan-300/60">Expert Verification</button>
        <button className="w-full rounded-md border border-[#ffb4ab]/60 bg-[#93000a]/50 px-3 py-2 text-left text-sm font-semibold text-[#ffb4ab] transition hover:bg-[#93000a]/70">Escalate to Command</button>
      </div>
    </section>
  );
}
