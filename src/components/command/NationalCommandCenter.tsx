"use client";

import dynamic from "next/dynamic";
import { Bell, Search, Radio, Play, Pause, PanelLeftClose, PanelRightClose } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import TelemetryFeed from "./TelemetryFeed";
import CommandSidebar from "./CommandSidebar";
import BottomReplayRail from "./BottomReplayRail";
import { useObservatoryStore } from "../../store/useObservatoryStore";

const IEBCBoundaryMap = dynamic(() => import("../maps/IEBCBoundaryMap"), { ssr: false });

const navItems = ["Observatory", "Simulations", "Anomalies", "Analytics", "Maps"];

export default function NationalCommandCenter() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("Observatory");
  const { anomalyCount, activeStations, highRiskRegions, turnoutAverage, liveEventCount, isPlaying, togglePlay, selectedRegion } = useObservatoryStore();

  const cards = [
    ["National anomalies", `${Math.round(anomalyCount)}`],
    ["Active stations", activeStations.toLocaleString()],
    ["AI high-risk regions", `${highRiskRegions}`],
    ["Turnout avg", `${turnoutAverage.toFixed(1)}%`],
    ["Live events", `${liveEventCount}`],
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,.15),transparent_35%),radial-gradient(circle_at_80%_100%,rgba(124,58,237,.14),transparent_38%),#04070b] text-white">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:90px_90px]" />
      <div className="relative z-10 flex h-screen flex-col gap-3 p-3 md:p-4">
        <header className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl">
          <h1 className="mr-3 text-sm font-semibold tracking-[0.18em] text-cyan-200">TUKO KADI · NATIONAL INTELLIGENCE COMMAND</h1>
          <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-200">LIVE</span>
          <span className="rounded-full bg-rose-500/20 px-2 py-1 text-xs text-rose-200">AI Risk Elevated</span>
          <button onClick={togglePlay} className="ml-auto rounded-lg bg-white/10 p-2 hover:bg-white/20">{isPlaying ? <Pause size={16} /> : <Play size={16} />}</button>
          <div className="hidden items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-zinc-300 sm:flex"><Search size={14} />Global Search</div>
          <button className="rounded-lg bg-white/10 p-2 hover:bg-white/20"><Bell size={16} /></button>
          <div className="flex items-center gap-1 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-2 py-1 text-[11px] text-cyan-200"><Radio size={12} />Streaming</div>
        </header>

        <nav className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => <button key={item} onClick={() => setActiveNav(item)} className={`rounded-full px-3 py-1 text-xs ${activeNav === item ? "bg-cyan-400/20 text-cyan-100" : "bg-white/5 text-zinc-300"}`}>{item}</button>)}
        </nav>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {cards.map(([label, value]) => (
            <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">{label}</p>
              <p className="mt-1 text-lg font-semibold text-cyan-100">{value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
          {leftOpen && <div className="min-h-0 w-full lg:w-72"><CommandSidebar /></div>}
          <div className="relative min-h-0 rounded-2xl border border-white/10 bg-black/20 p-2">
            <div className="absolute left-3 top-3 z-[500] flex gap-2">
              <button onClick={() => setLeftOpen((s) => !s)} className="rounded-lg bg-black/50 p-2 backdrop-blur">{leftOpen ? <PanelLeftClose size={14} /> : <PanelLeftClose size={14} className="rotate-180" />}</button>
              <button onClick={() => setRightOpen((s) => !s)} className="rounded-lg bg-black/50 p-2 backdrop-blur">{rightOpen ? <PanelRightClose size={14} /> : <PanelRightClose size={14} className="rotate-180" />}</button>
            </div>
            <div className="absolute right-3 top-3 z-[500] grid w-56 gap-2">
              {[`AI prediction: Elevated volatility in ${selectedRegion}`, "TDA topology: Stable persistent loops", "Propagation: Cluster migration active", `Simulation: ${isPlaying ? "Running" : "Paused"}`].map((text) => (
                <div key={text} className="rounded-xl border border-cyan-300/25 bg-black/45 p-2 text-xs text-cyan-100 backdrop-blur">{text}</div>
              ))}
            </div>
            <IEBCBoundaryMap />
          </div>
          {rightOpen && <div className="min-h-0 w-full lg:w-80"><TelemetryFeed /></div>}
        </div>

        <BottomReplayRail />
      </div>
    </div>
  );
}
