"use client";

import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
  LayersControl,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { pollingStations } from "@/data/geo/pollingStations";

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
  };

  return (
    <div className="h-[85vh] w-full rounded-2xl overflow-hidden border border-zinc-800">
      <MapContainer
        center={[-0.0236, 37.9062]}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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

          <LayersControl.Overlay checked name="Polling Stations">
            <>
              {pollingStations.map((station) => (
                <CircleMarker
                  key={station.id}
                  center={[station.lat, station.lng]}
                  radius={Math.max(5, station.turnout / 15)}
                  pathOptions={{
                    color:
                      station.anomalyScore > 0.6
                        ? "#FF0000"
                        : station.anomalyScore > 0.3
                        ? "#FFD700"
                        : "#00FFAA",
                    fillOpacity: 0.7,
                  }}
                >
                  <Popup>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm">
                        {station.name}
                      </h3>

                      <p>County: {station.county}</p>
                      <p>Constituency: {station.constituency}</p>
                      <p>Ward: {station.ward}</p>
                      <p>Turnout: {station.turnout}%</p>

                      <p>
                        Anomaly Score:{" "}
                        {station.anomalyScore}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </>
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
    </div>
  );
}