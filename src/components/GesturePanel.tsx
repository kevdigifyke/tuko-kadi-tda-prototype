"use client";

import { HandLandmarkOverlay } from "@/src/components/HandLandmarkOverlay";
import {
  type GestureCommandEvent,
  useGestureCommands,
} from "@/src/hooks/useGestureCommands";
import { useHandTracking } from "@/src/hooks/useHandTracking";
import { useWebcam } from "@/src/hooks/useWebcam";
import { useEffect } from "react";

type GesturePanelProps = {
  onGestureCommand?: (commandEvent: GestureCommandEvent) => void;
};

export function GesturePanel({ onGestureCommand }: GesturePanelProps) {
  const {
    videoRef,
    cameraStatus,
    videoReady,
    videoDimensions,
    cameraErrorName,
    cameraErrorMessage,
    startCamera,
    stopCamera,
  } = useWebcam();

  const {
    landmarks,
    confidence,
    currentGesture,
    isTrackingAvailable,
    trackingStatus,
  } = useHandTracking(videoRef, cameraStatus, videoReady);

  const { command, commandLabel, commandPulseId } = useGestureCommands(currentGesture);



  useEffect(() => {
    if (!onGestureCommand || command === "NONE" || commandPulseId === 0) {
      return;
    }

    onGestureCommand({
      command,
      label: commandLabel,
      gesture: currentGesture,
      timestamp: commandPulseId,
    });
  }, [command, commandLabel, commandPulseId, currentGesture, onGestureCommand]);

  const cameraLabel =
    cameraStatus === "active"
      ? "Camera: Active"
      : cameraStatus === "denied"
        ? "Camera: Denied"
        : cameraStatus === "unavailable"
          ? "Camera: Unavailable"
          : cameraStatus === "error"
            ? "Camera: Error"
            : cameraStatus === "stopped"
              ? "Camera: Stopped"
              : cameraStatus === "requesting"
                ? "Camera: Requesting"
                : "Camera: Simulated";

  const showVideo = cameraStatus === "active" || cameraStatus === "requesting";

  return (
    <section className="floating-panel w-full max-w-[300px] p-4">
      <h2 className="panel-kicker text-[#00daf3]">Gesture Control HUD</h2>

      <div className="mt-3 rounded-md border border-cyan-300/30 bg-[#0b1417] p-2">
        <div className="relative h-32 overflow-hidden rounded border border-cyan-300/40 bg-[#061017]">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-[#0b1417] to-[#061017]" />

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              showVideo ? "opacity-100" : "opacity-0"
            }`}
          />

          {showVideo && (
            <div className="pointer-events-none absolute inset-0">
              <HandLandmarkOverlay landmarks={landmarks} />
            </div>
          )}

          {!showVideo && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-[#bac9cc]">
              Simulated sensor feed
            </div>
          )}

          {showVideo && !videoReady && (
            <p className="pointer-events-none absolute bottom-1 left-2 font-mono text-[10px] text-cyan-100/80">
              Waiting for camera frame...
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {cameraStatus === "active" ? (
          <button
            type="button"
            onClick={stopCamera}
            className="rounded border border-rose-300/40 bg-rose-400/10 px-2 py-1 text-xs font-semibold text-rose-200"
          >
            Stop Camera
          </button>
        ) : cameraStatus === "denied" ||
          cameraStatus === "unavailable" ||
          cameraStatus === "error" ? (
          <button
            type="button"
            onClick={startCamera}
            className="rounded border border-amber-300/40 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-200"
          >
            Retry Camera
          </button>
        ) : (
          <button
            type="button"
            onClick={startCamera}
            disabled={cameraStatus === "requesting"}
            className="rounded border border-cyan-300/40 bg-cyan-400/10 px-2 py-1 text-xs font-semibold text-[#00e5ff] disabled:opacity-60"
          >
            {cameraStatus === "requesting" ? "Requesting…" : "Enable Camera"}
          </button>
        )}

        <p className="text-xs text-[#bac9cc]">{cameraLabel}</p>
      </div>

      {cameraStatus === "denied" && (
        <p className="mt-2 text-[10px] text-[#ffb4ab]">
          Camera access denied. Use the browser camera icon/site settings to
          allow access, reload this preview URL, then retry.
        </p>
      )}

      {(cameraStatus === "unavailable" || cameraStatus === "error") &&
        (cameraErrorName || cameraErrorMessage) && (
          <p className="mt-2 text-[10px] text-[#ffb4ab]">
            {cameraErrorName ? `${cameraErrorName}: ` : ""}
            {cameraErrorMessage}
          </p>
        )}

      <p className="mt-2 font-mono text-[10px] text-[#7da3a9]">
        cam:{cameraStatus} ready:{String(videoReady)} dim:
        {videoDimensions.width}x{videoDimensions.height} track:{trackingStatus}
      </p>

      <div className="mt-3 border-b border-white/10 pb-2">
        <p className="text-xs text-[#bac9cc]">Current Gesture</p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-h2 text-[#dce4e5]">{currentGesture}</p>
          <p className="font-mono text-sm font-semibold text-[#00e5ff]">
            {confidence != null ? `${Math.round(confidence * 100)}% CONF` : "--"}
          </p>
        </div>

        {!isTrackingAvailable && (
          <p className="mt-1 text-[10px] text-[#ffb4ab]">
            Tracking unavailable; webcam preview remains active.
          </p>
        )}
      </div>

      <p className="panel-kicker mt-3 text-[#bac9cc]">Gesture Library</p>

      <div className="mt-2 space-y-2 text-sm">
        <div className="flex items-center justify-between rounded-sm border border-cyan-300/40 bg-cyan-400/10 px-3 py-2">
          <span>Pinch</span>
          <span className="text-[#00e5ff]">Select/Drag</span>
        </div>

        <div className="flex items-center justify-between rounded-sm border border-white/15 bg-[#151d1e] px-3 py-2 text-[#bac9cc]">
          <span>Open Palm</span>
          <span>Mode Switch</span>
        </div>

        <div className="flex items-center justify-between rounded-sm border border-white/15 bg-[#151d1e] px-3 py-2 text-[#bac9cc]">
          <span>Fist</span>
          <span>Reset View</span>
        </div>

        <div className="flex items-center justify-between rounded-sm border border-white/15 bg-[#151d1e] px-3 py-2 text-[#bac9cc]">
          <span>Swipe</span>
          <span>Timeline</span>
        </div>
      </div>

      <p className="mt-2 font-mono text-[10px] text-[#7da3a9]">
        Command: {command} · {commandLabel}
      </p>
    </section>
  );
}