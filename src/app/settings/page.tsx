import { AppShell } from "@/src/components/shell/AppShell";

const settings = [
  { title: "Telemetry cadence", value: "Live synthetic stream", detail: "Controls future event generation and replay capture intervals." },
  { title: "Review thresholds", value: "Human-in-the-loop", detail: "Configures OCR confidence and anomaly escalation placeholders." },
  { title: "Access roles", value: "Command / Reviewer / Agent", detail: "Prepares operational permission boundaries for restored UX." },
  { title: "Data governance", value: "Synthetic demo mode", detail: "Keeps transparency and research readiness safeguards visible." },
];

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <section className="rounded-2xl border border-cyan-300/15 bg-[#080f11] p-5">
          <p className="panel-kicker text-cyan-200">Settings</p>
          <h1 className="mt-2 text-display">Platform configuration</h1>
          <p className="mt-2 max-w-3xl text-sm text-[#bac9cc]">Configuration placeholders for operations, review policies, access, and governance. No existing intelligence layer is disabled.</p>
        </section>
        <div className="grid gap-4 md:grid-cols-2">
          {settings.map((setting) => (
            <section key={setting.title} className="command-card p-4">
              <p className="panel-kicker text-cyan-200">{setting.title}</p>
              <h2 className="mt-2 text-h2">{setting.value}</h2>
              <p className="mt-3 text-sm text-[#bac9cc]">{setting.detail}</p>
              <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-cyan-300/70" /></div>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
