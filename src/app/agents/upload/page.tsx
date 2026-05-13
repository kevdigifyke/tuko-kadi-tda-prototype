"use client";

import { AppShell } from "@/src/components/shell/AppShell";
import confidenceRegions from "@/src/data/generated/confidence-regions.json";
import documentConflicts from "@/src/data/generated/document-conflicts.json";
import ocrResults from "@/src/data/generated/ocr-results.json";
import { useMemo, useState } from "react";

const stages = ["Image preprocessing", "Edge detection", "Text region scan", "OCR extraction", "Field validation", "Anomaly comparison"];

const tone = (value: number) => (value >= 0.8 ? "text-cyan-200 border-cyan-300/45" : value >= 0.55 ? "text-amber-200 border-amber-300/45" : "text-red-200 border-red-300/45");

export default function Upload() {
  const [docIndex, setDocIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(4);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const doc = ocrResults.documents[docIndex];
  const docRegions = useMemo(() => confidenceRegions.regions.filter((r) => r.documentId === doc.id), [doc.id]);
  const docConflicts = useMemo(() => documentConflicts.conflicts.filter((c) => c.stationCode === doc.stationCode), [doc.stationCode]);

  const instabilityBoost = (1 - doc.ocrConfidence) * 0.5 + docConflicts.length * 0.15;

  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-display">OCR + Computer Vision Sandbox</h1>
          <p className="text-xs text-[#aac0c6]">Prototype-only forensic document intelligence. Not production OCR.</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
          <section className="rounded-2xl border border-white/10 bg-[#0a1318] p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/80">Document inspection</p>
              <div className="flex gap-2 text-xs">
                <button onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))} className="rounded border border-white/20 px-2 py-1">Zoom +</button>
                <button onClick={() => setZoom((z) => Math.max(0.8, z - 0.15))} className="rounded border border-white/20 px-2 py-1">Zoom -</button>
              </div>
            </div>
            <div className="relative h-[560px] overflow-hidden rounded-xl border border-white/10 bg-black/35">
              <img
                src={doc.image}
                alt={doc.stationCode}
                className="h-full w-full object-contain transition"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                onMouseMove={(event) => {
                  if (event.buttons !== 1) return;
                  setPan((p) => ({ x: Math.max(-120, Math.min(120, p.x + event.movementX * 0.6)), y: Math.max(-120, Math.min(120, p.y + event.movementY * 0.6)) }));
                }}
              />
              <svg viewBox="0 0 900 1200" className="pointer-events-none absolute inset-0 h-full w-full">
                {docRegions.map((region) => (
                  <g key={region.id}>
                    <rect x={region.x} y={region.y} width={region.width} height={region.height} fill={region.confidence > 0.8 ? "rgba(74,255,255,.12)" : region.confidence > 0.55 ? "rgba(255,200,96,.12)" : "rgba(255,95,95,.12)"} stroke={region.confidence > 0.8 ? "#71f8ff" : region.confidence > 0.55 ? "#ffd06d" : "#ff7878"} strokeDasharray="8 6" />
                  </g>
                ))}
              </svg>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {docRegions.map((region) => <div key={region.id} className={`rounded-lg border bg-black/20 px-3 py-2 text-xs ${tone(region.confidence)}`}><p>{region.label}</p><p>{Math.round(region.confidence * 100)}% confidence</p></div>)}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">Processing pipeline</p>
              <div className="mt-3 space-y-2">
                {stages.map((stage, idx) => <button key={stage} onClick={() => setStageIndex(idx)} className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm ${idx <= stageIndex ? "border-cyan-300/45 bg-cyan-300/10" : "border-white/10 bg-black/20"}`}><span>{idx + 1}. {stage}</span><span className="text-xs text-[#9db5bd]">{idx < stageIndex ? "Done" : idx === stageIndex ? "Active" : "Queued"}</span></button>)}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">Extracted data + correction sandbox</p>
              <p className="mt-2 text-sm">{doc.stationCode}</p>
              <div className="mt-3 space-y-2 text-sm">
                {doc.fields.candidateTotals.map((row) => <label key={row.name} className="block"><span className="text-xs text-[#9bb0b8]">{row.name}</span><input defaultValue={row.votes} className="mt-1 w-full rounded border border-white/15 bg-[#0a1218] px-2 py-1" /></label>)}
                <label className="block"><span className="text-xs text-[#9bb0b8]">Spoiled votes</span><input defaultValue={doc.fields.spoiledVotes.value} className="mt-1 w-full rounded border border-white/15 bg-[#0a1218] px-2 py-1" /></label>
                <p className="text-xs text-[#89a1a9]">Timestamp: {doc.fields.formTimestamp.value}</p>
                <p className={`rounded border px-2 py-1 text-xs ${tone(doc.ocrConfidence)}`}>OCR confidence: {Math.round(doc.ocrConfidence * 100)}%</p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">Conflict & anomaly collisions</p>
              <div className="mt-3 space-y-2">
                {docConflicts.map((conflict) => <div key={conflict.id} className="rounded-lg border border-red-300/40 bg-red-400/10 p-2 text-xs"><p className="font-semibold">{conflict.type.replaceAll("_", " ")}</p><p>{conflict.description}</p></div>)}
              </div>
              <p className="mt-2 text-xs text-[#a6bac0]">Topology uncertainty boost: +{instabilityBoost.toFixed(2)} | Map marker bias: {docConflicts.length > 0 || doc.ocrConfidence < 0.6 ? "Escalated" : "Stable"}</p>
            </section>

            <div className="flex gap-2">
              {ocrResults.documents.map((item, idx) => <button key={item.id} onClick={() => setDocIndex(idx)} className={`flex-1 rounded-lg border px-3 py-2 text-xs ${idx === docIndex ? "border-cyan-300/55 bg-cyan-300/10" : "border-white/15"}`}>{item.stationCode}</button>)}
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
