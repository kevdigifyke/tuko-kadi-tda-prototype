"use client";

import { memo, useEffect, useMemo, useState } from "react";

import HeatmapLayer from "./HeatmapLayer";
import PulseMarker from "./PulseMarker";

import { MapContainer, TileLayer, GeoJSON, LayersControl, useMap } from "react-leaflet";
import type { Layer } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

import { pollingStations } from "../../data/geo/pollingStations";
import { useSimulationStore } from "@/src/store/useSimulationStore";

const nameKeys = ["COUNTY", "COUNTY_NAM", "county", "constituency", "CONSTITUENCY", "ward", "WARD", "name"] as const;

function getRegionName(props: Record<string, unknown>) {
  for (const key of nameKeys) {
    const value = props?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  const fallback = Object.values(props ?? {}).find((v) => typeof v === "string" && v.trim());
  return (fallback as string) ?? "Region";
}

function MapSync() {
  const map = useMap();
  const activeRegion = useSimulationStore((s) => s.activeRegion);
  useEffect(() => {
    if (!activeRegion) return;
    map.flyTo(activeRegion.center, activeRegion.layer === "ward" ? 10 : activeRegion.layer === "constituency" ? 8 : 7, { duration: 0.7 });
  }, [activeRegion, map]);
  return null;
}

function ActivePulse() {
  const activeRegion = useSimulationStore((s) => s.activeRegion);
  if (!activeRegion) return null;
  return <PulseMarker station={{ id: activeRegion.id, lat: activeRegion.center[0], lng: activeRegion.center[1], turnout: 65, anomalyScore: 70, name: activeRegion.name, county: activeRegion.name, constituency: activeRegion.name, ward: activeRegion.name, severity: activeRegion.severity, flashToken: activeRegion.flashToken }} />;
}

function getCenter(latlngs: Array<{ lat: number; lng: number }> | Array<Array<{ lat: number; lng: number }>>): [number, number] {
  const points = Array.isArray(latlngs[0]) ? (latlngs[0] as Array<{ lat: number; lng: number }>) : (latlngs as Array<{ lat: number; lng: number }>);
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  return [lats.reduce((a: number, b: number) => a + b, 0) / lats.length, lngs.reduce((a: number, b: number) => a + b, 0) / lngs.length];
}

export default memo(function IEBCBoundaryMap() {
  const [counties, setCounties] = useState<GeoJSON.FeatureCollection | null>(null);
  const [constituencies, setConstituencies] = useState<GeoJSON.FeatureCollection | null>(null);
  const [wards, setWards] = useState<GeoJSON.FeatureCollection | null>(null);
  const latestEvent = useSimulationStore((s) => s.telemetryEvents[0]);

  useEffect(() => {
    Promise.all([
      fetch("/geojson/kenya_counties.geojson").then((res) => res.json()),
      fetch("/geojson/kenya_constituencies.geojson").then((res) => res.json()),
      fetch("/geojson/kenya_wards.geojson").then((res) => res.json()),
    ]).then(([countyData, constituencyData, wardData]) => {
      setCounties(countyData); setConstituencies(constituencyData); setWards(wardData);
    });
  }, []);

  const heatmapPoints = useMemo(() => pollingStations.map((s) => ({ lat: s.lat, lng: s.lng, intensity: s.turnout / 100 })), []);
  const styleFor = (layer: "county" | "constituency" | "ward") => ({
    color: layer === "county" ? "#37c7d4" : layer === "constituency" ? "#6b9eb4" : "#7b8b95",
    weight: layer === "county" ? 1.2 : layer === "constituency" ? 0.8 : 0.45,
    fillOpacity: layer === "county" ? 0.07 : layer === "constituency" ? 0.045 : 0.02,
  });

  const onEachFeature = (layerName: "county" | "constituency" | "ward") => (feature: GeoJSON.Feature, layer: Layer & { setStyle: (s: Record<string, number | string>) => void; bindTooltip: (n: string, o: {sticky: boolean}) => void; bindPopup: (html: string) => void; on: (events: Record<string, () => void>) => void; getLatLngs: () => Array<{ lat: number; lng: number }> | Array<Array<{ lat: number; lng: number }>>; }) => {
    const props = feature.properties ?? {};
    const regionName = getRegionName(props);
    const key = `${layerName}:${regionName}`.toLowerCase();
    const center = getCenter(layer.getLatLngs());

    layer.bindTooltip(regionName, { sticky: true });
    layer.bindPopup(`<div><strong>${regionName}</strong><br/>AI Risk Score: ${latestEvent?.aiRiskScore ?? 42}<br/>Turnout %: ${latestEvent?.turnout ?? 57}<br/>Telemetry State: ${latestEvent?.status ?? "LIVE"}<br/>TDA Stability: ${latestEvent?.tdaStability ?? 70}<br/>Simulation Status: ${latestEvent?.simulationStatus ?? "PREDICTIVE"}</div>`);

    layer.on({
      mouseover: () => layer.setStyle({ fillOpacity: 0.12, weight: styleFor(layerName).weight + 0.7 }),
      mouseout: () => layer.setStyle(styleFor(layerName)),
      click: () => useSimulationStore.getState().setActiveRegion({ id: key, name: regionName, layer: layerName, center, severity: latestEvent?.intelligenceSeverity ?? "GREEN", flashToken: Date.now() }),
    });
  };

  return (
    <div className="h-[85vh] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
      <MapContainer center={[-0.0236, 37.9062]} zoom={6} scrollWheelZoom className="h-full w-full z-0">
        <MapSync />
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatmapLayer points={heatmapPoints} />
        <ActivePulse />
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Counties">{counties && <GeoJSON data={counties} style={() => styleFor("county")} onEachFeature={onEachFeature("county")} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Constituencies">{constituencies && <GeoJSON data={constituencies} style={() => styleFor("constituency")} onEachFeature={onEachFeature("constituency")} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Wards">{wards && <GeoJSON data={wards} style={() => styleFor("ward")} onEachFeature={onEachFeature("ward")} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Polling Station Clusters"><MarkerClusterGroup chunkedLoading>{pollingStations.map((station) => <PulseMarker key={station.id} station={station} />)}</MarkerClusterGroup></LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
});
