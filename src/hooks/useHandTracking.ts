"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { CameraStatus } from "@/src/hooks/useWebcam";

type Point3 = { x: number; y: number; z: number };

function distance(a: Point3, b: Point3) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function isFingerExtended(tip: Point3, pip: Point3) {
  return tip.y < pip.y;
}

function classifyGesture(landmarks: Point3[], movementX: number) {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const indexPip = landmarks[6];
  const middleTip = landmarks[12];
  const middlePip = landmarks[10];
  const ringTip = landmarks[16];
  const ringPip = landmarks[14];
  const pinkyTip = landmarks[20];
  const pinkyPip = landmarks[18];

  const pinchDistance = distance(thumbTip, indexTip);
  if (pinchDistance < 0.065) return "Pinch Select";

  const extendedCount = [
    isFingerExtended(indexTip, indexPip),
    isFingerExtended(middleTip, middlePip),
    isFingerExtended(ringTip, ringPip),
    isFingerExtended(pinkyTip, pinkyPip),
  ].filter(Boolean).length;

  if (Math.abs(movementX) > 0.08) return "Swipe";
  if (extendedCount >= 3) return "Open Palm";
  if (extendedCount <= 1) return "Fist Reset";

  return "Tracking";
}

export function useHandTracking(videoRef: RefObject<HTMLVideoElement | null>, cameraStatus: CameraStatus) {
  const [trackingStatus, setTrackingStatus] = useState<"idle" | "loading" | "warming_up" | "tracking" | "no_hand" | "unavailable" | "error">("idle");
  const [landmarks, setLandmarks] = useState<Point3[] | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [currentGesture, setCurrentGesture] = useState("Tracking");

  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<any>(null);
  const lastXRef = useRef<number | null>(null);
  const errorCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const MAX_TRACKING_ERRORS = 5;
    const cleanupRaf = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    async function setup() {
      if (cameraStatus !== "active" || !videoRef.current) {
        setTrackingStatus("idle");
        return;
      }

      setTrackingStatus("loading");

      try {
        const vision = await import("@mediapipe/tasks-vision");
        const fileset = await vision.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
        detectorRef.current = await vision.HandLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          },
          numHands: 1,
          runningMode: "VIDEO",
          minHandDetectionConfidence: 0.4,
          minHandPresenceConfidence: 0.4,
          minTrackingConfidence: 0.4,
        });
      } catch {
        setTrackingStatus("unavailable");
        return;
      }

      setTrackingStatus("warming_up");

      const loop = () => {
        if (cancelled || cameraStatus !== "active" || !videoRef.current || !detectorRef.current) {
          cleanupRaf();
          return;
        }

        const video = videoRef.current;
        if (video.readyState < 2 || video.videoWidth <= 0 || video.videoHeight <= 0) {
          setTrackingStatus("warming_up");
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        try {
          const now = performance.now();
          const result = detectorRef.current.detectForVideo(video, now);
          errorCountRef.current = 0;

          if (result?.landmarks?.length) {
            const points = result.landmarks[0] as Point3[];
            const score = result.handednesses?.[0]?.[0]?.score ?? null;
            const indexX = points[8]?.x ?? null;
            const movementX = indexX != null && lastXRef.current != null ? indexX - lastXRef.current : 0;

            setLandmarks(points);
            setConfidence(score);
            setCurrentGesture(classifyGesture(points, movementX));
            setTrackingStatus("tracking");

            if (indexX != null) {
              lastXRef.current = indexX;
            }
          } else {
            setLandmarks(null);
            setConfidence(null);
            setCurrentGesture("Tracking");
            setTrackingStatus("no_hand");
          }
        } catch {
          errorCountRef.current += 1;
          setLandmarks(null);
          setConfidence(null);
          setCurrentGesture("Tracking");
          if (errorCountRef.current >= MAX_TRACKING_ERRORS) {
            setTrackingStatus("unavailable");
            cleanupRaf();
            return;
          }
          setTrackingStatus("warming_up");
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    }

    setup();

    return () => {
      cancelled = true;
      cleanupRaf();
      if (detectorRef.current && typeof detectorRef.current.close === "function") {
        detectorRef.current.close();
      }
      detectorRef.current = null;
      setLandmarks(null);
      setConfidence(null);
      setCurrentGesture("Tracking");
      setTrackingStatus("idle");
      lastXRef.current = null;
      errorCountRef.current = 0;
    };
  }, [cameraStatus, videoRef]);

  return useMemo(
    () => ({ landmarks, confidence, currentGesture, trackingStatus }),
    [landmarks, confidence, currentGesture, trackingStatus],
  );
}
