"use client";
import { AppShell } from "@/src/components/shell/AppShell";
import { useEffect, useMemo, useState } from "react";
import { mockNodes } from "@/src/data/mockGraph";
import { TdaGraph } from "@/src/components/TdaGraph";
import { GesturePanel } from "@/src/components/GesturePanel";
import { EvidencePanel } from "@/src/components/EvidencePanel";
import { TimelineScrubber } from "@/src/components/TimelineScrubber";
import { WarningStrip } from "@/src/components/ui/WarningStrip";

export default function Anomalies(){const [selectedId,setSelectedId]=useState('ne-04');const [isPlaying,setIsPlaying]=useState(true);const selected=useMemo(()=>mockNodes.find(n=>n.id===selectedId)??mockNodes[0],[selectedId]);useEffect(()=>{const onKeyDown=(event:KeyboardEvent)=>{if(event.code==='Space'){event.preventDefault();setIsPlaying((prev)=>!prev);}if(event.key.toLowerCase()==='r')setSelectedId('ne-04');};window.addEventListener('keydown',onKeyDown);return()=>window.removeEventListener('keydown',onKeyDown);},[]);
return <AppShell><div className="space-y-4"><h1 className="text-display">Anomaly Network Command</h1><div className="relative min-h-[calc(100vh-152px)] overflow-hidden rounded-xl border border-white/10 bg-[#080f11] xl:pb-36"><TdaGraph selectedId={selectedId} onSelect={setSelectedId}/><div className="absolute inset-0 hidden xl:block"><div className="absolute left-4 top-4"><GesturePanel/></div><div className="absolute right-4 top-4 w-80 space-y-3"><EvidencePanel cluster={selected}/><WarningStrip text="Cross-race mismatch • Severity elevated"/><WarningStrip text="Late upload spike • Requires review"/></div><div className="absolute bottom-6 left-6 right-6 z-20"><TimelineScrubber isPlaying={isPlaying} onToggle={()=>setIsPlaying(s=>!s)}/></div></div></div><div className="grid gap-3 xl:hidden"><GesturePanel/><EvidencePanel cluster={selected}/><WarningStrip text="Cross-race mismatch • Severity elevated"/><WarningStrip text="Late upload spike • Requires review"/><TimelineScrubber isPlaying={isPlaying} onToggle={()=>setIsPlaying(s=>!s)}/></div></div></AppShell>}
