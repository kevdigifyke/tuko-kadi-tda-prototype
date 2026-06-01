import Link from "next/link";

import { AppShell } from "@/src/components/shell/AppShell";
import { CommandPanel } from "@/src/components/ui/CommandPanel";

const demoRoutes = [
  { href: "/observatory", title: "Observatory", description: "Map-first view of synthetic telemetry, replay, and intelligence panels." },
  { href: "/presentation", title: "Presentation", description: "Cinematic guided demonstration using existing simulation systems." },
  { href: "/analytics", title: "Analytics", description: "Turnout, anomaly, regional, and trend summaries over generated election data." },
  { href: "/reports", title: "Reports", description: "Narrative readiness outputs and report workspace." },
];

export default function PublicDemoPage() {
  return (
    <AppShell publicDemo>
      <div className="platform-page">
        <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 p-4 text-amber-50">
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">Demo Environment – Uses Simulated Election Data</p>
        </div>
        <section className="platform-hero">
          <p className="panel-kicker text-cyan-200">Public Demo Mode</p>
          <h1 className="mt-2 text-display">Safe external exploration workspace</h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[#bac9cc]">
            Administrative controls, internal controls, and advanced debugging surfaces are intentionally omitted here. External users can explore the observatory, replay, presentation, and analytics experiences with simulation labels intact.
          </p>
        </section>
        <div className="platform-grid">
          {demoRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="command-card block p-5 transition hover:border-cyan-300/35 hover:bg-cyan-400/5">
              <p className="panel-kicker text-cyan-200">Launch</p>
              <h2 className="mt-2 text-h2 text-white">{route.title}</h2>
              <p className="mt-2 text-sm text-[#bac9cc]">{route.description}</p>
            </Link>
          ))}
        </div>
        <CommandPanel title="What is hidden in Public Demo">
          <div className="grid gap-3 sm:grid-cols-3 text-[#bac9cc]">
            <p>• Administrative controls</p>
            <p>• Internal controls</p>
            <p>• Advanced debugging interfaces</p>
          </div>
        </CommandPanel>
      </div>
    </AppShell>
  );
}
