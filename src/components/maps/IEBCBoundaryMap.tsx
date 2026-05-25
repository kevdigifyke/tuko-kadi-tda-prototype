"use client";

import { memo, useEffect, useMemo, useState } from "react";

import HeatmapLayer from "./HeatmapLayer";
import PulseMarker from "./PulseMarker";

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { type Layer, type Path } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

import { pollingStations } from "../../data/geo/pollingStations";
import { useSimulationStore } from "@/src/store/useSimulationStore";

const nameKeyMap = {
  county: ["COUNTY", "COUNTY_NAM", "ADM1_EN", "NAME", "name"],
  constituency: ["CONSTITUENCY", "constituency", "NAME", "name"],
  ward: ["WARD", "ward", "NAME", "name"],
} as const;

const zoomOpacity = {
  county: { min: 4, max: 7.8 },
  constituency: { min: 7.2, max: 9.6 },
  ward: { min: 9.2, max: 14 },
} as const;

const semanticNameCache = new Map<string, string>();

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function getRegionName(props: Record<string, unknown>, layer: keyof typeof nameKeyMap) {
  const cacheKey = `${layer}:${String(props.id ?? props.OBJECTID ?? props.FID ?? props.NAME ?? props.name ?? "na")}`;
  const cached = semanticNameCache.get(cacheKey);
  if (cached) return cached;

  for (const key of nameKeyMap[layer]) {
    const value = props?.[key];
    if (typeof value === "string" && value.trim()) {
      semanticNameCache.set(cacheKey, value.trim());
      return value.trim();
    }
  }
  const fallback = ["NAME", "name", "ADM1_EN", "county", "constituency", "ward"];
  for (const key of fallback) {
    const value = props?.[key];
    if (typeof value === "string" && value.trim()) {
      semanticNameCache.set(cacheKey, value.trim());
      return value.trim();
    }
  }
  return "";
}

function getCenter(latlngs: Array<{ lat: number; lng: number }> | Array<Array<{ lat: number; lng: number }>>): [number, number] {
  const points = Array.isArray(latlngs[0]) ? (latlngs[0] as Array<{ lat: number; lng: number }>) : (latlngs as Array<{ lat: number; lng: number }>);
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  return [lats.reduce((a, b) => a + b, 0) / lats.length, lngs.reduce((a, b) => a + b, 0) / lngs.length];
}

function TacticalSync({ regionIndex }: { regionIndex: Record<string, { center: [number, number]; layer: "county" | "constituency" | "ward" }> }) {
  const map = useMap();
  const activeRegion = useSimulationStore((s) => s.activeRegion);

  useEffect(() => {
    if (!activeRegion) return;
    const mapped = regionIndex[activeRegion.id.toLowerCase()];
    const target = mapped?.center ?? activeRegion.center;
    const layer = mapped?.layer ?? activeRegion.layer;
    const zoom = layer === "ward" ? 11.4 : layer === "constituency" ? 9.5 : 7.4;
    map.flyTo(target, zoom, { duration: 1.5, easeLinearity: 0.22 });
  }, [activeRegion, map, regionIndex]);

  return null;
}

