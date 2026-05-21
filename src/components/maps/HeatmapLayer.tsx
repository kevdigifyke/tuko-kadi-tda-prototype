"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number;
}

interface Props {
  points: HeatPoint[];
}

export default function HeatmapLayer({ points }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatPoints = points.map((p) => [
      p.lat,
      p.lng,
      p.intensity,
    ]) as [number, number, number][];

    const heatLayer = (L as any).heatLayer(heatPoints, {
      radius: 25,
      blur: 20,
      maxZoom: 10,
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}