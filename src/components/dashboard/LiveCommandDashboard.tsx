"use client";
import { useEffect, useMemo } from "react";
import { startElectionStream, stopElectionStream, subscribeToElectionStream } from "@/src/lib/streaming/electionStreamEngine";
import { useElectionStreamStore } from "@/src/store/electionStreamStore";
import LiveEventFeed from "./LiveEventFeed";
import StreamingHUD from "./StreamingHUD";

export default function LiveCommandDashboard(){
  const { liveStations, alerts, activeAnomalies, updateStation, pushAlert } = useElectionStreamStore();
  useEffect(()=>{ const unsub = subscribeToElectionStream((event)=>{ updateStation(event.station); event.alerts.forEach(pushAlert); }); startElectionStream(); return ()=>{unsub(); stopElectionStream();}; },[updateStation,pushAlert]);
  const stations = Object.values(liveStations);
  const turnout = useMemo(()=> stations.length ? Math.round(stations.reduce((a,s)=>a+s.turnout,0)/stations.length) : 0,[stations]);
  const rankings = useMemo(()=> Object.entries(stations.reduce((acc,s)=>{acc[s.county]=(acc[s.county]??0)+((s.anomalyScore+s.violenceRisk)/2); return acc;},{} as Record<string,number>)).sort((a,b)=>b[1]-a[1]).slice(0,4),[stations]);
  return <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]"><div className="space-y-4"><div className="rounded border border-cyan-300/30 bg-[#050c0f] p-3"><p className="text-xs text-cyan-300">NATIONAL TURNOUT TICKER</p><p className="text-3xl font-bold text-cyan-100 tabular-nums">{turnout}%</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded border border-orange-300/30 bg-black/40 p-3"><p className="text-xs text-orange-200">ACTIVE ANOMALY COUNTER</p><p className="text-2xl text-orange-100">{activeAnomalies}</p></div><div className="rounded border border-red-300/30 bg-black/40 p-3"><p className="text-xs text-red-200">INCOMING ALERTS PANEL</p><p className="text-2xl text-red-100">{alerts.length}</p></div></div><div className="rounded border border-cyan-300/30 bg-black/30 p-3"><p className="text-xs text-cyan-300 mb-2">RISK COUNTY RANKING</p>{rankings.map(([county,score])=><div key={county} className="flex justify-between text-sm border-b border-white/5 py-1"><span>{county}</span><span>{Math.round(score)}</span></div>)}</div></div><div className="space-y-4"><StreamingHUD /><div className="rounded border border-cyan-300/20 bg-black/40 p-3"><p className="text-xs text-cyan-300 mb-2">LIVE EVENT FEED</p><LiveEventFeed alerts={alerts} /></div></div></section>;
}
