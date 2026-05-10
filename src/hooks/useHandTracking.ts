"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { CameraStatus } from "@/src/hooks/useWebcam";

type Point3 = { x: number; y: number; z: number };
type TrackingStatus =
  | "idle"
  | "loading"
  | "warming_up"
  | "tracking"
  | "no_hand"
  | "error"
  | "unavailable";

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

  if (!thumbTip || !indexTip) return "Tracking";

  const pinchDistance = distance(thumbTip, indexTip);

  if (pinchDistance < 0.065) {
    return "Pinch Select";
  }

  const extendedCount = [
    indexTip && indexPip ? isFingerExtended(indexTip, indexPip) : false,
    middleTip && middlePip ? isFingerExtended(middleTip, middlePip) : false,
    ringTip && ringPip ? isFingerExtended(ringTip, ringPip) : false,
    pinkyTip && pinkyPip ? isFingerExtended(pinkyTip, pinkyPip) : false,
  ].filter(Boolean).length;

  if (Math.abs(movementX) > 0.08) {
    return "Swipe";
  }

  if (extendedCount >= 3) {
    return "Open Palm";
  }

  if (extendedCount <= 1) {
    return "Fist Reset";
  }

  return "Tracking";
}

export function useHandTracking(
  videoRef: RefObject<HTMLVideoElement | null>,
  cameraStatus: CameraStatus,
  videoReady: boolean,
) {
  const [landmarks, setLandmarks] = useState<Point3[] | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [currentGesture, setCurrentGesture] = useState("Tracking");
  const [isTrackingAvailable, setIsTrackingAvailable] = useState(true);
  const [trackingStatus, setTrackingStatus] =
    useState<TrackingStatus>("idle");

  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<any>(null);
  const lastXRef = useRef<number | null>(null);
  const detectErrorCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    if (cameraStatus !== "active" || !videoReady || !videoRef.current) {
      setLandmarks(null);
      setConfidence(null);
      setCurrentGesture("Tracking");
      setTrackingStatus(cameraStatus === "active" ? "warming_up" : "idle");
      return;
    }

    async function setup() {
      setIsTrackingAvailable(true);
      setTrackingStatus("loading");

      try {
        const vision = await import("@mediapipe/tasks-vision");
        const fileset = await vision.FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );

        if (cancelled) return;

        detectorRef.current = await vision.HandLandmarker.createFromOptions(
          fileset,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            },
            numHands: 1,
            runningMode: "VIDEO",
            minHandDetectionConfidence: 0.4,
            minHandPresenceConfidence: 0.4,
            minTrackingConfidence: 0.4,
          },
        );
      } catch {
        setIsTrackingAvailable(false);
        setTrackingStatus("unavailable");
        return;
      }

      const loop = () => {
        if (cancelled || !videoRef.current || !detectorRef.current) return;

        const video = videoRef.current;
        const hasUsableFrame =
          video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
          video.videoWidth > 0 &&
          video.videoHeight > 0;

        if (!hasUsableFrame) {
          setTrackingStatus("warming_up");
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        try {
          const result = detectorRef.current.detectForVideo(
            video,
            performance.now(),
          );

          detectErrorCountRef.current = 0;

          if (result?.landmarks?.length) {
            const points = result.landmarks[0] as Point3[];
            const score = result.handednesses?.[0]?.[0]?.score ?? null;
            const indexX = points[8]?.x ?? null;
            const movementX =
              indexX != null && lastXRef.current != null
                ? indexX - lastXRef.current
                : 0;

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
          detectErrorCountRef.current += 1;
          setTrackingStatus("error");

          if (detectErrorCountRef.current > 5) {
            setIsTrackingAvailable(false);
            return;
          }
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    }

    setup();

    return () => {
      cancelled = true;

      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }

      if (detectorRef.current && typeof detectorRef.current.close === "function") {
        detectorRef.current.close();
      }

      rafRef.current = null;
      detectorRef.current = null;
      lastXRef.current = null;
      detectErrorCountRef.current = 0;

      setLandmarks(null);
      setConfidence(null);
      setCurrentGesture("Tracking");
      setTrackingStatus("idle");
    };
  }, [cameraStatus, videoReady, videoRef]);

  return useMemo(
    () => ({
      landmarks,
      confidence,
      currentGesture,
      isTrackingAvailable,
      trackingStatus,
    }),
    [
      landmarks,
      confidence,
      currentGesture,
      isTrackingAvailable,
      trackingStatus,
    ],
  );
}
