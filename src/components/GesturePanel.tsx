"use client";

import { HandLandmarkOverlay } from "@/src/components/HandLandmarkOverlay";
import { useGestureCommands } from "@/src/hooks/useGestureCommands";
import { useHandTracking } from "@/src/hooks/useHandTracking";
import { useWebcam } from "@/src/hooks/useWebcam";

export function GesturePanel() {
  const { videoRef, cameraStatus, startCamera, stopCamera } = useWebcam();
  const { landmarks, confidence, currentGesture, trackingStatus } = useHandTracking(videoRef, cameraStatus);
  const { command } = useGestureCommands(currentGesture);

  const cameraLabel =
    cameraStatus === "active"
      ? "Camera: Active"
      : cameraStatus === "denied"
        ? "Camera: Denied"
        : cameraStatus === "unavailable"
          ? "Camera: Unavailable"
          : cameraStatus === "stopped"
            ? "Camera: Stopped"
            : "Camera: Simulated";

  const trackingLabel =
    trackingStatus === "loading"
      ? "Tracking: Loading"
      : trackingStatus === "warming_up"
        ? "Tracking: Warming Up"
        : trackingStatus === "tracking"
          ? "Tracking: Tracking"
          : trackingStatus === "no_hand"
            ? "Tracking: No hand detected"
            : trackingStatus === "unavailable"
              ? "Tracking: Unavailable"
              : trackingStatus === "error"
                ? "Tracking: Error"
                : "Tracking: Idle";

  return (
    <section className="floating-panel w-full max-w-[300px] p-4">
      <h2 className="panel-kicker text-[#00daf3]">Gesture Control HUD</h2>

      <div className="mt-3 rounded-md border border-cyan-300/30 bg-[#0b1417] p-2">
        <div className="relative h-32 overflow-hidden rounded border border-cyan-300/40 bg-[radial-gradient(circle_at_62%_34%,rgba(0,229,255,0.28),transparent_42%),radial-gradient(circle_at_34%_68%,rgba(124,77,255,0.2),transparent_40%),linear-gradient(130deg,#061017,#10222e)]">
          {cameraStatus === "active" ? (
            <>
              <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
              <HandLandmarkOverlay landmarks={landmarks} />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[#bac9cc]">Simulated sensor feed</div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {cameraStatus === "active" ? (
          <button
            type="button"
            onClick={stopCamera}
            className="rounded border border-cyan-300/40 bg-cyan-400/10 px-2 py-1 text-xs font-semibold text-[#00e5ff]"
          >
            Stop Camera
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
      <p className="mt-1 text-xs text-[#bac9cc]">{trackingLabel}</p>

      <div className="mt-3 border-b border-white/10 pb-2">
        <p className="text-xs text-[#bac9cc]">Current Gesture</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-h2 text-[#dce4e5]">{currentGesture}</p>
          <p className="font-mono text-sm font-semibold text-[#00e5ff]">
            {confidence != null ? `${Math.round(confidence * 100)}% CONF` : "--"}
          </p>
        </div>
        {trackingStatus === "unavailable" && (
          <p className="mt-1 text-[10px] text-[#ffb4ab]">Tracking unavailable; webcam preview remains active.</p>
        )}
      </div>

      <p className="panel-kicker mt-3 text-[#bac9cc]">Gesture Library</p>
      <div className="mt-2 space-y-2 text-sm">
        <div className="flex items-center justify-between rounded-sm border border-cyan-300/40 bg-cyan-400/10 px-3 py-2"><span>Pinch</span><span className="text-[#00e5ff]">Select/Drag</span></div>
        <div className="flex items-center justify-between rounded-sm border border-white/15 bg-[#151d1e] px-3 py-2 text-[#bac9cc]"><span>Open Palm</span><span>Mode Switch</span></div>
        <div className="flex items-center justify-between rounded-sm border border-white/15 bg-[#151d1e] px-3 py-2 text-[#bac9cc]"><span>Fist</span><span>Reset View</span></div>
        <div className="flex items-center justify-between rounded-sm border border-white/15 bg-[#151d1e] px-3 py-2 text-[#bac9cc]"><span>Swipe</span><span>Timeline</span></div>
      </div>
      <p className="mt-2 font-mono text-[10px] text-[#7da3a9]">Command: {command}</p>
    </section>
  );
}
