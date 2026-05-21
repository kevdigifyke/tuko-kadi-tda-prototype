"use client";
import { useMemo } from "react";
import { useElectionStreamStore } from "@/src/store/electionStreamStore";
export default function StreamingHUD(){
  const {liveStations, activeAnomalies, lastUpdateTimestamp} = useElectionStreamStore();
  const stations = Object.values(liveStations);
  const nationalRisk = useMemo(()=> stations.length ? Math.round(stations.reduce((a,s)=>a+(s.anomalyScore+s.violenceRisk+s.queuePressure)/3,0)/stations.length) : 0,[stations]);
  const activeClusters = useMemo(()=> new Set(stations.filter((s)=>s.riskColor==="red"||s.riskColor==="orange").map((s)=>s.county)).size,[stations]);
  const latency = lastUpdateTimestamp ? `${Math.max(0, Math.round((Date.now()-new Date(lastUpdateTimestamp).getTime())/1000))}s` : "--";
  return <div className="grid grid-cols-2 gap-2 text-xs">{[["STREAM STATUS","LIVE"],["LIVE NODE COUNT",stations.length],["ACTIVE CLUSTERS",activeClusters],["NATIONAL RISK INDEX",nationalRisk],["SIGNAL LATENCY",latency],["ACTIVE ANOMALIES",activeAnomalies]].map(([k,v])=><div key={String(k)} className="rounded border border-cyan-400/40 bg-[#071014] p-2 shadow-[0_0_16px_rgba(0,255,255,0.15)]"><p className="text-cyan-300">{k}</p><p className="text-zinc-100 font-semibold">{v}</p></div>)}</div>;
}
