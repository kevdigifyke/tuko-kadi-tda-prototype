import { CommandPanel } from "@/src/components/ui/CommandPanel";
import { getOperationalSnapshot } from "@/src/components/operations/OperationalData";
import { AppShell } from "@/src/components/shell/AppShell";

const reportTypes = ["Intelligence Briefings", "Operational Summaries", "Cognitive Assessments"];

export default function ReportsPage() {
  const snapshot = getOperationalSnapshot([]);

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="rounded-2xl border border-cyan-300/15 bg-[#080f11] p-5">
          <p className="panel-kicker text-cyan-200">Reports Workspace</p>
          <h1 className="mt-2 text-display">Briefing generation console</h1>
          <p className="mt-2 max-w-3xl text-sm text-[#bac9cc]">Cognitive intelligence outputs are surfaced as report-ready draft sections for executive and operational audiences.</p>
        </section>
        <div className="grid gap-4 lg:grid-cols-3">
          {reportTypes.map((type, index) => (
            <CommandPanel key={type} title={type} active={index === 0}>
              <div className="space-y-3 text-sm text-[#bac9cc]">
                <p className="rounded-lg border border-white/10 bg-black/20 p-3">{snapshot.cognitive.tacticalBriefings[index] ?? snapshot.cognitive.operationalNarrative[index]}</p>
                <p className="rounded-lg border border-white/10 bg-black/20 p-3">{snapshot.cognitive.predictiveSummaries[index]}</p>
                <button className="w-full rounded-lg border border-cyan-300/40 bg-cyan-300/10 py-2 text-cyan-100">Draft report</button>
              </div>
            </CommandPanel>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
