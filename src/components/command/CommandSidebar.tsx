"use client";
const modules = ["Geo Intelligence", "AI Risk Models", "Propagation Chains", "Temporal Replay", "National Telemetry", "Incident Alerts"];
export function CommandSidebar() {
  return <aside className="rounded-xl border border-cyan-300/30 bg-black/30 p-4 backdrop-blur-md">
    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-300">Command Modules</p>
    <ul className="space-y-2 text-sm text-zinc-200">{modules.map((m) => <li key={m} className="rounded-md border border-cyan-400/20 bg-cyan-400/5 px-3 py-2">{m}</li>)}</ul>
  </aside>;
}
