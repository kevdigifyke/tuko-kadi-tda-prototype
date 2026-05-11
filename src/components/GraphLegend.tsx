"use client";

export function GraphLegend() {
  return (
    <div className="rounded-md border border-white/15 bg-[#151d1e]/92 p-3 text-[11px] text-[#bac9cc] backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-wide text-[#8fa6ad]">Graph Legend</p>
      <div className="mt-2 space-y-1">
        <p><span className="text-[#ffb4ab]">●</span> High-severity anomaly cluster</p>
        <p><span className="text-[#7defff]">●</span> Related review signal cluster</p>
        <p><span className="text-[#ffdad6]">◌</span> Selected cluster ring</p>
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-[#8fa6ad]">Topology modes</p>
      <div className="mt-1 space-y-1 text-[10px]">
        <p>Centralized: strongest anomaly gravity center</p>
        <p>Decentralized: regional/type hubs</p>
        <p>Distributed: peer-to-peer relationships</p>
      </div>
    </div>
  );
}
