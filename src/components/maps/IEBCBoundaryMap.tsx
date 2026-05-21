"use client";

import { useEffect, useMemo, useState } from "react";

import HeatmapLayer from "./HeatmapLayer";
import PulseMarker from "./PulseMarker";
import InfluenceLines from "./InfluenceLines";
import InfluenceLegend from "./InfluenceLegend";

import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";

import { pollingStations } from "../../data/geo/pollingStations";
import { buildNetworkInfluence } from "@/lib/tda/networkInfluenceEngine";

export default function IEBCBoundaryMap() {
  const [counties, setCounties] = useState<any>(null);
  const [constituencies, setConstituencies] = useState<any>(null);
  const [wards, setWards] = useState<any>(null);

  const networkResult = useMemo(() => buildNetworkInfluence(pollingStations), []);

  useEffect(() => {
    fetch("/geojson/kenya_counties.geojson")
      .then((res) => res.json())
      .then(setCounties);

    fetch("/geojson/kenya_constituencies.geojson")
      .then((res) => res.json())
      .then(setConstituencies);

    fetch("/geojson/kenya_wards.geojson")
      .then((res) => res.json())
      .then(setWards);
  }, []);

  const countyStyle = { color: "#00FFFF", weight: 3, fillOpacity: 0.08 };
  const constituencyStyle = { color: "#FFD700", weight: 2, fillOpacity: 0.05 };
  const wardStyle = { color: "#FF4D6D", weight: 1, fillOpacity: 0.03 };

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;
    const name = props.COUNTY || props.CONSTITUENCY || props.WARD || props.name || "Unknown";

    layer.bindTooltip(name, { sticky: true });
    layer.on({
      mouseover: (e: any) => e.target.setStyle({ weight: 4, fillOpacity: 0.2 }),
      mouseout: (e: any) => e.target.setStyle({ weight: 2, fillOpacity: 0.08 }),
    });
  };

  const heatmapPoints = pollingStations.map((station) => ({
    lat: station.lat,
    lng: station.lng,
    intensity: station.turnout / 100,
  }));

  return (
    <div className="relative h-[85vh] w-full overflow-hidden rounded-2xl border border-zinc-800">
      <MapContainer center={[-1.228, 36.892]} zoom={12} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <HeatmapLayer points={heatmapPoints} />

        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Counties">
            <>{counties && <GeoJSON data={counties} style={countyStyle} onEachFeature={onEachFeature} />}</>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Constituencies">
            <>{constituencies && <GeoJSON data={constituencies} style={constituencyStyle} onEachFeature={onEachFeature} />}</>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Wards">
            <>{wards && <GeoJSON data={wards} style={wardStyle} onEachFeature={onEachFeature} />}</>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Polling Station Clusters">
            <>
              <MarkerClusterGroup chunkedLoading>
                {networkResult.stations.map((station) => (
                  <PulseMarker key={station.id} station={station} />
                ))}
              </MarkerClusterGroup>
            </>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Network Influence Propagation">
            <InfluenceLines connections={networkResult.connections} stations={networkResult.stations} />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      <InfluenceLegend
        stationCount={networkResult.stations.length}
        connectionCount={networkResult.connections.length}
        maxRisk={Math.max(...networkResult.stations.map((station) => station.propagatedRisk))}
      />
    </div>
  );
}
