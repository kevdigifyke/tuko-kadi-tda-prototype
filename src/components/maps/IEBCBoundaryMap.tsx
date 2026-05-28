"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { type Layer, type Path } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

import HeatmapLayer from "./HeatmapLayer";
import PulseMarker from "./PulseMarker";
import { pollingStations } from "../../data/geo/pollingStations";
import { useSimulationStore } from "@/src/store/useSimulationStore";

type RegionLayer = "county" | "constituency" | "ward";
type TacticalLayerKey =
  | "telemetry"
  | "topology"
  | "propagation"
  | "anomalies"
  | "turnout"
  | "simulations"
  | "replayTraces"
  | "tacticalOverlays"
  | "environmentalOverlays";

type VisibilityBand = "macro" | "mid" | "deep";
type GeoEntityType = RegionLayer | "pollingStation" | "telemetryCluster" | "anomalyRegion";

type GeoKnowledgeItem = {
  id: string;
  name: string;
  normalized: string;
  type: GeoEntityType;
  center: [number, number];
  aliases: string[];
  telemetryIds: string[];
};

type TacticalLayerState = Record<
  TacticalLayerKey,
  { enabled: boolean; intensity: number; bandVisibility: Partial<Record<VisibilityBand, boolean>> }
>;

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

const defaultLayerState: TacticalLayerState = {
  telemetry: { enabled: true, intensity: 1, bandVisibility: { mid: true, deep: true } },
  topology: { enabled: true, intensity: 1, bandVisibility: { macro: true } },
  propagation: { enabled: true, intensity: 1, bandVisibility: { macro: true, deep: true } },
  anomalies: { enabled: true, intensity: 1, bandVisibility: { mid: true } },
  turnout: { enabled: true, intensity: 1, bandVisibility: { macro: true, mid: true } },
  simulations: { enabled: true, intensity: 1, bandVisibility: { macro: true, mid: true } },
  replayTraces: { enabled: true, intensity: 1, bandVisibility: { mid: true, deep: true } },
  tacticalOverlays: { enabled: true, intensity: 1, bandVisibility: { deep: true } },
  environmentalOverlays: { enabled: false, intensity: 0.7, bandVisibility: { macro: true, mid: true, deep: true } },
};

const semanticNameCache = new Map<string, string>();

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const zoomBand = (zoom: number): VisibilityBand => (zoom < 7.2 ? "macro" : zoom < 10.2 ? "mid" : "deep");
const hashLabelKey = (value: string) => [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0);
const labelClassFor = (layer: RegionLayer, zoom: number, key: string) => {
  const density = layer === "county" ? 1 : layer === "constituency" ? (zoom > 8.6 ? 1 : 2) : zoom > 11.8 ? 2 : 4;
  const visible = hashLabelKey(key) % density === 0;
  const reveal = layer === "county" ? "macro" : layer === "constituency" ? "mid" : "deep";
  return `tactical-label tactical-label-${layer} tactical-label-${reveal} ${visible ? "" : "tactical-label-deprioritized"}`;
};
const normalizeSemanticKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
const stationTurnoutEstimate = (station: { voters: number; risk: string }) => {
  const riskBias = station.risk === "high" ? 8 : station.risk === "medium" ? 3 : -2;
  return clamp(54 + (station.voters % 19) + riskBias, 42, 82);
};
const layerVisualStyle = (enabled: boolean, intensity: number) =>
  enabled
    ? {
        opacity: 0.98,
        filter: `saturate(${1 + intensity * 0.35}) brightness(${1 + intensity * 0.2})`,
        boxShadow: `0 0 ${10 + Math.round(intensity * 16)}px rgba(34,211,238,${0.22 + intensity * 0.12})`,
      }
    : { opacity: 0.42, filter: "saturate(0.55) brightness(0.72)", boxShadow: "none" };

function getRegionName(props: Record<string, unknown>, layer: RegionLayer) {
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

  return "";
}

function getPrimaryCoordinateRing(geometry: GeoJSON.Geometry | null): Array<[number, number]> | null {
  if (!geometry) return null;
  if (geometry.type === "Polygon") return geometry.coordinates[0] as Array<[number, number]>;
  if (geometry.type === "MultiPolygon") return geometry.coordinates[0]?.[0] as Array<[number, number]> | undefined ?? null;
  return null;
}

