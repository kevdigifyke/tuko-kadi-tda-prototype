"use client";

import { useEffect, useMemo, useState } from "react";

import HeatmapLayer from "./HeatmapLayer";
import PulseMarker from "./PulseMarker";

import { MapContainer, TileLayer, GeoJSON, LayersControl, CircleMarker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";

import { pollingStations } from "../../data/geo/pollingStations";
import { useObservatoryStore } from "../../store/useObservatoryStore";

export default function IEBCBoundaryMap() {
  const [counties, setCounties] = useState<any>(null);
  const [constituencies, setConstituencies] = useState<any>(null);
  const [wards, setWards] = useState<any>(null);

  const replayTick = useObservatoryStore((s) => s.replayTick);
  const selectedCounty = useObservatoryStore((s) => s.selectedCounty);
  const telemetry = useObservatoryStore((s) => s.telemetryEvents);

  useEffect(() => {
    fetch("/geojson/kenya_counties.geojson").then((res) => res.json()).then(setCounties);
    fetch("/geojson/kenya_constituencies.geojson").then((res) => res.json()).then(setConstituencies);
    fetch("/geojson/kenya_wards.geojson").then((res) => res.json()).then(setWards);
  }, []);

  const heatmapPoints = pollingStations.map((station) => ({ lat: station.lat, lng: station.lng, intensity: Math.min(1, station.turnout / 100 + replayTick / 220) }));
  const hotNodes = useMemo(() => pollingStations.filter((s) => telemetry.some((t) => t.county === s.county && t.severity !== "INFO")).slice(0, 24), [telemetry]);

  const onEachFeature = (feature: any, layer: any) => {
    const name = feature.properties.COUNTY || feature.properties.CONSTITUENCY || feature.properties.WARD || feature.properties.name || "Unknown";
    const focused = selectedCounty && name.includes(selectedCounty);
    layer.bindTooltip(name, { sticky: true });
    layer.setStyle({ fillOpacity: focused ? 0.25 : 0.08, weight: focused ? 4 : 2 });
  };

  return (
    <div className="h-[85vh] w-full rounded-2xl overflow-hidden border border-zinc-800">
      <MapContainer center={[-0.0236, 37.9062]} zoom={6} scrollWheelZoom className="h-full w-full z-0">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatmapLayer points={heatmapPoints} />
        {hotNodes.map((node) => (<CircleMarker key={`flash-${node.id}`} center={[node.lat, node.lng]} radius={6 + ((replayTick % 8) / 2)} pathOptions={{ color: "#ff3b3b", fillColor: "#ff3b3b", fillOpacity: 0.3, weight: 1 }} />))}
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Counties">{counties && <GeoJSON data={counties} style={{ color: "#00FFFF", weight: 3, fillOpacity: 0.08 }} onEachFeature={onEachFeature} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Constituencies">{constituencies && <GeoJSON data={constituencies} style={{ color: "#FFD700", weight: 2, fillOpacity: 0.05 }} onEachFeature={onEachFeature} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Wards">{wards && <GeoJSON data={wards} style={{ color: "#FF4D6D", weight: 1, fillOpacity: 0.03 }} onEachFeature={onEachFeature} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Polling Station Clusters"><MarkerClusterGroup chunkedLoading>{pollingStations.map((station) => (<PulseMarker key={station.id} station={station} />))}</MarkerClusterGroup></LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
