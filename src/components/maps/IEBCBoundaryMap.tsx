"use client";

import { useEffect, useMemo, useState } from "react";

import HeatmapLayer from "./HeatmapLayer";
import PulseMarker from "./PulseMarker";
import ReplayControls from "./ReplayControls";
import ReplayStatusBar from "./ReplayStatusBar";

import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";

import useReplayEngine from "@/lib/tda/useReplayEngine";

export default function IEBCBoundaryMap() {
  const [counties, setCounties] = useState<any>(null);
  const [constituencies, setConstituencies] = useState<any>(null);
  const [wards, setWards] = useState<any>(null);

  const {
    currentFrame,
    currentIndex,
    maxIndex,
    isPlaying,
    speed,
    speedOptions,
    play,
    pause,
    reset,
    scrubTo,
    setSpeed,
  } = useReplayEngine();

  useEffect(() => {
    fetch("/geojson/kenya_counties.geojson").then((res) => res.json()).then(setCounties);
    fetch("/geojson/kenya_constituencies.geojson").then((res) => res.json()).then(setConstituencies);
    fetch("/geojson/kenya_wards.geojson").then((res) => res.json()).then(setWards);
  }, []);

  const countyStyle = { color: "#00FFFF", weight: 3, fillOpacity: 0.08 };
  const constituencyStyle = { color: "#FFD700", weight: 2, fillOpacity: 0.05 };
  const wardStyle = { color: "#FF4D6D", weight: 1, fillOpacity: 0.03 };

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;
    const name = props.COUNTY || props.CONSTITUENCY || props.WARD || props.name || "Unknown";
    layer.bindTooltip(name, { sticky: true });
    layer.on({
      mouseover: (e: any) => e.target.setStyle({ weight: 4, fillOpacity: 0.2 }),
      mouseout: (e: any) => e.target.setStyle({ weight: 2, fillOpacity: 0.08 }),
    });
  };

  const stations = currentFrame?.stations ?? [];

  const heatmapPoints = stations.map((station) => ({
    lat: station.lat,
    lng: station.lng,
    intensity: Math.min(1, station.turnout / 100 + station.anomalyScore * 0.35),
  }));

  const analytics = useMemo(() => {
    if (!stations.length) {
      return { activeVotersEstimate: 0, nationalTurnout: 0, activeAnomalies: 0, highestRiskCounty: "N/A" };
    }

    const activeVotersEstimate = stations.reduce((sum, s) => sum + s.cumulativeVotes, 0);
    const totalRegistered = stations.reduce((sum, s) => sum + s.voters, 0);
    const nationalTurnout = totalRegistered ? (activeVotersEstimate / totalRegistered) * 100 : 0;
    const activeAnomalies = stations.filter((s) => s.anomalyScore >= 0.65).length;
    const topStation = [...stations].sort((a, b) => b.spatialRisk - a.spatialRisk)[0];

    return {
      activeVotersEstimate,
      nationalTurnout,
      activeAnomalies,
      highestRiskCounty: topStation?.county ?? "N/A",
    };
  }, [stations]);

  const currentTimeLabel = currentFrame
    ? new Date(currentFrame.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "--:--";

  return (
    <div className="relative h-[85vh] w-full overflow-hidden rounded-2xl border border-zinc-800">
      <ReplayStatusBar
        currentTime={currentTimeLabel}
        activeVotersEstimate={analytics.activeVotersEstimate}
        nationalTurnout={analytics.nationalTurnout}
        activeAnomalies={analytics.activeAnomalies}
        highestRiskCounty={analytics.highestRiskCounty}
      />

      <MapContainer center={[-0.0236, 37.9062]} zoom={6} scrollWheelZoom className="z-0 h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatmapLayer points={heatmapPoints} />
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Counties">{counties && <GeoJSON data={counties} style={countyStyle} onEachFeature={onEachFeature} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Constituencies">{constituencies && <GeoJSON data={constituencies} style={constituencyStyle} onEachFeature={onEachFeature} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Wards">{wards && <GeoJSON data={wards} style={wardStyle} onEachFeature={onEachFeature} />}</LayersControl.Overlay>
          <LayersControl.Overlay checked name="Polling Station Clusters">
            <MarkerClusterGroup chunkedLoading>
              {stations.map((station) => <PulseMarker key={`${station.id}-${currentIndex}`} station={station} />)}
            </MarkerClusterGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      <ReplayControls
        isPlaying={isPlaying}
        currentIndex={currentIndex}
        maxIndex={maxIndex}
        speed={speed}
        speedOptions={speedOptions}
        currentTimeLabel={currentTimeLabel}
        onPlay={play}
        onPause={pause}
        onReset={reset}
        onScrub={scrubTo}
        onSpeedChange={(nextSpeed) => setSpeed(nextSpeed as 0.5 | 1 | 2 | 4)}
      />
    </div>
  );
}
