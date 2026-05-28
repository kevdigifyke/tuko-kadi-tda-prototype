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
  intensityBoost?: number;
  visible?: boolean;
}

export default function HeatmapLayer({ points, intensityBoost = 1, visible = true }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;
    let heatLayer: { addTo: (m: unknown) => void } | null = null;

    const initHeatmap = async () => {
      const heatWindow = window as Window & { L?: typeof L & { heatLayer?: (pts: Array<[number, number, number]>, cfg: Record<string, number>) => { addTo: (m: unknown) => void } } };
      heatWindow.L = L as typeof L & { heatLayer?: (pts: Array<[number, number, number]>, cfg: Record<string, number>) => { addTo: (m: unknown) => void } };
      await import("leaflet.heat");
      if (!heatWindow.L?.heatLayer) return;

      heatLayer = heatWindow.L.heatLayer(
        points.map((p) => [p.lat, p.lng, Math.min(1, p.intensity * intensityBoost)]),
        { radius: 35 + intensityBoost * 5, blur: 25, maxZoom: 12, minOpacity: 0.33 }
      );

      if (!map || !heatLayer) return;

requestAnimationFrame(() => {
  heatLayer?.addTo(map);
});
    };

    initHeatmap();

    return () => {
      if (heatLayer) map.removeLayer(heatLayer);
    };
  }, [map, points, intensityBoost, visible]);

  return null;
}
