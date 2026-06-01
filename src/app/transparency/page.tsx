import { AppShell } from "@/src/components/shell/AppShell";
import { CommandPanel } from "@/src/components/ui/CommandPanel";
import { civicSafeguards, safeguardsSummary } from "@/src/lib/legitimacy/civicSafeguards";
import { ethicsSummary } from "@/src/lib/legitimacy/ethicsFramework";
import { syntheticDataDocumentation, syntheticDataSummary } from "@/src/lib/legitimacy/syntheticDataDocumentation";

export default function TransparencyPage() {
  return (
    <AppShell>
      <div className="platform-page">
        <section className="platform-hero">
          <p className="panel-kicker text-cyan-200">Transparency</p>
          <h1 className="mt-2 text-display">Simulated data, limitations, research intent, and ethics</h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[#bac9cc]">
            KuraScope EOIS is visibly labeled as a simulation-first research prototype. This page consolidates the platform disclosure language for public readiness and responsible demonstrations.
          </p>
        </section>
        <div className="grid gap-4 lg:grid-cols-2">
          <CommandPanel title="Simulated Data" active>
            <p className="text-[#bac9cc]">{syntheticDataSummary.status}. {syntheticDataSummary.indicator}. Confidence level: {syntheticDataSummary.confidenceLevel}. Provenance: {syntheticDataSummary.provenance}.</p>
          </CommandPanel>
          <CommandPanel title="Research Intent">
            <p className="text-[#bac9cc]">{syntheticDataSummary.operationalScope}</p>
          </CommandPanel>
          <CommandPanel title="Limitations">
            <ul className="space-y-2 text-[#bac9cc]">
              {syntheticDataDocumentation.flatMap((section) => section.knownLimitations.slice(0, 1)).slice(0, 6).map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </CommandPanel>
          <CommandPanel title="Ethics">
            <p className="text-[#bac9cc]">{ethicsSummary}</p>
          </CommandPanel>
          <CommandPanel title="Civic Safeguards">
            <p className="text-[#bac9cc]">{safeguardsSummary}</p>
          </CommandPanel>
          <CommandPanel title="Public Notices">
            <ul className="space-y-2 text-[#bac9cc]">
              {civicSafeguards.flatMap((section) => section.notices.slice(0, 2)).slice(0, 8).map((notice) => <li key={notice}>• {notice}</li>)}
            </ul>
          </CommandPanel>
        </div>
      </div>
    </AppShell>
  );
}
