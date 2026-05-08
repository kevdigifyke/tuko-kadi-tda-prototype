"use client";

import { useEffect, useRef } from "react";
import { HandLandmarkOverlay } from "@/src/components/HandLandmarkOverlay";
import { WebcamPreview } from "@/src/components/WebcamPreview";
import { GestureCommand, useGestureCommands } from "@/src/hooks/useGestureCommands";
import { useHandTracking } from "@/src/hooks/useHandTracking";
import { useWebcam } from "@/src/hooks/useWebcam";

export function GesturePanel({ onCommand }: { onCommand?: (command: GestureCommand) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { status, stream, enable } = useWebcam();
  const tracking = useHandTracking(videoRef.current, status === "active");
  const commandState = useGestureCommands(tracking.points);

  useEffect(() => {
    if (commandState.command) onCommand?.(commandState.command);
  }, [commandState.command, onCommand]);

  return (
    <section className="floating-panel w-full max-w-[300px] p-4">
      <div className="flex items-center justify-between">
        <h2 className="panel-kicker text-[#00daf3]">Gesture Control HUD</h2>
        <p className="text-[10px] uppercase tracking-wider text-[#bac9cc]">Webcam: {status === "active" ? "Active" : status === "denied" ? "Denied" : "Simulated"}</p>
      </div>
      <div className="mt-3 rounded-md border border-cyan-300/30 bg-[#0b1417] p-2">
        {status === "active" ? (
          <div className="relative">
            <WebcamPreview videoRef={videoRef} stream={stream} />
            <HandLandmarkOverlay points={tracking.points} />
          </div>
        ) : (
          <div className="h-32 rounded border border-cyan-300/40 bg-[radial-gradient(circle_at_62%_34%,rgba(0,229,255,0.28),transparent_42%),radial-gradient(circle_at_34%_68%,rgba(124,77,255,0.2),transparent_40%),linear-gradient(130deg,#061017,#10222e)]" />
        )}
      </div>
      {status !== "active" && <button onClick={enable} className="mt-3 w-full rounded border border-cyan-300/40 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200">Enable Camera</button>}
      <div className="mt-3 border-b border-white/10 pb-2">
        <p className="text-xs text-[#bac9cc]">Current Gesture</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-h2 text-[#dce4e5]">{commandState.gesture}</p>
          <p className="font-mono text-sm font-semibold text-[#00e5ff]">{Math.round((status === "active" ? tracking.confidence : commandState.confidence) * 100)}% CONF</p>
        </div>
      </div>
    </section>
  );
}
