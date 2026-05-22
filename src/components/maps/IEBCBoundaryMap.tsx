"use client";

import { useEffect, useMemo, useState } from "react";

import HeatmapLayer from "./HeatmapLayer";
import PulseMarker from "./PulseMarker";

import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";

import { pollingStations } from "../../data/geo/pollingStations";
import { buildNationalFusionSummary } from "@/src/lib/fusion/intelligenceFusionEngine";

export default function IEBCBoundaryMap() {
  const [counties, setCounties] = useState<any>(null);
  const [constituencies, setConstituencies] = useState<any>(null);
  const [wards, setWards] = useState<any>(null);

  const summary = useMemo(() => buildNationalFusionSummary(), []);
  const countyLookup = useMemo(
    () => new Map(summary.counties.map((county) => [county.county.toLowerCase(), county])),
    [summary.counties],
  );

  useEffect(() => {
    fetch("/geojson/kenya-counties.geojson").then((res) => res.json()).then(setCounties);
    fetch("/geojson/kenya-constituencies.geojson").then((res) => res.json()).then(setConstituencies);
    fetch("/geojson/kenya-wards.geojson").then((res) => res.json()).then(setWards);
  }, []);

  const countyStyle = (feature: any) => {
    const name = String(feature?.properties?.COUNTY || feature?.properties?.name || "").toLowerCase();
    const county = countyLookup.get(name);
    const color = county?.threatLevel === "critical" ? "#ef4444" : county?.threatLevel === "high" ? "#f97316" : county?.threatLevel === "elevated" ? "#f59e0b" : "#22c55e";
    return { color, weight: county?.threatLevel === "critical" ? 4 : 2, fillOpacity: 0.2, fillColor: color, className: county?.threatLevel === "critical" ? "fusion-glow" : "fusion-pulse" };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;
    const name = props.COUNTY || props.CONSTITUENCY || props.WARD || props.name || "Unknown";
    const county = countyLookup.get(String(name).toLowerCase());
    layer.bindTooltip(`${name}${county ? ` • Fusion ${county.fusionScore}` : ""}`, { sticky: true });
  };

  const heatmapPoints = pollingStations.map((station) => ({ lat: station.lat, lng: station.lng, intensity: station.voters / 2000 }));

  return (
    <div className="relative h-[85vh] w-full rounded-2xl overflow-hidden border border-zinc-800">
      <MapContainer center={[-0.0236, 37.9062]} zoom={6} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatmapLayer points={heatmapPoints} />
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Fusion Counties">{counties && <GeoJSON data={counties} style={countyStyle} onEachFeature={onEachFeature} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Constituencies">{constituencies && <GeoJSON data={constituencies} style={{ color: "#38bdf8", weight: 1, fillOpacity: 0.03 }} onEachFeature={onEachFeature} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Wards">{wards && <GeoJSON data={wards} style={{ color: "#c084fc", weight: 1, fillOpacity: 0.01 }} onEachFeature={onEachFeature} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Cross-layer conflict indicators"><MarkerClusterGroup chunkedLoading>{pollingStations.map((station) => <PulseMarker key={station.id} station={station} />)}</MarkerClusterGroup></LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
      <div className="pointer-events-none absolute left-2 top-2 rounded-lg border border-cyan-400/40 bg-zinc-950/80 p-2 text-[11px] text-cyan-100">Fusion legend: critical glow, adaptive pulse intensity, and layered conflict markers.</div>
    </div>
  );
}
