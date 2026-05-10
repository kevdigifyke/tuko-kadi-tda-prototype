"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus =
  | "idle"
  | "requesting"
  | "active"
  | "stopped"
  | "denied"
  | "unavailable"
  | "error";

type VideoDimensions = {
  width: number;
  height: number;
};

const EMPTY_DIMENSIONS: VideoDimensions = { width: 0, height: 0 };

function delay(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

async function waitForVideoElement(
  getVideo: () => HTMLVideoElement | null,
  timeoutMs = 2500,
) {
  const startedAt = performance.now();

  while (performance.now() - startedAt < timeoutMs) {
    const video = getVideo();

    if (video) {
      return video;
    }

    await delay(50);
  }

  return null;
}

async function waitForUsableVideoFrame(
  video: HTMLVideoElement,
  timeoutMs = 4500,
) {
  const startedAt = performance.now();

  while (performance.now() - startedAt < timeoutMs) {
    if (
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
      video.videoWidth > 0 &&
      video.videoHeight > 0
    ) {
      return true;
    }

    await delay(50);
  }

  return false;
}

async function getCameraStream() {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === "OverconstrainedError" || error.name === "NotFoundError")
    ) {
      return navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    }

    throw error;
  }
}

export function useWebcam() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle");
  const [videoReady, setVideoReady] = useState(false);
  const [videoDimensions, setVideoDimensions] =
    useState<VideoDimensions>(EMPTY_DIMENSIONS);
  const [cameraErrorName, setCameraErrorName] = useState<string | null>(null);
  const [cameraErrorMessage, setCameraErrorMessage] = useState<string | null>(
    null,
  );

  const setCameraError = useCallback((name: string, message: string) => {
    setCameraErrorName(name);
    setCameraErrorMessage(message);
  }, []);

  const clearCameraError = useCallback(() => {
    setCameraErrorName(null);
    setCameraErrorMessage(null);
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const video = videoRef.current;

    if (video) {
      video.pause();
      video.srcObject = null;
      video.removeAttribute("src");
      video.load();
    }

    setVideoReady(false);
    setVideoDimensions(EMPTY_DIMENSIONS);
    clearCameraError();
    setCameraStatus("stopped");
  }, [clearCameraError]);

  const startCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("unavailable");
      setCameraError(
        "MediaDevicesUnavailable",
        "This browser or preview URL cannot access camera devices.",
      );
      return;
    }

    if (!window.isSecureContext) {
      setCameraStatus("unavailable");
      setCameraError(
        "InsecureContext",
        "Camera access requires HTTPS or localhost.",
      );
      return;
    }

    stopCamera();
    clearCameraError();
    setVideoReady(false);
    setVideoDimensions(EMPTY_DIMENSIONS);
    setCameraStatus("requesting");

    try {
      const video = await waitForVideoElement(() => videoRef.current);

      if (!video) {
        setCameraStatus("error");
        setCameraError(
          "VideoElementMissing",
          "The camera preview element was not ready. Reload the page and try again.",
        );
        return;
      }

      const stream = await getCameraStream();
      streamRef.current = stream;
      video.srcObject = stream;

      await video.play();

      const hasUsableFrame = await waitForUsableVideoFrame(video);

      if (!hasUsableFrame) {
        setCameraStatus("error");
        setCameraError(
          "VideoFrameUnavailable",
          "Camera opened, but no usable video frame was received.",
        );
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        video.srcObject = null;
        setVideoReady(false);
        setVideoDimensions(EMPTY_DIMENSIONS);
        return;
      }

      setVideoDimensions({
        width: video.videoWidth,
        height: video.videoHeight,
      });
      setVideoReady(true);
      setCameraStatus("active");
    } catch (error) {
      setVideoReady(false);
      setVideoDimensions(EMPTY_DIMENSIONS);

      const name = error instanceof DOMException ? error.name : "CameraError";
      const message =
        error instanceof Error
          ? error.message
          : "Camera could not be started.";

      if (name === "NotAllowedError" || name === "SecurityError") {
        setCameraStatus("denied");
        setCameraError(
          name,
          "Camera permission was denied. Allow camera access in the browser site settings, reload, then retry.",
        );
        return;
      }

      if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setCameraStatus("unavailable");
        setCameraError(
          name,
          "No camera device was found by the browser.",
        );
        return;
      }

      if (name === "NotReadableError" || name === "TrackStartError") {
        setCameraStatus("error");
        setCameraError(
          name,
          "The camera may already be in use by another browser tab, app, or dev preview port.",
        );
        return;
      }

      setCameraStatus("error");
      setCameraError(name, message);
    }
  }, [clearCameraError, setCameraError, stopCamera]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return {
    videoRef,
    cameraStatus,
    videoReady,
    videoDimensions,
    cameraErrorName,
    cameraErrorMessage,
    cameraError:
      cameraErrorName && cameraErrorMessage
        ? `${cameraErrorName}: ${cameraErrorMessage}`
        : null,
    startCamera,
    stopCamera,
  };
}
