"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number;
}

interface HeatmapLayerProps {
  points: HeatPoint[];
}

export default function HeatmapLayer({
  points,
}: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    let heatLayer: any;

    async function loadHeatmap() {
      const L = await import("leaflet");

      await import("leaflet.heat");

      heatLayer = (L as any).heatLayer(
        points.map((p) => [
          p.lat,
          p.lng,
          p.intensity,
        ]),
        {
          radius: 25,
          blur: 15,
          maxZoom: 10,
        }
      );

      heatLayer.addTo(map);
    }

    loadHeatmap();

    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points]);

  return null;
}