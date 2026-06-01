import { AppShell } from "@/src/components/shell/AppShell";
import { CommandPanel } from "@/src/components/ui/CommandPanel";
import { civicSafeguards } from "@/src/lib/legitimacy/civicSafeguards";
import { ethicsFramework, ethicsSummary } from "@/src/lib/legitimacy/ethicsFramework";
import { methodologySummary, simulationMethodology } from "@/src/lib/legitimacy/simulationMethodology";
import { syntheticDataDocumentation, syntheticDataSummary } from "@/src/lib/legitimacy/syntheticDataDocumentation";

export default function ResearchPage() {
  return (
    <AppShell>
      <div className="platform-page">
        <section className="platform-hero">
          <p className="panel-kicker text-cyan-200">Research Mode</p>
          <h1 className="mt-2 text-display">Research-ready workspace</h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[#bac9cc]">
            Aggregates existing academic assets for synthetic data documentation, simulation methodology, ethics, transparency, civic safeguards, assumptions, limitations, and data-source review.
          </p>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <CommandPanel title="Methodology" active>
            <p className="text-[#bac9cc]">{methodologySummary}</p>
          </CommandPanel>
          <CommandPanel title="Synthetic Data Documentation">
            <p className="text-[#bac9cc]">{syntheticDataSummary.status}. {syntheticDataSummary.indicator}. Provenance: {syntheticDataSummary.provenance}.</p>
          </CommandPanel>
          <CommandPanel title="Ethics Framework">
            <p className="text-[#bac9cc]">{ethicsSummary}</p>
          </CommandPanel>
        </div>

        <div className="platform-grid">
          <CommandPanel title="Assumptions">
            <ul className="space-y-2 text-[#bac9cc]">
              {syntheticDataDocumentation.flatMap((section) => section.assumptions.slice(0, 2)).slice(0, 8).map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </CommandPanel>
          <CommandPanel title="Limitations">
            <ul className="space-y-2 text-[#bac9cc]">
              {syntheticDataDocumentation.flatMap((section) => section.knownLimitations.slice(0, 2)).slice(0, 8).map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </CommandPanel>
          <CommandPanel title="Data Sources">
            <ul className="space-y-2 text-[#bac9cc]">
              {syntheticDataDocumentation.slice(0, 5).map((section) => <li key={section.id}>• {section.title}: {section.description}</li>)}
            </ul>
          </CommandPanel>
          <CommandPanel title="Ethics">
            <ul className="space-y-2 text-[#bac9cc]">
              {ethicsFramework.map((section) => <li key={section.id}>• <span className="text-cyan-100">{section.title}</span>: {section.commitments[0]}</li>)}
            </ul>
          </CommandPanel>
          <CommandPanel title="Transparency Layer">
            <ul className="space-y-2 text-[#bac9cc]">
              {syntheticDataDocumentation.slice(0, 4).map((section) => <li key={section.id}>• {section.intendedUse[0]}</li>)}
            </ul>
          </CommandPanel>
          <CommandPanel title="Civic Safeguards">
            <ul className="space-y-2 text-[#bac9cc]">
              {civicSafeguards.map((section) => <li key={section.id}>• <span className="text-cyan-100">{section.title}</span>: {section.notices[0]}</li>)}
            </ul>
          </CommandPanel>
        </div>

        <section className="command-card p-5">
          <p className="panel-kicker text-cyan-200">Methodology assets</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {simulationMethodology.map((model) => (
              <article key={model.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <h2 className="font-semibold text-cyan-100">{model.modelFamily}</h2>
                <p className="mt-2 text-sm text-[#bac9cc]">{model.purpose}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