export default memo(function IEBCBoundaryMap() {
  const [counties, setCounties] = useState<GeoJSON.FeatureCollection | null>(null);
  const [constituencies, setConstituencies] = useState<GeoJSON.FeatureCollection | null>(null);
  const [wards, setWards] = useState<GeoJSON.FeatureCollection | null>(null);
  const [zoom, setZoom] = useState(6);
  const [toggles, setToggles] = useState({ telemetry: true, heatmap: true, topology: true, simulations: true, anomalies: true, propagation: true });
  const tick = useSimulationStore((s) => s.tick);
  const latestEvent = useSimulationStore((s) => s.telemetryEvents[0]);
  const activeRegion = useSimulationStore((s) => s.activeRegion);

  useEffect(() => {
    Promise.all([
      fetch("/geojson/kenya_counties.geojson").then((res) => res.json()),
      fetch("/geojson/kenya_constituencies.geojson").then((res) => res.json()),
      fetch("/geojson/kenya_wards.geojson").then((res) => res.json()),
    ]).then(([countyData, constituencyData, wardData]) => {
      setCounties(countyData); setConstituencies(constituencyData); setWards(wardData);
    });
  }, []);

  const replayEnergy = tick / 120;
  const heatmapPoints = useMemo(() => pollingStations.map((s, idx) => {
    const wave = (Math.sin((tick + idx) / 9) + 1) / 2;
    const boosted = clamp((s.turnout / 100) * (0.55 + replayEnergy * 0.8) + wave * 0.3, 0.08, 1);
    return { lat: s.lat, lng: s.lng, intensity: boosted };
  }), [tick, replayEnergy]);

  const regionIndex = useMemo(() => {
    const index: Record<string, { center: [number, number]; layer: "county" | "constituency" | "ward" }> = {};
    const withLayer = [
      { data: counties, layer: "county" as const },
      { data: constituencies, layer: "constituency" as const },
      { data: wards, layer: "ward" as const },
    ];
    withLayer.forEach(({ data, layer }) => {
      data?.features.forEach((feature) => {
        const name = getRegionName((feature.properties ?? {}) as Record<string, unknown>, layer);
        const geometry = feature.geometry;
        if (!geometry) return;
        const coords = geometry.type === "Polygon" ? geometry.coordinates[0] : geometry.coordinates[0]?.[0];
        if (!coords?.length) return;
        const lng = coords.reduce((a, b) => a + b[0], 0) / coords.length;
        const lat = coords.reduce((a, b) => a + b[1], 0) / coords.length;
        index[`${layer}:${name}`.toLowerCase()] = { center: [lat, lng], layer };
      });
    });
    return index;
  }, [counties, constituencies, wards]);

  const styleFor = (layer: "county" | "constituency" | "ward") => {
    const base = layer === "county" ? { color: "#76d8e1", weight: 2.4, fill: 0.1, dashArray: "10 6" } : layer === "constituency" ? { color: "#84a9bb", weight: 1.3, fill: 0.055, dashArray: "6 5" } : { color: "#86919b", weight: 0.7, fill: 0.02, dashArray: "3 5" };
    const z = zoomOpacity[layer];
    const opacity = clamp((zoom - z.min) / (z.max - z.min), 0, 1);
    return { color: base.color, dashArray: base.dashArray, weight: base.weight * opacity, opacity, fillColor: base.color, fillOpacity: base.fill * opacity };
  };

  const popupContent = (regionName: string) => `<div class="min-w-[250px] rounded-lg border border-cyan-500/35 bg-black/95 p-2 text-[11px] text-cyan-50"><div class="text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">${regionName}</div><div class="mt-2 grid grid-cols-2 gap-1"><div>AI Risk</div><div class="text-right font-semibold text-rose-300">${latestEvent?.aiRiskScore ?? 42}</div><div>Turnout</div><div class="text-right font-semibold text-emerald-300">${latestEvent?.turnout ?? 57}%</div><div>Telemetry</div><div class="text-right">${latestEvent?.status ?? "LIVE"}</div><div>Propagation</div><div class="text-right text-amber-200">${latestEvent?.tdaStability ? `${latestEvent.tdaStability}% LOCK` : "TRACKING"}</div><div>Simulation</div><div class="text-right">${latestEvent?.simulationStatus ?? "PREDICTIVE"}</div></div></div>`;

  const onEachFeature = (layerName: "county" | "constituency" | "ward") => (feature: GeoJSON.Feature, layer: Layer & { setStyle: (s: Record<string, number | string>) => void; bindTooltip: (n: string, o: { sticky: boolean }) => void; bindPopup: (html: string) => void; on: (events: Record<string, () => void>) => void; getLatLngs: () => Array<{ lat: number; lng: number }> | Array<Array<{ lat: number; lng: number }>>; openPopup: () => void; }) => {
    const props = (feature.properties ?? {}) as Record<string, unknown>;
    const regionName = getRegionName(props, layerName);
    if (!regionName) return;
    const key = `${layerName}:${regionName}`.toLowerCase();
    const center = getCenter(layer.getLatLngs());

    const visible = layerName === "county" ? zoom < 7.2 : layerName === "constituency" ? zoom >= 7 && zoom <= 10.2 : zoom > 10;
    layer.bindTooltip(regionName, { sticky: false, permanent: visible, direction: "center", className: `tactical-label tactical-label-${layerName}` });
    layer.bindPopup(popupContent(regionName));
    layer.on({
      mouseover: () => layer.setStyle({ fillOpacity: styleFor(layerName).fillOpacity + 0.06, weight: styleFor(layerName).weight + 0.7, opacity: Math.min(1, styleFor(layerName).opacity + 0.16) }),
      mouseout: () => layer.setStyle(styleFor(layerName)),
      click: () => {
        useSimulationStore.getState().setActiveRegion({ id: key, name: regionName, layer: layerName, center, severity: latestEvent?.intelligenceSeverity ?? "GREEN", flashToken: Date.now() });
      },
    });

    if (activeRegion?.id?.toLowerCase() === key) {
      layer.openPopup();
      const path = layer as unknown as Path;
      path.setStyle({ weight: styleFor(layerName).weight + 1.2, fillOpacity: styleFor(layerName).fillOpacity + 0.12 });
      setTimeout(() => path.setStyle(styleFor(layerName)), 1500);
    }
  };

  const pulseStations = useMemo(() => pollingStations.filter((_, idx) => idx % Math.max(2, 10 - Math.floor(replayEnergy * 8)) === 0), [replayEnergy]);

  return (
    <div className="relative h-[85vh] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_35px_rgba(34,211,238,0.12)] tactical-carto-map">
      <div className="absolute left-4 top-4 z-[1000] rounded-xl border border-cyan-500/40 bg-zinc-950/85 p-3 backdrop-blur-md">
        <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-cyan-300">Tactical Layer Matrix</div>
        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-200">
          {Object.entries(toggles).map(([name, enabled]) => <button key={name} onClick={() => setToggles((s) => ({ ...s, [name]: !enabled }))} className={`rounded border px-2 py-1 uppercase tracking-wide ${enabled ? "border-cyan-400/55 bg-cyan-500/15 text-cyan-100" : "border-zinc-700 bg-zinc-900/70 text-zinc-500"}`}>{name}</button>)}
        </div>
      </div>
      <MapContainer center={[-0.0236, 37.9062]} zoom={6} scrollWheelZoom className="h-full w-full z-0" whenReady={(e) => {
        setZoom(e.target.getZoom());
        e.target.on("zoom", () => setZoom(e.target.getZoom()));
      }}>
        <TacticalSync regionIndex={regionIndex} />
        <TileLayer attribution="Carto" opacity={0.72} url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
        {toggles.heatmap && <HeatmapLayer points={heatmapPoints} intensityBoost={0.7 + replayEnergy * 0.7} visible={toggles.heatmap} />}
        {toggles.telemetry && <MarkerClusterGroup chunkedLoading>{pulseStations.map((station) => <PulseMarker key={station.id} station={station} cinematicPulse={toggles.anomalies} />)}</MarkerClusterGroup>}
        {toggles.topology && counties && zoom < 7.2 && <GeoJSON data={counties} style={() => styleFor("county")} onEachFeature={onEachFeature("county")} />}
        {toggles.simulations && constituencies && zoom >= 6.8 && zoom <= 10.2 && <GeoJSON data={constituencies} style={() => styleFor("constituency")} onEachFeature={onEachFeature("constituency")} />}
        {toggles.propagation && wards && zoom > 9.8 && <GeoJSON data={wards} style={() => styleFor("ward")} onEachFeature={onEachFeature("ward")} />}
      </MapContainer>
    </div>
  );
});