function getCenter(latlngs: Array<{ lat: number; lng: number }> | Array<Array<{ lat: number; lng: number }>>): [number, number] {
  const points = Array.isArray(latlngs[0]) ? (latlngs[0] as Array<{ lat: number; lng: number }>) : (latlngs as Array<{ lat: number; lng: number }>);
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  return [lats.reduce((a, b) => a + b, 0) / lats.length, lngs.reduce((a, b) => a + b, 0) / lngs.length];
}

const EnvironmentalOverlay = memo(function EnvironmentalOverlay({ enabled, zoom }: { enabled: boolean; zoom: number }) {
  if (!enabled) return null;
  const bands = zoomBand(zoom);
  return (
    <div className="pointer-events-none absolute right-4 top-4 z-[999] w-[300px] rounded-xl border border-cyan-500/30 bg-black/45 p-3 text-[11px] text-cyan-100 backdrop-blur-sm">
      <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-cyan-300">Environmental Overlay Framework</div>
      <div className="grid grid-cols-2 gap-1 text-zinc-300">
        <span>Satellite imagery</span><span className="text-right text-cyan-200">standby</span>
        <span>Traffic intelligence</span><span className="text-right text-cyan-200">standby</span>
        <span>Weather overlays</span><span className="text-right text-cyan-200">standby</span>
        <span>Comm outages</span><span className="text-right text-cyan-200">standby</span>
        <span>Mobility intelligence</span><span className="text-right text-cyan-200">standby</span>
      </div>
      <div className="mt-2 border-t border-cyan-500/20 pt-2 text-[10px] uppercase tracking-[0.16em] text-cyan-400/90">Visibility band: {bands}</div>
    </div>
  );
});

