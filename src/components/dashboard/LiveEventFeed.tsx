"use client";
import { useEffect, useRef } from "react";
import type { StreamAlert } from "@/src/store/electionStreamStore";
export default function LiveEventFeed({ alerts }: { alerts: StreamAlert[] }) {
  const feedRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if(feedRef.current){ feedRef.current.scrollTop = 0; } }, [alerts]);
  return <div ref={feedRef} className="max-h-64 overflow-auto space-y-2 text-xs">{alerts.map((a)=><div key={a.id} className="rounded border border-cyan-300/20 bg-black/40 p-2"><div className="flex justify-between text-cyan-200"><span>{new Date(a.timestamp).toLocaleTimeString()}</span><span>sev {a.severity}</span></div><p className="text-zinc-200">{a.county} · {a.station}</p><p className="text-orange-300">{a.anomalyType}</p></div>)}</div>;
}
