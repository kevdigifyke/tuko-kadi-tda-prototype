"use client";
import { useEffect, useRef, useState } from "react";
export interface HandTrackingState { points: { x: number; y: number; z: number }[]; confidence: number; ready: boolean; }
export function useHandTracking(video: HTMLVideoElement | null, enabled: boolean) {
  const [tracking, setTracking] = useState<HandTrackingState>({ points: [], confidence: 0, ready: false });
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!enabled || !video) return;
    let mounted = true; let handLandmarker: any; let lastVideoTime = -1;
    (async () => {
      const vision = await import("@mediapipe/tasks-vision");
      const filesetResolver = await vision.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
      handLandmarker = await vision.HandLandmarker.createFromOptions(filesetResolver, {
        baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task", delegate: "GPU" },
        numHands: 1, runningMode: "VIDEO",
      });
      const loop = () => {
        if (!mounted || !video) return;
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          const result = handLandmarker.detectForVideo(video, performance.now());
          setTracking({ points: result.landmarks?.[0] ?? [], confidence: result.handednesses?.[0]?.[0]?.score ?? 0, ready: true });
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    })().catch(() => mounted && setTracking({ points: [], confidence: 0, ready: false }));
    return () => { mounted = false; if (rafRef.current) cancelAnimationFrame(rafRef.current); handLandmarker?.close?.(); };
  }, [enabled, video]);
  return tracking;
}
