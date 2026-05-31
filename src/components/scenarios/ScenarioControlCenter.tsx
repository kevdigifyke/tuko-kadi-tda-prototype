"use client";

import { presentationPresets, simulationScenarios } from "@/src/data/simulation/scenarios";
import { useSimulationStore } from "@/src/store/useSimulationStore";
import type { PresentationPresetId, ScenarioId, SimulationEventType } from "@/src/types/simulation";

const eventControls: Array<{ type: SimulationEventType; label: string }> = [
  { type: "anomaly", label: "Inject Anomaly" },
  { type: "propagation", label: "Inject Propagation" },
  { type: "turnout-spike", label: "Inject Turnout Spike" },
  { type: "reporting-delay", label: "Inject Reporting Delay" },
  { type: "infrastructure-outage", label: "Inject Infrastructure Outage" },
];

const riskTone = {
  LOW: "border-emerald-400/35 bg-emerald-400/10 text-emerald-100",
  NORMAL: "border-cyan-400/35 bg-cyan-400/10 text-cyan-100",
  ELEVATED: "border-amber-400/35 bg-amber-400/10 text-amber-100",
  HIGH: "border-orange-400/35 bg-orange-400/10 text-orange-100",
  CRITICAL: "border-rose-400/40 bg-rose-400/15 text-rose-100",
} as const;

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#bac9cc]">
        <span>{label}</span>
        <span className="text-cyan-100">{value}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ScenarioControlCenter() {
  const {
    activePreset,
    applyPreset,
    fastForward,
    injectEvent,
    isRunning,
    pause,
    reset,
    scenario,
    setScenario,
    setSpeed,
    speed,
    start,
    tick,
    timeline,
  } = useSimulationStore();

  const activeScenario = simulationScenarios.find((item) => item.id === scenario) ?? simulationScenarios[0];
  const activePresetLabel = presentationPresets.find((preset) => preset.id === activePreset)?.label ?? "Manual scenario control";

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-cyan-300/20 bg-[#07121a] p-5 shadow-[0_0_32px_rgba(34,211,238,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">Scenario Control Center</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Centralized Simulation Control</h1>
            <p className="mt-2 max-w-3xl text-sm text-[#bac9cc]">
              Select operational conditions, control replay cognition, inject observable events, and demonstrate how the platform responds across telemetry, forecast, civic signal, and operational summary layers.
            </p>
          </div>
          <div className={`rounded-xl border px-4 py-3 text-sm ${riskTone[activeScenario.riskLevel]}`}>
            <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">Risk Level</p>
            <p className="mt-1 text-lg font-semibold">{activeScenario.riskLevel}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-[#0a1117] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-cyan-100">Scenario Profiles</h2>
              <p className="text-xs text-[#bac9cc]">Profile changes immediately alter telemetry volume, anomaly frequency, propagation intensity, turnout pressure, and civic signal pressure.</p>
            </div>
            <select
              className="rounded-lg border border-cyan-300/20 bg-black/45 px-3 py-2 text-sm text-cyan-50 outline-none"
              value={scenario}
              onChange={(event) => setScenario(event.target.value as ScenarioId)}
            >
              {simulationScenarios.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {simulationScenarios.map((item) => (
              <button
                key={item.id}
                onClick={() => setScenario(item.id)}
                className={`rounded-xl border p-3 text-left transition ${item.id === scenario ? "border-cyan-300/45 bg-cyan-400/15" : "border-white/10 bg-white/[0.03] hover:border-cyan-300/25 hover:bg-cyan-400/10"}`}
              >
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-2 line-clamp-3 text-xs text-[#bac9cc]">{item.summary}</p>
                <p className={`mt-3 inline-flex rounded-full border px-2 py-1 text-[10px] ${riskTone[item.riskLevel]}`}>{item.riskLevel}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-violet-300/20 bg-[#100b1a] p-4">
          <h2 className="text-lg font-semibold text-violet-100">Scenario Dashboard</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-lg border border-white/10 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[#bac9cc]">Current Scenario</p>
              <p className="mt-1 text-xl font-semibold text-white">{activeScenario.label}</p>
              <p className="mt-1 text-xs text-[#bac9cc]">{activeScenario.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#bac9cc]">Simulation State</p>
                <p className="mt-1 text-cyan-100">{isRunning ? "Playing" : "Paused"}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#bac9cc]">Replay Tick</p>
                <p className="mt-1 text-cyan-100">{tick} / 120</p>
              </div>
            </div>
            <MetricBar label="Telemetry Intensity" value={timeline.telemetryIntensity} />
            <MetricBar label="Propagation Intensity" value={timeline.propagationIntensity} />
            <MetricBar label="Turnout Pressure" value={timeline.turnoutPressure} />
            <MetricBar label="Civic Signal Pressure" value={timeline.civicSignalPressure} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-cyan-300/20 bg-[#07121a] p-4">
          <h2 className="text-lg font-semibold text-cyan-100">Simulation Controls</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={start} className="rounded-lg border border-emerald-400/25 bg-emerald-400/12 px-3 py-2 text-sm text-emerald-100">Play</button>
            <button onClick={pause} className="rounded-lg border border-amber-400/25 bg-amber-400/12 px-3 py-2 text-sm text-amber-100">Pause</button>
            <button onClick={reset} className="rounded-lg border border-rose-400/25 bg-rose-400/12 px-3 py-2 text-sm text-rose-100">Reset</button>
            <button onClick={fastForward} className="rounded-lg border border-violet-400/25 bg-violet-400/12 px-3 py-2 text-sm text-violet-100">Fast Forward</button>
          </div>
          <label className="mt-4 block text-sm text-[#bac9cc]">
            Replay speed x{speed}
            <input type="range" min={1} max={5} value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="mt-2 w-full accent-cyan-300" />
          </label>
          <p className="mt-3 text-xs text-[#bac9cc]">Playback controls update the shared replay cognition cursor used by the simulation engine and intelligence summaries.</p>
        </div>

        <div className="rounded-2xl border border-rose-300/20 bg-[#180b10] p-4">
          <h2 className="text-lg font-semibold text-rose-100">Event Injection</h2>
          <div className="mt-3 space-y-2">
            {eventControls.map((control) => (
              <button key={control.type} onClick={() => injectEvent(control.type)} className="block w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-sm text-white transition hover:border-rose-300/30 hover:bg-rose-400/10">
                {control.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#bac9cc]">Injected events create telemetry records, active alerts, replay frames, anomaly-level changes, and focused regions for observable platform reactions.</p>
        </div>

        <div className="rounded-2xl border border-emerald-300/20 bg-[#071810] p-4">
          <h2 className="text-lg font-semibold text-emerald-100">Presentation Presets</h2>
          <p className="mt-1 text-xs text-[#bac9cc]">Active preset: {activePresetLabel}</p>
          <div className="mt-3 space-y-2">
            {presentationPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id as PresentationPresetId)}
                className={`block w-full rounded-lg border px-3 py-2 text-left transition ${activePreset === preset.id ? "border-emerald-300/35 bg-emerald-400/15" : "border-white/10 bg-white/[0.04] hover:border-emerald-300/25 hover:bg-emerald-400/10"}`}
              >
                <span className="block text-sm font-semibold text-white">{preset.label}</span>
                <span className="mt-1 block text-[11px] text-[#bac9cc]">{preset.emphasis}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
