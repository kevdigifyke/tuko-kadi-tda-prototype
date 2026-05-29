import { getOperationalSnapshot } from "@/src/components/operations/OperationalData";
import { AppShell } from "@/src/components/shell/AppShell";
import { CommandPanel } from "@/src/components/ui/CommandPanel";
import { MetricCard } from "@/src/components/ui/MetricCard";

export default function Analytics() {
  const snapshot = getOperationalSnapshot([]);
  const anomalyCount = snapshot.summary.counties.reduce((a, c) => a + c.anomalyCount, 0);
  const topRegions = [...snapshot.summary.counties].sort((a, b) => b.ballotsCast - a.ballotsCast).slice(0, 4);
  const issueEntries = Object.entries(snapshot.issueCounts).slice(0, 5);

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="rounded-2xl border border-cyan-300/15 bg-[#080f11] p-5">
          <p className="panel-kicker text-cyan-200">Analytics Workspace</p>
          <h1 className="mt-2 text-display">Election analytics</h1>
          <p className="mt-2 max-w-3xl text-sm text-[#bac9cc]">Turnout, anomaly, regional comparison, and trend exploration using existing generated election data and cluster telemetry.</p>
        </section>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard title="Total votes" value={snapshot.summary.totalBallotsCast.toLocaleString()} />
          <MetricCard title="Turnout analysis" value={`${snapshot.summary.turnoutPercent}%`} />
          <MetricCard title="Anomaly analysis" value={`${anomalyCount}`} tone="salmon" />
          <MetricCard title="Trend clusters" value={`${snapshot.graph.nodes.length}`} tone="yellow" />
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <CommandPanel title="Turnout Analysis" active>
            <div className="space-y-3">
              {topRegions.map((region) => (
                <div key={region.county} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <div className="flex justify-between text-sm"><span className="text-cyan-100">{region.county}</span><span className="text-[#bac9cc]">{region.turnoutPercent}%</span></div>
                  <div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${Math.min(100, region.turnoutPercent)}%` }} /></div>
                </div>
              ))}
            </div>
          </CommandPanel>
          <CommandPanel title="Anomaly Analysis">
            <div className="space-y-2 text-sm text-[#bac9cc]">
              {issueEntries.map(([issue, count]) => <p key={issue} className="rounded-lg border border-white/10 bg-black/20 p-3"><span className="capitalize text-cyan-100">{issue}</span> · {count} clusters</p>)}
            </div>
          </CommandPanel>
          <CommandPanel title="Regional Comparison">
            <div className="grid gap-3 sm:grid-cols-2">
              {snapshot.highRiskCounties.slice(0, 4).map((county) => <div key={county.county} className="rounded-lg bg-black/20 p-3"><p className="font-semibold text-cyan-100">{county.county}</p><p className="text-xs text-[#bac9cc]">{county.anomalyCount} anomalies · {county.ballotsCast.toLocaleString()} ballots</p></div>)}
            </div>
          </CommandPanel>
          <CommandPanel title="Trend Exploration">
            <ul className="space-y-2 text-sm text-[#bac9cc]">
              {snapshot.cognitive.operationalNarrative.map((narrative) => <li key={narrative}>• {narrative}</li>)}
            </ul>
          </CommandPanel>
        </div>
      </div>
    </AppShell>
  );
}
