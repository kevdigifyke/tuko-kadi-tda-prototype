import Link from "next/link";

import { AppShell } from "@/src/components/shell/AppShell";
import { CommandPanel } from "@/src/components/ui/CommandPanel";

export default function AboutPage() {
  return (
    <AppShell>
      <div className="platform-page">
        <section className="platform-hero">
          <p className="panel-kicker text-cyan-200">About KuraScope EOIS</p>
          <h1 className="mt-2 text-display">What is KuraScope EOIS?</h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[#bac9cc]">
            KuraScope EOIS is an Election Observatory Intelligence System: a simulation-first geospatial platform for exploring election monitoring interfaces, anomaly visualization, replay workflows, transparency practices, and civic technology safeguards.
          </p>
        </section>
        <div className="platform-grid three">
          <CommandPanel title="Observatory">
            <p className="text-[#bac9cc]">A map-centered workspace that brings synthetic telemetry, replay, propagation visualization, and intelligence summaries into one operational view.</p>
          </CommandPanel>
          <CommandPanel title="Research Prototype">
            <p className="text-[#bac9cc]">The platform is designed for research, education, stakeholder demonstrations, and governance discussions rather than verified election reporting.</p>
          </CommandPanel>
          <CommandPanel title="Public Readiness">
            <p className="text-[#bac9cc]">Phase 30 adds presentation, research, public demo, transparency, and landing experiences so users can understand scope before entering the platform.</p>
          </CommandPanel>
        </div>
        <Link href="/public-demo" className="inline-flex w-fit rounded-full border border-cyan-300/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20">
          Launch Public Demo
        </Link>
      </div>
    </AppShell>
  );
}
