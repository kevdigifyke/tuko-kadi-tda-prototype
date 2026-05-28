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

type LeafletHeatFactory = typeof L & {
  heatLayer?: (pts: Array<[number, number, number]>, cfg: Record<string, number>) => L.Layer;
};

export default function HeatmapLayer({ points, intensityBoost = 1, visible = true }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;
    let heatLayer: L.Layer | null = null;
    let cancelled = false;

    const initHeatmap = async () => {
      const heatWindow = window as Window & { L?: LeafletHeatFactory };
      heatWindow.L = L as LeafletHeatFactory;
      await import("leaflet.heat");
      if (cancelled || !heatWindow.L?.heatLayer) return;

      heatLayer = heatWindow.L.heatLayer(
        points.map((p) => [p.lat, p.lng, Math.min(1, p.intensity * intensityBoost)]),
        { radius: 35 + intensityBoost * 5, blur: 25, maxZoom: 12, minOpacity: 0.33 },
      );

      requestAnimationFrame(() => {
        if (!cancelled) heatLayer?.addTo(map);
      });
    };

    initHeatmap();

    return () => {
      cancelled = true;
      if (heatLayer) map.removeLayer(heatLayer);
    };
  }, [map, points, intensityBoost, visible]);

  return null;
}
