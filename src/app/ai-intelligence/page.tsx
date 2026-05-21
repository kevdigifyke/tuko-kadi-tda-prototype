"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import AIRiskPanel from "@/components/ai/AIRiskPanel";
import { generateLiveRiskUpdate, type LiveRiskUpdate } from "@/lib/ai/liveRiskFeed";
import { pollingStations } from "@/data/geo/pollingStations";
import { predictElectionRisk } from "@/lib/ai/predictiveRiskEngine";

const IEBCBoundaryMap = dynamic(() => import("@/components/maps/IEBCBoundaryMap"), { ssr: false });
const horizons = [1, 3, 6, 12] as const;

export default function AIIntelligencePage() {
  const [projectionHours, setProjectionHours] = useState<(typeof horizons)[number]>(3);
  const [feed, setFeed] = useState<LiveRiskUpdate[]>([]);

  useEffect(() => {
    const id = setInterval(() => setFeed((prev) => [generateLiveRiskUpdate(), ...prev].slice(0, 8)), 3500);
    return () => clearInterval(id);
  }, []);

  const projections = useMemo(() => pollingStations.map((station) => {
    const baseline = predictElectionRisk(station, pollingStations);
    const expansion = Math.min(100, baseline.spreadProbability + projectionHours * 3.8);
    return { station: station.name, projection: expansion, level: baseline.escalationLevel };
  }).sort((a,b)=>b.projection-a.projection), [projectionHours]);

  return <main className="min-h-screen bg-[#020508] p-4 text-white">
    <div className="mb-4 flex items-center justify-between"><h1 className="text-2xl font-bold text-cyan-300">AI Election Intelligence Command</h1><div className="rounded border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs">Predictive temporal mode active</div></div>
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]"><section className="space-y-4"><div className="rounded-2xl border border-cyan-500/30 bg-black/20 p-2"><IEBCBoundaryMap /></div><div className="rounded-2xl border border-fuchsia-500/30 bg-black/30 p-4"><p className="text-sm font-semibold text-fuchsia-300">Temporal Prediction Playback</p><div className="mt-3 flex gap-2">{horizons.map((h)=><button key={h} onClick={()=>setProjectionHours(h)} className={`rounded px-3 py-1 text-xs ${projectionHours===h?"bg-fuchsia-500 text-black":"border border-white/20"}`}>+{h}h</button>)}</div><div className="mt-3 space-y-2 text-xs">{projections.map((row)=><motion.div key={row.station} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="rounded border border-white/10 bg-white/5 p-2"><p>{row.station}</p><p>{row.level} · Forecast spread {row.projection.toFixed(1)}%</p></motion.div>)}</div></div></section><section className="space-y-4"><AIRiskPanel /><div className="rounded-2xl border border-emerald-400/30 bg-[#03070d] p-3"><h2 className="text-sm font-semibold text-emerald-300">Live AI Risk Stream</h2><div className="mt-3 space-y-2 text-xs">{feed.map((item)=><div key={`${item.stationId}-${item.timestamp}`} className="rounded border border-white/10 bg-black/30 p-2"><p>{item.stationName} ({item.county})</p><p>{item.escalationLevel} · Δ{item.riskDelta}% · C{item.confidence}%</p></div>)}</div></div></section></div>
  </main>;
}
