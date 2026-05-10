import { ClusterNode } from "@/src/types/graph";

export function EvidencePanel({ cluster }: { cluster: ClusterNode }) {
  return (
    <section className="floating-panel w-full max-w-[380px] p-5 xl:max-h-[calc(100svh-300px)] xl:overflow-y-auto">
      <h2 className="panel-kicker text-[#ffb4ab]">Cluster Intelligence</h2>
      <p className="mt-2 text-sm text-[#bac9cc]">{cluster.explanation}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div><p className="panel-kicker text-[#bac9cc]">Severity</p><p className="font-mono text-3xl font-bold text-[#ffb4ab]">{cluster.severity}%</p></div>
        <div><p className="panel-kicker text-[#bac9cc]">AI Confidence</p><p className="font-mono text-3xl font-bold text-[#dce4e5]">{cluster.confidence}%</p></div>
      </div>

      <div className="mt-4 space-y-1 text-sm text-[#bac9cc]">
        <p><span className="text-[#dce4e5]">Primary issue:</span> {cluster.primaryIssue}</p>
        <p><span className="text-[#dce4e5]">Affected stations:</span> {cluster.stations}</p>
        <p><span className="text-[#dce4e5]">Affected wards:</span> {cluster.wards}</p>
        <p><span className="text-[#dce4e5]">Reviewer status:</span> {cluster.reviewerStatus}</p>
      </div>

      <p className="panel-kicker mt-4 text-[#bac9cc]">Feature summary</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#bac9cc]">{cluster.featureSummary.map((item) => <li key={item}>{item}</li>)}</ul>

      <p className="panel-kicker mt-4 text-[#bac9cc]">Review recommendations</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#bac9cc]">{cluster.reviewRecommendations.map((item) => <li key={item}>{item}</li>)}</ul>

      {cluster.relatedClusterIds.length > 0 && <p className="mt-4 text-xs text-[#9eb2ba]">Related clusters: {cluster.relatedClusterIds.join(", ")}</p>}
    </section>
  );
}