function ZoomObserver({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMap();

  useEffect(() => {
    onZoomChange(map.getZoom());
    const handleZoom = () => onZoomChange(map.getZoom());
    map.on("zoomend", handleZoom);
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map, onZoomChange]);

  return null;
}

function TacticalSync({ regionIndex }: { regionIndex: Record<string, { center: [number, number]; layer: RegionLayer }> }) {
  const map = useMap();
  const activeRegion = useSimulationStore((s) => s.activeRegion);
  const replayFocus = useSimulationStore((s) => s.replayFocus);
  const lastFlightRef = useRef(0);

  useEffect(() => {
    if (!activeRegion) return;
    const now = Date.now();
    if (now - lastFlightRef.current < 900 && replayFocus.source === "auto") return;
    const mapped = regionIndex[activeRegion.id.toLowerCase()];
    const target = mapped?.center ?? activeRegion.center;
    const layer = mapped?.layer ?? activeRegion.layer;
    const currentZoom = map.getZoom();
    const targetZoom = layer === "ward" ? 11.4 : layer === "constituency" ? 9.5 : 7.4;
    map.flyTo(target, currentZoom + (targetZoom - currentZoom) * 0.82, { duration: 1.7, easeLinearity: 0.15, noMoveStart: true });
    lastFlightRef.current = now;
  }, [activeRegion, map, regionIndex, replayFocus.source]);

  return null;
}

export default memo(function IEBCBoundaryMap() {
  const [counties, setCounties] = useState<GeoJSON.FeatureCollection | null>(null);
  const [constituencies, setConstituencies] = useState<GeoJSON.FeatureCollection | null>(null);
  const [wards, setWards] = useState<GeoJSON.FeatureCollection | null>(null);
  const [zoom, setZoom] = useState(6);
  const [layers, setLayers] = useState<TacticalLayerState>(defaultLayerState);
  const [hoveredLayer, setHoveredLayer] = useState<TacticalLayerKey | null>(null);
  const [query, setQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);

  const tick = useSimulationStore((s) => s.tick);
  const latestEvent = useSimulationStore((s) => s.telemetryEvents[0]);
  const activeRegion = useSimulationStore((s) => s.activeRegion);
  const focusedTelemetryId = useSimulationStore((s) => s.focusedTelemetryId);
  const telemetryEvents = useSimulationStore((s) => s.telemetryEvents);
  const replayFrames = useSimulationStore((s) => s.replayFrames);
  const replayFrameAtTick = useSimulationStore((s) => s.getReplayFrameAtTick(s.tick));
  const setReplayFocus = useSimulationStore((s) => s.setReplayFocus);
  const setActiveRegion = useSimulationStore((s) => s.setActiveRegion);
  const setFocusedTelemetryId = useSimulationStore((s) => s.setFocusedTelemetryId);

  useEffect(() => {
    Promise.all([
      fetch("/geojson/kenya_counties.geojson").then((res) => res.json()),
      fetch("/geojson/kenya_constituencies.geojson").then((res) => res.json()),
      fetch("/geojson/kenya_wards.geojson").then((res) => res.json()),
    ]).then(([countyData, constituencyData, wardData]) => {
      setCounties(countyData);
      setConstituencies(constituencyData);
      setWards(wardData);
    });
  }, []);

  const band = zoomBand(zoom);
  const layerVisible = useCallback((key: TacticalLayerKey) => layers[key].enabled && Boolean(layers[key].bandVisibility[band]), [band, layers]);
  const handleZoomChange = useCallback((nextZoom: number) => setZoom(nextZoom), []);

  const toggleLayer = useCallback((key: TacticalLayerKey) => {
    setLayers((prev) => {
      const enabled = !prev[key].enabled;
      return { ...prev, [key]: { ...prev[key], enabled, intensity: enabled ? 1 : 0.4 } };
    });
  }, []);

  const replayEnergy = tick / 120;
  const heatmapPoints = useMemo(() => pollingStations.map((s, idx) => ({ lat: s.lat, lng: s.lng, intensity: clamp((stationTurnoutEstimate(s) / 100) * (0.55 + replayEnergy * 0.8) + ((Math.sin((tick + idx) / 9) + 1) / 2) * 0.3, 0.08, 1) })), [tick, replayEnergy]);
  const ghostTrailStations = useMemo(() => replayFrames.slice(0, 8).map((frame, idx) => ({ id: `ghost-${frame.event.id}`, lat: -0.0236 + ((frame.event.aiRiskScore - 50) * 0.02) / 10 + idx * 0.02, lng: 37.9062 + ((frame.event.turnout - 50) * 0.02) / 10 - idx * 0.02, intensity: Math.max(0.2, 1 - idx * 0.12) })), [replayFrames]);

  const regionIndex = useMemo(() => {
    const index: Record<string, { center: [number, number]; layer: RegionLayer }> = {};
    [{ data: counties, layer: "county" as const }, { data: constituencies, layer: "constituency" as const }, { data: wards, layer: "ward" as const }].forEach(({ data, layer }) => {
      data?.features.forEach((feature) => {
        const name = getRegionName((feature.properties ?? {}) as Record<string, unknown>, layer);
        const coords = getPrimaryCoordinateRing(feature.geometry);
        if (!name || !coords?.length) return;
        index[`${layer}:${name}`.toLowerCase()] = { center: [coords.reduce((a, b) => a + b[1], 0) / coords.length, coords.reduce((a, b) => a + b[0], 0) / coords.length], layer };
      });
    });
    return index;
  }, [counties, constituencies, wards]);

  const geoKnowledgeIndex = useMemo(() => {
    const items: GeoKnowledgeItem[] = [];
    const register = (item: GeoKnowledgeItem) => {
      items.push({ ...item, normalized: normalizeSemanticKey(item.name) });
    };

    [{ data: counties, layer: "county" as const }, { data: constituencies, layer: "constituency" as const }, { data: wards, layer: "ward" as const }].forEach(({ data, layer }) => {
      data?.features.forEach((feature) => {
        const regionName = getRegionName((feature.properties ?? {}) as Record<string, unknown>, layer);
        if (!regionName) return;
        const key = `${layer}:${regionName}`.toLowerCase();
        const linkedTelemetry = telemetryEvents.filter((event) => event[layer] === regionName).map((event) => event.id);
        const center = regionIndex[key]?.center;
        if (!center) return;
        register({ id: key, name: regionName, type: layer, center, aliases: [regionName, key.split(":")[1]], telemetryIds: linkedTelemetry, normalized: "" });
      });
    });

    pollingStations.slice(0, 140).forEach((station) => {
      const key = `pollingStation:${station.id}`;
      const linkedTelemetry = telemetryEvents.filter((event) => event.ward === station.ward || event.constituency === station.constituency).map((event) => event.id);
      register({ id: key, name: station.name, type: "pollingStation", center: [station.lat, station.lng], aliases: [station.ward, station.constituency, station.county], telemetryIds: linkedTelemetry, normalized: "" });
    });

    telemetryEvents.forEach((event) => {
      const key = `telemetryCluster:${event.id}`;
      register({ id: key, name: `${event.county} ${event.category}`, type: event.severity === "CRITICAL" ? "anomalyRegion" : "telemetryCluster", center: activeRegion?.center ?? [-0.0236, 37.9062], aliases: [event.county, event.constituency, event.ward, event.title], telemetryIds: [event.id], normalized: "" });
    });

    return items;
  }, [activeRegion?.center, counties, constituencies, regionIndex, telemetryEvents, wards]);

  const semanticSuggestions = useMemo(() => {
    const needle = normalizeSemanticKey(query);
    if (!needle) return geoKnowledgeIndex.slice(0, 8);
    const scored = geoKnowledgeIndex.map((item) => {
      const aliasHit = item.aliases.some((alias) => normalizeSemanticKey(alias).includes(needle));
      const starts = item.normalized.startsWith(needle);
      const contains = item.normalized.includes(needle);
      const score = starts ? 0 : aliasHit ? 1 : contains ? 2 : 4;
      return { item, score };
    }).filter((row) => row.score < 4).sort((a, b) => a.score - b.score).slice(0, 8).map((row) => row.item);
    return scored;
  }, [geoKnowledgeIndex, query]);

  const searchTarget = useMemo(() => {
    const needle = normalizeSemanticKey(selectedQuery);
    if (!needle) return null;
    return geoKnowledgeIndex.find((item) => item.normalized === needle) ?? semanticSuggestions[0] ?? null;
  }, [geoKnowledgeIndex, selectedQuery, semanticSuggestions]);

  const commitSearchTarget = useCallback((item: GeoKnowledgeItem) => {
    setQuery(item.name);
    setSelectedQuery(item.name);
    setSearchExpanded(false);
  }, []);

  useEffect(() => {
    if (!searchTarget) return;

    const regionLayer: RegionLayer =
      searchTarget.type === "county" ||
      searchTarget.type === "constituency" ||
      searchTarget.type === "ward"
        ? searchTarget.type
        : "ward";

    const nextRegionId =
      `${regionLayer}:${searchTarget.name}`.toLowerCase();

    const currentState = useSimulationStore.getState();

    // ---- ACTIVE REGION STABILIZATION ----
    if (
      !currentState.activeRegion ||
      currentState.activeRegion.id !== nextRegionId
    ) {
      setActiveRegion({
        id: nextRegionId,
        name: searchTarget.name,
        layer: regionLayer,
        center: searchTarget.center,
        severity: "AMBER",
        flashToken: Date.now(),
      });
    }

    const telemetryId = searchTarget.telemetryIds[0] ?? null;
    const telemetryTimer = window.setTimeout(() => {
      const latestState = useSimulationStore.getState();

      if (latestState.focusedTelemetryId !== telemetryId) {
        setFocusedTelemetryId(telemetryId);
      }

      if (telemetryId) {
        const nextClusterKey = `${searchTarget.name}:${searchTarget.type}`.toLowerCase();

        if (latestState.replayFocus?.clusterKey !== nextClusterKey) {
          setReplayFocus({
            clusterKey: nextClusterKey,
            source: "map",
            lastJumpAt: Date.now(),
          });
        }
      }
    }, 360);

    return () => window.clearTimeout(telemetryTimer);
  }, [searchTarget, setActiveRegion, setFocusedTelemetryId, setReplayFocus]);

  const styleFor = useCallback((layer: RegionLayer) => {
    const base = layer === "county" ? { color: "#76d8e1", weight: 2.4, fill: 0.1, dashArray: "10 6" } : layer === "constituency" ? { color: "#84a9bb", weight: 1.3, fill: 0.055, dashArray: "6 5" } : { color: "#86919b", weight: 0.7, fill: 0.02, dashArray: "3 5" };
    const z = zoomOpacity[layer];
    const opacity = clamp((zoom - z.min) / (z.max - z.min), 0, 1);
    const bandDamping = layer === "ward" && zoom < 11 ? 0.62 : layer === "constituency" && zoom < 8.2 ? 0.72 : 1;
    const isSearchHit = searchTarget && layer === (searchTarget.type === "county" || searchTarget.type === "constituency" || searchTarget.type === "ward" ? searchTarget.type : "ward");
    return { color: base.color, dashArray: base.dashArray, weight: (base.weight + (isSearchHit ? 0.8 : 0)) * opacity * bandDamping, opacity: opacity * bandDamping * (searchTarget && !isSearchHit ? 0.36 : 0.86), fillColor: base.color, fillOpacity: base.fill * opacity * bandDamping * (searchTarget && !isSearchHit ? 0.24 : isSearchHit ? 2 : 0.82) };
  }, [searchTarget, zoom]);

  const onEachFeature = useCallback((layerName: RegionLayer) => (feature: GeoJSON.Feature, layer: Layer & { setStyle: (s: Record<string, number | string>) => void; bindTooltip: (n: string, o: Record<string, unknown>) => void; bindPopup: (html: string) => void; on: (events: Record<string, () => void>) => void; getLatLngs: () => Array<{ lat: number; lng: number }> | Array<Array<{ lat: number; lng: number }>>; openPopup: () => void; }) => {
    const regionName = getRegionName((feature.properties ?? {}) as Record<string, unknown>, layerName);
    if (!regionName) return;
    const key = `${layerName}:${regionName}`.toLowerCase();
    const center = getCenter(layer.getLatLngs());
    const permanent = layerName === "county" ? zoom < 7.4 : layerName === "constituency" ? zoom >= 7.8 && zoom <= 10.4 : zoom > 10.9;
    layer.bindTooltip(regionName, { sticky: false, permanent, direction: "center", opacity: permanent ? 0.82 : 0.65, className: labelClassFor(layerName, zoom, key) });
    layer.bindPopup(`<div class='text-[11px]'><b>${regionName}</b><div>Risk ${latestEvent?.aiRiskScore ?? 42} | Turnout ${latestEvent?.turnout ?? 57}%</div></div>`);
    layer.on({
      mouseover: () => layer.setStyle({ fillOpacity: styleFor(layerName).fillOpacity + 0.06, weight: styleFor(layerName).weight + 0.7, opacity: Math.min(1, styleFor(layerName).opacity + 0.16) }),
      mouseout: () => layer.setStyle(styleFor(layerName)),
      click: () => useSimulationStore.getState().setActiveRegion({ id: key, name: regionName, layer: layerName, center, severity: latestEvent?.intelligenceSeverity ?? "GREEN", flashToken: Date.now() }),
    });
    if (activeRegion?.id?.toLowerCase() === key) {
      layer.openPopup();
      const path = layer as unknown as Path;
      path.setStyle({ weight: styleFor(layerName).weight + 1.2, fillOpacity: styleFor(layerName).fillOpacity + 0.12 });
      setTimeout(() => path.setStyle(styleFor(layerName)), 1500);
    }
  }, [activeRegion?.id, latestEvent?.aiRiskScore, latestEvent?.intelligenceSeverity, latestEvent?.turnout, styleFor, zoom]);

  const anomalyMarkers = useMemo(() => {
    const replayFocusedId = replayFrameAtTick?.event.id;
    const focused = focusedTelemetryId ? telemetryEvents.find((event) => event.id === focusedTelemetryId) : replayFocusedId ? telemetryEvents.find((event) => event.id === replayFocusedId) : telemetryEvents[0];
    return pollingStations.filter((_, idx) => idx % Math.max(2, 10 - Math.floor(replayEnergy * 8)) === 0).map((station) => {
      const linked = telemetryEvents.find((event) => event.county === station.county || event.constituency === station.constituency || event.ward === station.ward);
      const isFocused = Boolean(focused && linked?.id === focused.id);
      return {
        station: {
          ...station,
          turnout: linked?.turnout ?? stationTurnoutEstimate(station),
          status: linked?.status,
          tdaStability: linked?.tdaStability,
          simulationStatus: linked?.simulationStatus,
          aiRiskScore: linked?.aiRiskScore,
          severity: linked?.intelligenceSeverity,
        },
        isFocused,
        dimmed: Boolean(focused && !isFocused),
        isCritical: linked?.severity === "CRITICAL",
      };
    });
  }, [focusedTelemetryId, replayEnergy, replayFrameAtTick?.event.id, telemetryEvents]);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden rounded-2xl border border-zinc-800 shadow-[0_0_35px_rgba(34,211,238,0.12)] tactical-carto-map">
      <div className="absolute left-4 top-4 z-[1000] rounded-xl border border-cyan-500/25 bg-zinc-950/52 p-3 opacity-80 backdrop-blur-md transition-all duration-500 hover:opacity-100">
        <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-cyan-300/85">Tactical Layer Matrix</div>
        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-200">
          {(Object.keys(layers) as TacticalLayerKey[]).map((name) => {
            const enabled = layers[name].enabled;
            return <button key={name} onMouseEnter={() => setHoveredLayer(name)} onMouseLeave={() => setHoveredLayer(null)} onClick={() => toggleLayer(name)} className="rounded border px-2 py-1 uppercase tracking-wide transition-all duration-300" style={layerVisualStyle(enabled, hoveredLayer === name ? 1.2 : layers[name].intensity)}>{name.replace(/([A-Z])/g, " $1")}</button>;
          })}
        </div>
      </div>
      <div className="absolute top-4 left-1/2 z-[1200] max-w-[92vw] -translate-x-1/2 transition-all duration-500">
        {!searchExpanded ? (
          <button
            type="button"
            onClick={() => setSearchExpanded(true)}
            className="rounded-full border border-cyan-500/30 bg-black/55 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.08)] backdrop-blur-md transition hover:border-cyan-300/60 hover:bg-cyan-400/10"
          >
            ⌘ Geo Search
          </button>
        ) : (
          <div className="w-[360px] rounded-2xl border border-cyan-500/28 bg-black/72 p-3 shadow-[0_0_36px_rgba(0,255,255,0.09)] backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-cyan-300">
              <span>⌘ Geo Search</span>
              <button type="button" onClick={() => setSearchExpanded(false)} className="text-zinc-500 transition hover:text-cyan-200">Collapse</button>
            </div>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedQuery(""); }}
              onKeyDown={(e) => { if (e.key === "Enter" && semanticSuggestions[0]) commitSearchTarget(semanticSuggestions[0]); }}
              placeholder="County, ward, station, anomaly..."
              className="w-full rounded border border-cyan-600/35 bg-zinc-950/80 px-3 py-2 text-xs text-cyan-100 outline-none ring-cyan-500/40 placeholder:text-zinc-600 focus:ring"
              autoFocus
            />
            <div className="mt-2 grid max-h-56 gap-1 overflow-hidden text-xs">
              {semanticSuggestions.slice(0, 6).map((item) => (
                <button key={item.id} onClick={() => commitSearchTarget(item)} className="flex items-center justify-between rounded border border-cyan-900/60 bg-zinc-950/55 px-2 py-1.5 text-left text-zinc-300 transition hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:text-cyan-100">
                  <span className="truncate">{item.name}</span>
                  <span className="ml-3 shrink-0 uppercase tracking-wider text-cyan-300/70">{item.type}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <EnvironmentalOverlay enabled={layerVisible("environmentalOverlays")} zoom={zoom} />
      <MapContainer center={[-0.0236, 37.9062]} zoom={6} scrollWheelZoom className="h-full w-full z-0">
        <ZoomObserver onZoomChange={handleZoomChange} />
        <TacticalSync regionIndex={regionIndex} />
        <TileLayer attribution="Carto" opacity={0.72} url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
        {layerVisible("turnout") && <HeatmapLayer points={layerVisible("replayTraces") ? [...heatmapPoints, ...ghostTrailStations] : heatmapPoints} intensityBoost={0.8 + replayEnergy * 0.65} visible />}
        {layerVisible("telemetry") && <MarkerClusterGroup chunkedLoading>{anomalyMarkers.map(({ station, isFocused, dimmed, isCritical }) => <PulseMarker key={station.id} station={station} cinematicPulse={layerVisible("anomalies")} isFocused={isFocused} dimmed={dimmed} criticalBoost={isCritical} propagationPulse={layerVisible("propagation") && isFocused} />)}</MarkerClusterGroup>}
        {layerVisible("topology") && counties && band === "macro" && <GeoJSON data={counties} style={() => styleFor("county")} onEachFeature={onEachFeature("county")} />}
        {layerVisible("simulations") && constituencies && band !== "deep" && <GeoJSON data={constituencies} style={() => styleFor("constituency")} onEachFeature={onEachFeature("constituency")} />}
        {layerVisible("tacticalOverlays") && wards && band === "deep" && <GeoJSON data={wards} style={() => styleFor("ward")} onEachFeature={onEachFeature("ward")} />}
      </MapContainer>
    </div>
  );
});
