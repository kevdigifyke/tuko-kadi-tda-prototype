import { ElectionGraph } from "@/src/lib/graph/nationalGraphEngine";

interface Props {
  graph: ElectionGraph;
  centrality: Array<{ nodeId: string; label: string; centrality: number }>;
  propagationSpeed: number;
  anomalyChains: number;
}

export default function GraphIntelligencePanel({ graph, centrality, propagationSpeed, anomalyChains }: Props) {
  const highestInfluence = [...graph.nodes].sort((a, b) => b.influence - a.influence).slice(0, 5);
  const networkDensity = (2 * graph.edges.length) / Math.max(graph.nodes.length * (graph.nodes.length - 1), 1);

  return (
    <aside className="rounded-xl border border-cyan-400/20 bg-black/30 p-4 text-sm text-cyan-100">
      <h2 className="text-lg font-semibold text-cyan-200">Graph Intelligence</h2>
      <p className="mt-2">Propagation speed: <span className="text-cyan-300">{propagationSpeed.toFixed(2)} hops/s</span></p>
      <p>Network density: <span className="text-cyan-300">{networkDensity.toFixed(4)}</span></p>
      <p>Coordinated anomaly regions: <span className="text-rose-300">{anomalyChains}</span></p>

      <h3 className="mt-4 font-semibold text-cyan-300">Highest Influence Nodes</h3>
      <ul className="mt-1 space-y-1">
        {highestInfluence.map((node) => <li key={node.id}>{node.label} · {node.influence.toFixed(2)}</li>)}
      </ul>

      <h3 className="mt-4 font-semibold text-cyan-300">Centrality Rankings</h3>
      <ol className="mt-1 list-decimal pl-4 space-y-1">
        {centrality.slice(0, 5).map((node) => <li key={node.nodeId}>{node.label} · {node.centrality.toFixed(2)}</li>)}
      </ol>
    </aside>
  );
}
