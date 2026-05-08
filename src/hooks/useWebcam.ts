"use client";
import { useCallback, useEffect, useState } from "react";
export type WebcamStatus = "simulated" | "active" | "denied";
export function useWebcam() {
  const [status, setStatus] = useState<WebcamStatus>("simulated");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const stopStream = useCallback(() => {
    setStream((current) => {
      current?.getTracks().forEach((track) => track.stop());
      return null;
    });
    setStatus("simulated");
  }, []);
  const enable = useCallback(async () => {
    if (!navigator?.mediaDevices?.getUserMedia) return setStatus("denied");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setStatus("active");
    } catch { setStatus("denied"); }
  }, []);
  useEffect(() => () => stopStream(), [stopStream]);
  return { status, stream, enable, stopStream };
}
