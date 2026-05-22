"use client";

import { useEffect, useState } from "react";

import HeatmapLayer from "./HeatmapLayer";
import PulseMarker from "./PulseMarker";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
} from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";

import { pollingStations } from "../../data/geo/pollingStations";
import { mockIntegrityAssessment } from "@/src/data/integrity/mockIntegrityData";

export default function IEBCBoundaryMap() {
  const [counties, setCounties] = useState<any>(null);
  const [constituencies, setConstituencies] = useState<any>(null);
  const [wards, setWards] = useState<any>(null);

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

  const countyScores = Object.fromEntries(mockIntegrityAssessment.countyRankings.map((c) => [c.county.toUpperCase(), c]));

  const countyStyle = (feature: any) => {
    const countyName = String(feature?.properties?.COUNTY ?? feature?.properties?.name ?? "").toUpperCase();
    const county = countyScores[countyName];
    const score = county?.integrityScore ?? 65;
    const color = score >= 75 ? "#00C853" : score >= 50 ? "#FACC15" : "#F43F5E";

    return {
      color: "#00FFFF",
      weight: county && county.volatility > 45 ? 4 : 3,
      fillColor: color,
      fillOpacity: 0.22,
    };
  };

  const constituencyStyle = {
    color: "#FFD700",
    weight: 2,
    fillOpacity: 0.05,
  };

  const wardStyle = {
    color: "#FF4D6D",
    weight: 1,
    fillOpacity: 0.03,
  };

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;

    const name =
      props.COUNTY ||
      props.CONSTITUENCY ||
      props.WARD ||
      props.name ||
      "Unknown";

    layer.bindTooltip(name, {
      sticky: true,
    });

    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({
          weight: 5,
          fillOpacity: 0.32,
        });
      },

      mouseout: (e: any) => {
        e.target.setStyle({
          weight: 3,
          fillOpacity: 0.22,
        });
      },
    });
  };

  const hotspotCounties = new Set(mockIntegrityAssessment.countyRankings.filter((c) => c.volatility > 55).map((c) => c.county.toLowerCase()));

  const heatmapPoints = pollingStations.map((station) => ({
    lat: station.lat,
    lng: station.lng,
    intensity: station.turnout / 100,
  }));

  return (
    <div className="h-[85vh] w-full rounded-2xl overflow-hidden border border-zinc-800">
      <MapContainer
        center={[-0.0236, 37.9062]}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatmapLayer points={heatmapPoints} />

        <LayersControl position="topright">

          <LayersControl.Overlay checked name="Counties">
            <>
              {counties && (
                <GeoJSON
                  data={counties}
                  style={countyStyle}
                  onEachFeature={onEachFeature}
                />
              )}
            </>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Constituencies">
            <>
              {constituencies && (
                <GeoJSON
                  data={constituencies}
                  style={constituencyStyle}
                  onEachFeature={onEachFeature}
                />
              )}
            </>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Wards">
            <>
              {wards && (
                <GeoJSON
                  data={wards}
                  style={wardStyle}
                  onEachFeature={onEachFeature}
                />
              )}
            </>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Polling Station Clusters">
            <>
              <MarkerClusterGroup chunkedLoading>
                {pollingStations.map((station) => {
                  const isHotspot = hotspotCounties.has(station.county.toLowerCase());
                  return <PulseMarker key={station.id} station={station} intensity={isHotspot ? "high" : "normal"} />;
                })}
              </MarkerClusterGroup>
            </>
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
    </div>
  );
}