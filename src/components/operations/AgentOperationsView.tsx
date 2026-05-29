const workflows = [
  { title: "Upload Form", status: "Ready", description: "Submit Form 34 images for OCR-assisted human validation.", fields: ["Station ID", "Form type", "Image bundle"] },
  { title: "Submit Observation", status: "Mock intake", description: "Capture field notes, queue pressure, accessibility constraints, and turnout context.", fields: ["County", "Ward", "Observation note"] },
  { title: "Report Incident", status: "Escalation draft", description: "Create an incident report routed to evidence review and operational summaries.", fields: ["Incident class", "Severity", "Supporting artifact"] },
];

export function AgentOperationsView() {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-cyan-300/15 bg-[#080f11] p-5">
        <p className="panel-kicker text-cyan-200">Agent Operations Portal</p>
        <h1 className="mt-2 text-display">Field workflow command deck</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#bac9cc]">Restored operational workspace for agent form intake, observation submission, and incident reporting. Workflows are placeholder architecture wired into the application shell.</p>
      </section>
      <div className="grid gap-4 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <section key={workflow.title} className="command-card flex min-h-[360px] flex-col p-4">
            <div className="flex items-start justify-between gap-3">
              <div><p className="panel-kicker text-cyan-200">{workflow.status}</p><h2 className="mt-2 text-h2">{workflow.title}</h2></div>
              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">Phase 29M</span>
            </div>
            <p className="mt-3 text-sm text-[#bac9cc]">{workflow.description}</p>
            <div className="mt-5 rounded-xl border-2 border-dashed border-cyan-300/30 bg-black/25 p-6 text-center text-sm text-cyan-100">Drop artifact or open secure capture</div>
            <div className="mt-4 space-y-3">
              {workflow.fields.map((field) => <div key={field} className="rounded-lg border border-white/10 bg-[#080f11] px-3 py-2 text-sm text-[#bac9cc]">{field}</div>)}
            </div>
            <button className="mt-auto rounded-lg border border-cyan-300/50 bg-cyan-400/15 py-3 font-semibold text-cyan-100">Stage workflow</button>
          </section>
        ))}
      </div>
    </div>
  );
}
