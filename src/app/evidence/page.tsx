import { EvidencePanel } from "@/src/components/EvidencePanel";
import { AppShell } from "@/src/components/shell/AppShell";
import { getDefaultCluster } from "@/src/lib/generatedElectionData";

const collections = [
  { title: "Forms", count: 34, detail: "Form 34A/34B/34C artifacts staged for validation." },
  { title: "Reports", count: 12, detail: "Operational and incident narratives awaiting review." },
  { title: "Observations", count: 48, detail: "Agent observations connected to geography and signal pressure." },
  { title: "Telemetry Artifacts", count: 25, detail: "Replay, anomaly, and civic signal traces from the telemetry engine." },
];

export default function EvidencePage() {
  const cluster = getDefaultCluster();

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="rounded-2xl border border-cyan-300/15 bg-[#080f11] p-5">
          <p className="panel-kicker text-cyan-200">Evidence Explorer</p>
          <h1 className="mt-2 text-display">Reviewable artifact workspace</h1>
          <p className="mt-2 max-w-3xl text-sm text-[#bac9cc]">Mock evidence architecture organized around forms, reports, observations, and telemetry artifacts for future chain-of-custody workflows.</p>
        </section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {collections.map((collection) => (
            <section key={collection.title} className="command-card p-4">
              <p className="panel-kicker text-cyan-200">{collection.title}</p>
              <p className="mt-3 text-data-lg text-cyan-100">{collection.count}</p>
              <p className="mt-3 text-sm text-[#bac9cc]">{collection.detail}</p>
              <div className="mt-5 h-24 rounded-lg border border-dashed border-cyan-300/25 bg-black/25" />
            </section>
          ))}
        </div>
        <section className="command-card p-4">
          <p className="panel-kicker text-cyan-200">Reused cluster evidence component</p>
          <div className="mt-4 max-w-[420px]">
            <EvidencePanel cluster={cluster} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
