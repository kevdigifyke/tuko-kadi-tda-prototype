import { AppShell } from "@/src/components/shell/AppShell";

const forms = [
  { name: "Form 34A", scope: "Polling station result image", confidence: "OCR queue placeholder", reviewers: "Station agents" },
  { name: "Form 34B", scope: "Constituency tally package", confidence: "Cross-form validation", reviewers: "Constituency reviewers" },
  { name: "Form 34C", scope: "National aggregation record", confidence: "Executive confidence scoring", reviewers: "National command" },
];
const stages = ["Upload", "Validation", "Confidence Scoring"];

export default function ResultsPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <section className="rounded-2xl border border-cyan-300/15 bg-[#080f11] p-5">
          <p className="panel-kicker text-cyan-200">Results Ingestion Workflow</p>
          <h1 className="mt-2 text-display">Forms 34 intake architecture</h1>
          <p className="mt-2 max-w-3xl text-sm text-[#bac9cc]">Placeholder workflow for form upload, validation, and confidence scoring without replacing existing telemetry, replay, geo, transparency, or research layers.</p>
        </section>
        <div className="grid gap-4 lg:grid-cols-3">
          {forms.map((form) => (
            <section key={form.name} className="command-card p-4">
              <p className="panel-kicker text-cyan-200">{form.name}</p>
              <h2 className="mt-2 text-h2">{form.scope}</h2>
              <p className="mt-3 text-sm text-[#bac9cc]">{form.confidence}</p>
              <p className="mt-1 text-xs text-[#bac9cc]">Review lane: {form.reviewers}</p>
              <div className="mt-5 space-y-3">
                {stages.map((stage, index) => (
                  <div key={stage} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-cyan-300/30 text-xs text-cyan-100">{index + 1}</span>
                    <div><p className="font-semibold text-cyan-100">{stage}</p><p className="text-xs text-[#bac9cc]">Placeholder stage ready for implementation.</p></div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
