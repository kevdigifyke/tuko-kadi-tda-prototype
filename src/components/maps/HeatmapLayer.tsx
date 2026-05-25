"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

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

    const initHeatmap = async () => {
      // bind leaflet globally
      (window as any).L = L;

      // dynamically import plugin AFTER binding
      await import("leaflet.heat");

      // SAFETY CHECK
      if (!(window as any).L.heatLayer) {
        console.error("HeatLayer failed to initialize");
        return;
      }

      heatLayer = (window as any).L.heatLayer(
        points.map((p) => [
          p.lat,
          p.lng,
          p.intensity,
        ]),
        {
          radius: 35,
          blur: 25,
          maxZoom: 10,
          minOpacity: 0.4,
        }
      );

      heatLayer.addTo(map);
    };

    initHeatmap();

    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points]);

  return null;
}