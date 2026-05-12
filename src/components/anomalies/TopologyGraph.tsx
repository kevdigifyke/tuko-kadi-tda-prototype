"use client";

import { buildTopologyLayout, type TopologyMode } from "@/src/lib/topologyModes";
import { createPhysicsState, stepSimulation, type SimulationConfig } from "@/src/lib/topologyPhysics";
import type { ClusterEdge, ClusterNode, ClusterEventState } from "@/src/types/graph";
import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  nodes: ClusterNode[];
  edges: ClusterEdge[];
  topologyMode: TopologyMode;
  isPlaying: boolean;
  timelinePhase: number;
  simulationFrozen: boolean;
  frameIndex?: number;
  edgeOpacity?: Record<string, number>;
}
const project = (x: number, y: number) => ({ x: 800 + x * 400, y: 450 + y * 300 });

export function TopologyGraph({ selectedId, onSelect, nodes, edges, topologyMode, isPlaying, timelinePhase, simulationFrozen, frameIndex = 0, edgeOpacity = {} }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [speed, setSpeed] = useState(1);
  const [energyIntensity, setEnergyIntensity] = useState(0.8);
  const [stabilization, setStabilization] = useState(0.9);
  const [frozenOverride, setFrozenOverride] = useState(false);
  const anchorRef = useRef<Record<string, { x: number; y: number }>>({});
  const physicsRef = useRef(createPhysicsState(nodes));

  const adjacency = useMemo(() => {
    const adj: Record<string, Set<string>> = Object.fromEntries(nodes.map((n) => [n.id, new Set<string>()]));
    edges.forEach((e) => { adj[e.source]?.add(e.target); adj[e.target]?.add(e.source); });
    return adj;
  }, [nodes, edges]);

  useEffect(() => { anchorRef.current = buildTopologyLayout(nodes, edges, topologyMode); }, [nodes, edges, topologyMode]);
  useEffect(() => { physicsRef.current = createPhysicsState(nodes); }, [nodes]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      anchorRef.current = buildTopologyLayout(nodes, edges, topologyMode);
      const cfg: SimulationConfig = { speed, energyIntensity, stabilization, frozen: simulationFrozen || frozenOverride, timelineEnergy: isPlaying ? timelinePhase * 0.7 : timelinePhase * 0.4 };
      physicsRef.current = stepSimulation(physicsRef.current, nodes, edges, anchorRef.current, topologyMode, dt, cfg);
      setPositions(Object.fromEntries(Object.values(physicsRef.current).map((n) => [n.id, { x: n.x, y: n.y }])));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [nodes, edges, topologyMode, speed, energyIntensity, stabilization, simulationFrozen, frozenOverride, isPlaying, timelinePhase]);

  const focusSet = selectedId ? new Set([selectedId, ...(adjacency[selectedId] ? [...adjacency[selectedId]] : [])]) : null;
  const statePulse = (state?: ClusterEventState) => state === "emerging" ? 1 + Math.abs(Math.sin(timelinePhase * Math.PI * 4)) * 0.45 : state === "escalating" ? 1 + Math.abs(Math.sin(timelinePhase * Math.PI * 3)) * 0.3 : state === "dissipating" ? 0.8 + Math.abs(Math.cos(timelinePhase * Math.PI * 2)) * 0.12 : 1;

  return <div className="absolute inset-0 overflow-hidden bg-[#080f11]"><svg viewBox="0 0 1600 900" className="h-full w-full">
    <defs><radialGradient id="energyPulse"><stop offset="0%" stopColor="#ff8f6f" stopOpacity="0.22" /><stop offset="100%" stopColor="#ff8f6f" stopOpacity="0" /></radialGradient></defs>
    {nodes.filter((n) => n.type === "anomaly").map((node) => { const pos = positions[node.id]; if (!pos) return null; const p = project(pos.x, pos.y); const r = 55 + node.severity * 85 + timelinePhase * 42; return <circle key={`pulse-${node.id}`} cx={p.x} cy={p.y} r={r} fill="url(#energyPulse)" opacity={0.3 * energyIntensity} />; })}
    {edges.map((edge) => { const a = positions[edge.source]; const b = positions[edge.target]; if (!a || !b) return null; const p1 = project(a.x, a.y); const p2 = project(b.x, b.y); const mx = (p1.x + p2.x) / 2; const my = (p1.y + p2.y) / 2 - 24; const focused = !!(focusSet && focusSet.has(edge.source) && focusSet.has(edge.target)); const fade = edgeOpacity[edge.id] ?? 1; return <path key={edge.id} d={`M${p1.x},${p1.y} Q${mx},${my} ${p2.x},${p2.y}`} stroke={focused ? "#91ecff" : "#3f6e84"} strokeWidth={focused ? 1.7 : 1} strokeOpacity={(focused ? 0.8 : 0.25) * fade} fill="none" />; })}
    {edges.slice(0, 20).map((edge, i) => { const a = positions[edge.source]; const b = positions[edge.target]; if (!a || !b) return null; const p1 = project(a.x, a.y); const p2 = project(b.x, b.y); const t = (timelinePhase * 1.7 + i * 0.09) % 1; const x = p1.x + (p2.x - p1.x) * t; const y = p1.y + (p2.y - p1.y) * t; return <circle key={`flow-${edge.id}`} cx={x} cy={y} r={1.6} fill="#8ce8ff" opacity={0.25} />; })}
    {nodes.map((node) => { const pos = positions[node.id]; if (!pos) return null; const p = project(pos.x, pos.y); const selected = node.id===selectedId; const hovered = node.id===hoveredId; const focused = !focusSet || focusSet.has(node.id); const dim = focused ? 1 : 0.2; const color = node.type === "anomaly" ? "#ff9387" : "#76e9ff"; const pulse = statePulse(node.eventState); const coreScale = 0.9 + node.severity * 0.06; return <g key={node.id} className="cursor-pointer transition-opacity" onMouseEnter={()=>setHoveredId(node.id)} onMouseLeave={()=>setHoveredId(null)} onClick={()=>onSelect(node.id)}>
      <circle cx={p.x} cy={p.y} r={node.size * (4 + node.severity * 1.5) * pulse} fill={color} fillOpacity={(hovered||selected?0.18:0.07)*dim} />
      <circle cx={p.x} cy={p.y} r={node.size * 1.2 * coreScale * 0.1} fill={color} fillOpacity={0.92*dim} />
      {selected && <circle cx={p.x} cy={p.y} r={node.size*5*pulse} stroke="#ffb4ab" strokeDasharray="4 6" fill="none" />}
    </g>; })}
  </svg>
  <div className="absolute bottom-4 right-4 z-20 w-44 rounded-lg border border-cyan-300/30 bg-[#0c1214]/60 p-2 text-[10px] text-[#c8d5d9] backdrop-blur"><p className="font-semibold text-cyan-100">Simulation • F{frameIndex + 1}</p>
    <label className="mt-1 block">Speed <input type="range" min={0.4} max={2} step={0.1} value={speed} onChange={(e)=>setSpeed(Number(e.target.value))} className="w-full"/></label>
    <label className="mt-1 block">Energy <input type="range" min={0.2} max={1.8} step={0.1} value={energyIntensity} onChange={(e)=>setEnergyIntensity(Number(e.target.value))} className="w-full"/></label>
    <label className="mt-1 block">Stability <input type="range" min={0.4} max={1.4} step={0.1} value={stabilization} onChange={(e)=>setStabilization(Number(e.target.value))} className="w-full"/></label>
    <button type="button" onClick={() => setFrozenOverride((v) => !v)} className="mt-2 w-full rounded border border-cyan-300/40 px-2 py-1 text-[10px]">{simulationFrozen || frozenOverride ? "Unfreeze" : "Freeze"}</button>
  </div></div>;
}
