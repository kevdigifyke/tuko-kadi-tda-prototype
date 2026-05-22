"use client";

import { useEffect, useState } from "react";

import HeatmapLayer from "./HeatmapLayer";
import PulseMarker from "./PulseMarker";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  CircleMarker,
} from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";

import { pollingStations } from "../../data/geo/pollingStations";
import { mockFieldReports } from "@/data/mobile/mockFieldReports";

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

  const countyStyle = {
    color: "#00FFFF",
    weight: 3,
    fillOpacity: 0.08,
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
          weight: 4,
          fillOpacity: 0.2,
        });
      },

      mouseout: (e: any) => {
        e.target.setStyle({
          weight: 2,
          fillOpacity: 0.08,
        });
      },
    });
  };

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
                {pollingStations.map((station) => (
                  <PulseMarker
                    key={station.id}
                    station={station}
                  />
                ))}
              </MarkerClusterGroup>
            </>
          </LayersControl.Overlay>

        
          <LayersControl.Overlay checked name="Live Field Reports">
            <>
              {mockFieldReports.flatMap((report) => {
                const severityColor =
                  report.severity === "critical"
                    ? "#ef4444"
                    : report.severity === "high"
                    ? "#f97316"
                    : report.severity === "moderate"
                    ? "#eab308"
                    : "#22c55e";

                return [
                    <PulseMarker
                      key={`${report.id}-pulse`}
                      station={{
                        id: report.id,
                        name: report.pollingStation,
                        county: report.county,
                        constituency: report.constituency,
                        ward: report.ward,
                        lat: report.coordinates.lat,
                        lng: report.coordinates.lng,
                        turnout: report.turnoutPct,
                        anomalyScore: report.severity === "critical" ? 95 : report.severity === "high" ? 75 : 55,
                      }}
                    />,
                    <CircleMarker
                      key={`${report.id}-ring`}
                      center={[report.coordinates.lat, report.coordinates.lng]}
                      radius={26}
                      pathOptions={{ color: severityColor, fillOpacity: 0.05, weight: 1 }}
                    />,
                  ];
              })}
            </>
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
    </div>
  );
}