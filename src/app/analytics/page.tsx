import { AppShell } from "@/src/components/shell/AppShell";
import { CommandPanel } from "@/src/components/ui/CommandPanel";
import { MetricCard } from "@/src/components/ui/MetricCard";
import { getClusterGraph, getElectionSummary } from "@/src/lib/generatedElectionData";

export default function Analytics() {
  const summary = getElectionSummary();
  const anomalyCount = summary.counties.reduce((a, c) => a + c.anomalyCount, 0);
  const graph = getClusterGraph();
  const issueCounts = graph.nodes.reduce(
    (acc, node) => {
      if (node.primaryIssue === "cross-race mismatch") acc.crossRace += 1;
      if (node.primaryIssue === "late upload spike") acc.lateUpload += 1;
      if (node.primaryIssue === "source disagreement") acc.sourceDisagreement += 1;
      if (node.primaryIssue === "low OCR confidence") acc.lowOcr += 1;
      return acc;
    },
    { crossRace: 0, lateUpload: 0, sourceDisagreement: 0, lowOcr: 0 },
  );

  return <AppShell><div className="space-y-4"><h1 className="text-display">Election Analytics</h1><p className="text-body text-[#bac9cc]">Synthetic anomaly analytics for review prioritization.</p><p className="text-xs text-[#bac9cc]">Synthetic demo data only. Flagged anomalies require human review.</p><div className="grid gap-4 md:grid-cols-4"><MetricCard title="Total votes" value={summary.totalBallotsCast.toLocaleString()} /><MetricCard title="Turnout %" value={`${summary.turnoutPercent}%`} /><MetricCard title="Clusters flagged" value={`${graph.nodes.length}`} tone="salmon" /><MetricCard title="Anomaly count" value={`${anomalyCount}`} tone="salmon" /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><MetricCard title="Cross-race mismatch" value={`${issueCounts.crossRace}`} /><MetricCard title="Late upload spike" value={`${issueCounts.lateUpload}`} /><MetricCard title="Source disagreement" value={`${issueCounts.sourceDisagreement}`} /><MetricCard title="Low OCR confidence" value={`${issueCounts.lowOcr}`} /></div><CommandPanel title="Anomaly review posture" active><ul className="space-y-2 text-sm text-[#bac9cc]"><li>Flagged clusters remain synthetic and non-adjudicative.</li><li>Source mismatch and cross-race mismatch signals indicate irregularity only.</li><li>Human review recommended before any escalation decisions.</li></ul></CommandPanel></div></AppShell>;
}
