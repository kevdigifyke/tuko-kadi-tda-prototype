import { ClusterNode } from "@/src/types/graph";

export function EvidencePanel({ cluster }: { cluster: ClusterNode }) {
  return (
    <section className="w-full rounded-2xl border border-white/12 bg-[linear-gradient(180deg,rgba(23,32,34,.72),rgba(10,16,19,.93))] p-5 shadow-[0_20px_45px_rgba(0,0,0,.35)] backdrop-blur xl:w-[360px] xl:max-h-[calc(100vh-360px)] xl:overflow-y-auto">
      <h2 className="panel-kicker text-[#ffa39e]">Cluster Details // Nairobi East Pattern 04</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div><p className="panel-kicker text-[#7e8d9a]">Severity</p><p className="font-ui text-4xl font-bold text-[#ffa39e]">{cluster.severity}%</p></div>
        <div><p className="panel-kicker text-[#7e8d9a]">AI Confidence</p><p className="font-ui text-4xl font-bold text-[#e5f6f8]">{cluster.confidence}%</p></div>
      </div>
      <p className="panel-kicker mt-5 text-[#7e8d9a]">Active Signals</p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed">
        <div className="border-l-2 border-[#ff8a80] bg-[#2a1f2a]/60 p-3"><p className="font-ui font-bold text-[#e5f6f8]">Mismatch Detected</p><p className="text-[#b8c1c8]">{cluster.whyFlagged}</p></div>
        <div className="border-l-2 border-[#ffd600] bg-[#252819]/60 p-3"><p className="font-ui font-bold text-[#e5f6f8]">Latency Spike</p><p className="text-[#b8c1c8]">{cluster.issue}</p></div>
      </div>
      <div className="mt-6 space-y-2">
        <button className="cta-btn">Geospatial Review</button>
        <button className="cta-btn">Expert Verification</button>
        <button className="cta-btn-alert">Escalate to Command</button>
      </div>
    </section>
  );
}
