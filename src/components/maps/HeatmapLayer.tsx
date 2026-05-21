"use client";

import { useEffect, useRef } from "react";
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
  const heatRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;

    const heatPoints = points.map((p) => [p.lat, p.lng, p.intensity]) as [number, number, number][];

    if (!heatRef.current) {
      heatRef.current = (L as any).heatLayer(heatPoints, {
        radius: 28,
        blur: 22,
        maxZoom: 10,
        minOpacity: 0.32,
      });
      heatRef.current.addTo(map);
      return;
    }

    heatRef.current.setLatLngs(heatPoints);
  }, [map, points]);

  useEffect(() => () => {
    if (map && heatRef.current) {
      map.removeLayer(heatRef.current);
    }
  }, [map]);

  return null;
}
