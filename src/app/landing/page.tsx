import Link from "next/link";

import { AppShell } from "@/src/components/shell/AppShell";

const capabilities = ["Geospatial observatory", "Replay cognition", "Telemetry evolution", "Analytics workspace", "Research documentation", "Public demo safeguards"];

export default function LandingPage() {
  return (
    <AppShell>
      <div className="platform-page">
        <section className="platform-hero overflow-hidden">
          <p className="panel-kicker text-cyan-200">KuraScope EOIS</p>
          <h1 className="mt-3 max-w-5xl text-display">Election Observatory Intelligence System for simulation-first civic technology demonstrations.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#bac9cc]">
            A coherent entry experience for stakeholders, researchers, civic technology audiences, and public demo users to understand the platform before launching operational workspaces.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-200">Launch Platform</Link>
            <Link href="/public-demo" className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20">Open Public Demo</Link>
          </div>
        </section>
        <section className="command-card p-5">
          <p className="panel-kicker text-cyan-200">Platform Overview</p>
          <h2 className="mt-2 text-h2">A unified application layer for the existing intelligence stack</h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[#bac9cc]">
            Phase 30 does not add new intelligence engines. It organizes the existing observatory, replay, telemetry, analytics, evidence, reports, and research assets into a navigable product experience.
          </p>
        </section>
        <section className="platform-grid three">
          {capabilities.map((capability) => (
            <article key={capability} className="command-card p-5">
              <p className="panel-kicker text-cyan-200">Capability</p>
              <h3 className="mt-2 font-semibold text-white">{capability}</h3>
            </article>
          ))}
        </section>
        <section className="command-card p-5">
          <p className="panel-kicker text-cyan-200">Research</p>
          <p className="mt-2 text-sm leading-relaxed text-[#bac9cc]">Research mode aggregates methodology, assumptions, limitations, data-source explanations, ethics framework, transparency layer, and civic safeguards.</p>
          <Link href="/research" className="mt-4 inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-400/10">Explore Research Workspace</Link>
        </section>
      </div>
    </AppShell>
  );
}
