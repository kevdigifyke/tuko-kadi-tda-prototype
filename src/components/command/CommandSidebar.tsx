"use client";

export default function CommandSidebar() {
  return (
    <div className="h-full bg-black border-r border-zinc-800 p-4 space-y-4">
      <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">
        National Intelligence
      </h2>

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
        <h3 className="text-sm font-semibold text-white">
          AI Risk Engine
        </h3>

        <p className="text-xs text-zinc-400 mt-2">
          Monitoring national anomaly propagation patterns.
        </p>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
        <h3 className="text-sm font-semibold text-white">
          TDA Intelligence
        </h3>

        <p className="text-xs text-zinc-400 mt-2">
          Persistent topology structures actively updating.
        </p>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
        <h3 className="text-sm font-semibold text-white">
          Simulation Engine
        </h3>

        <p className="text-xs text-zinc-400 mt-2">
          Synthetic election scenario replay active.
        </p>
      </div>
    </div>
  );
}