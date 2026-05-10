import { AppShell } from "@/src/components/shell/AppShell";
import { CommandPanel } from "@/src/components/ui/CommandPanel";
import { WarningStrip } from "@/src/components/ui/WarningStrip";
import { getStationSample } from "@/src/lib/generatedElectionData";
import { candidates } from "@/src/data/demoElectionData";

export default async function Station({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getStationSample(id);

  return <AppShell><div className="space-y-4"><h1 className="text-display">{s.stationName}</h1><p className="text-body text-[#bac9cc]">{s.ward}, {s.constituency} · {s.county}</p><p className="text-xs text-[#bac9cc]">Synthetic demo data. Not official election results.</p>
    <CommandPanel title="Cross-race consistency (synthetic)"><table className="w-full text-sm"><thead><tr className="text-left text-xs text-[#8fa6ad]"><th>Race</th><th className="text-right">Total</th><th className="text-right">MCA gap</th><th className="text-right">Risk</th></tr></thead><tbody>{s.raceMismatchDetails.map((r)=><tr key={r.race} className="border-b border-white/10"><td className="py-2 capitalize">{r.race}</td><td className="py-2 text-right">{s.raceTotals[r.race as keyof typeof s.raceTotals]?.toLocaleString?.() ?? "-"}</td><td className="py-2 text-right">{r.voteGapFromMca} ({r.percentGapFromMca}%)</td><td className="py-2 text-right uppercase">{r.riskLevel}</td></tr>)}</tbody></table><p className="mt-3 text-xs text-[#bac9cc]">Turnout anchor: MCA ({s.mcaTurnoutSignal.toLocaleString()}). Cross-race variance score: {s.crossRaceVariance}%.</p></CommandPanel>
    <div className="grid gap-4 xl:grid-cols-2"><CommandPanel title="Result form evidence" active><div className="h-80 rounded-lg border border-cyan-300/30 bg-[linear-gradient(180deg,rgba(0,229,255,.08),transparent),#080f11] p-3"><div className="h-full rounded border border-dashed border-white/20"/></div></CommandPanel><div className="space-y-4"><CommandPanel title="Confidence meter"><p className="text-data-lg text-cyan-200">{100-(s.anomalyFlags[0]?.severity??10)}%</p></CommandPanel><CommandPanel title="Flagged anomalies">{s.anomalyFlags.length? s.anomalyFlags.map((f)=> <WarningStrip key={f.type} text={f.note}/>) : <WarningStrip text="No critical anomalies on sample"/>}<div className="mt-2"><WarningStrip text="Human review recommended"/></div></CommandPanel></div></div>
    <CommandPanel title="Tally breakdown"><table className="w-full text-sm"><tbody>{s.results.map((r)=><tr key={r.candidateId} className="border-b border-white/10"><td className="py-2">{candidates.find((c)=>c.id===r.candidateId)?.name ?? r.candidateId}</td><td className="py-2 text-right text-data-md">{r.votes.toLocaleString()} ({r.percent}%)</td></tr>)}</tbody></table></CommandPanel></div></AppShell>;
}
