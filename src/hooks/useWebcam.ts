"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "idle" | "requesting" | "active" | "stopped" | "denied" | "unavailable";

export function useWebcam() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle");
  const [videoReady, setVideoReady] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setVideoReady(false);
    setVideoDimensions({ width: 0, height: 0 });
    setCameraError(null);
    setCameraStatus("idle");
  }, []);

  const startCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("unavailable");
      return;
    }

    stopCamera();
    setCameraError(null);
    setCameraStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setCameraStatus("unavailable");
        return;
      }

      video.srcObject = stream;

      await new Promise<void>((resolve) => {
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          resolve();
          return;
        }

        const onReady = () => {
          video.removeEventListener("loadedmetadata", onReady);
          video.removeEventListener("canplay", onReady);
          resolve();
        };

        video.addEventListener("loadedmetadata", onReady, { once: true });
        video.addEventListener("canplay", onReady, { once: true });
      });

      try {
        await video.play();
      } catch {
        setCameraError("Unable to start video playback. Try reloading the page and enabling camera again.");
        setCameraStatus("unavailable");
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        video.srcObject = null;
        setVideoReady(false);
        setVideoDimensions({ width: 0, height: 0 });
        return;
      }

      setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
      setVideoReady(video.videoWidth > 0 && video.videoHeight > 0);
      setCameraStatus("active");
    } catch (error) {
      setVideoReady(false);
      setVideoDimensions({ width: 0, height: 0 });
      if (error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError")) {
        setCameraStatus("denied");
        setCameraError("Camera permission was denied.");
      } else {
        setCameraStatus("unavailable");
        setCameraError("Camera is unavailable on this device or browser.");
      }
    }
  }, [stopCamera]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return {
    videoRef,
    cameraStatus,
    videoReady,
    videoDimensions,
    cameraError,
    startCamera,
    stopCamera,
  };
}
