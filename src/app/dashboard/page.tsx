import IEBCBoundaryMap from "@/src/components/maps/IEBCBoundaryMap";
import { FusionCommandPanel } from "@/src/components/fusion/FusionCommandPanel";
import { AppShell } from "@/src/components/shell/AppShell";
import { buildNationalFusionSummary } from "@/src/lib/fusion/intelligenceFusionEngine";

export default function DashboardPage() {
  const summary = buildNationalFusionSummary();

  return (
    <AppShell>
      <div className="space-y-5">
        <header className="rounded-2xl border border-cyan-400/30 bg-zinc-950/70 p-5">
          <p className="panel-kicker text-cyan-300">National Intelligence Overview</p>
          <h1 className="text-display text-cyan-100">Tuko Kadi Fusion Operations Room</h1>
          <p className="mt-2 text-sm text-zinc-300">Cross-layer election monitoring with anomaly, topology, turnout, and AI-driven risk harmonization.</p>
        </header>

        <FusionCommandPanel summary={summary} />

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-xl border border-fuchsia-400/30 bg-zinc-950/75 p-4 xl:col-span-2">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-fuchsia-200">Cross-layer intelligence map</h2>
            <IEBCBoundaryMap />
          </div>
          <div className="space-y-3 rounded-xl border border-zinc-700 bg-zinc-950/75 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">Risk escalation feed</h2>
            {summary.counties.slice(0, 8).map((county) => (
              <div key={county.county} className="rounded-lg border border-zinc-700 bg-zinc-900/80 p-3 text-xs">
                <p className="font-semibold text-zinc-100">{county.county}</p>
                <p className="text-zinc-300">Fusion {county.fusionScore} • {county.escalationStatus}</p>
                <p className="text-zinc-400">Driver: {county.dominantDriver}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
