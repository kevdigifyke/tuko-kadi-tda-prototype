"use client";

import { useEffect, useState } from "react";

import {
  GeoJSON,
  LayersControl,
  MapContainer,
  TileLayer,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function IEBCBoundaryMap() {
  const [counties, setCounties] = useState<any>(null);

  const [constituencies, setConstituencies] =
    useState<any>(null);

  useEffect(() => {
    fetch("/geojson/counties.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded counties");
        setCounties(data);
      });

    fetch("/geojson/constituencies.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded constituencies");
        setConstituencies(data);
      });
  }, []);

  return (
    <div className="w-full h-[85vh] rounded-2xl overflow-hidden border border-cyan-500">
      <MapContainer
        center={[-0.0236, 37.9062]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LayersControl position="topright">

          {/* COUNTY LAYER */}

          <LayersControl.Overlay
            checked
            name="Counties"
          >
            <div>
              {counties && (
                <GeoJSON
                  data={counties}
                  style={() => ({
                    color: "#00FFFF",
                    weight: 2.5,
                    fillColor: "#00FFFF",
                    fillOpacity: 0.15,
                  })}
                  onEachFeature={(feature: any, layer: any) => {
                    const countyName =
                      feature.properties?.name ||
                      feature.properties?.COUNTY ||
                      "Unknown County";

                    layer.bindPopup(`
                      <div>
                        <strong>${countyName}</strong>
                      </div>
                    `);

                    layer.on({
                      mouseover: () => {
                        layer.setStyle({
                          fillOpacity: 0.4,
                          weight: 4,
                        });
                      },

                      mouseout: () => {
                        layer.setStyle({
                          fillOpacity: 0.15,
                          weight: 2.5,
                        });
                      },
                    });
                  }}
                />
              )}
            </div>
          </LayersControl.Overlay>

          {/* CONSTITUENCY LAYER */}

          <LayersControl.Overlay
            checked
            name="Constituencies"
          >
            <div>
              {constituencies && (
                <GeoJSON
                  data={constituencies}
                  style={() => ({
                    color: "#FF00AA",
                    weight: 1,
                    fillColor: "#FF00AA",
                    fillOpacity: 0.05,
                  })}
                  onEachFeature={(feature: any, layer: any) => {
                    const constituencyName =
                      feature.properties?.name ||
                      feature.properties?.CONSTITUENCY ||
                      "Unknown Constituency";

                    layer.bindPopup(`
                      <div>
                        <strong>${constituencyName}</strong>
                      </div>
                    `);

                    layer.on({
                      mouseover: () => {
                        layer.setStyle({
                          fillOpacity: 0.2,
                          weight: 2,
                        });
                      },

                      mouseout: () => {
                        layer.setStyle({
                          fillOpacity: 0.05,
                          weight: 1,
                        });
                      },
                    });
                  }}
                />
              )}
            </div>
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
    </div>
  );
}