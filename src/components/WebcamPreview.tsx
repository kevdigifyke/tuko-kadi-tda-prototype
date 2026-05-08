"use client";
import { RefObject, useEffect } from "react";
export function WebcamPreview({ videoRef, stream }: { videoRef: RefObject<HTMLVideoElement | null>; stream: MediaStream | null; }) {
  useEffect(() => { if (videoRef.current && stream) videoRef.current.srcObject = stream; }, [stream, videoRef]);
  return <video ref={videoRef} autoPlay muted playsInline className="h-32 w-full rounded border border-cyan-300/40 object-cover" />;
}
