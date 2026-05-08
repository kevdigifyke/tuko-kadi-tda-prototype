"use client";
import { useMemo, useRef } from "react";
export type GestureCommand = "GESTURE_MODE_ACTIVE" | "GRAPH_SELECT" | "MODE_SWITCH" | "FREEZE_VIEW" | "RESET_VIEW" | "TIMELINE_PLAY_PAUSE";
export function useGestureCommands(points: { x: number; y: number; z: number }[]) {
  const trailRef = useRef<number[]>([]);
  return useMemo(() => {
    if (!points.length) return { gesture: "No hand", confidence: 0, command: null as GestureCommand | null };
    const thumb = points[4], index = points[8], wrist = points[0], middle = points[12];
    const pinchDistance = Math.hypot(thumb.x - index.x, thumb.y - index.y);
    const openDistance = Math.hypot(wrist.x - middle.x, wrist.y - middle.y);
    trailRef.current = [...trailRef.current.slice(-6), index.x];
    const movement = trailRef.current[trailRef.current.length - 1] - trailRef.current[0];
    if (pinchDistance < 0.05) return { gesture: "Pinch", confidence: 0.92, command: "GRAPH_SELECT" as const };
    if (Math.abs(movement) > 0.2) return { gesture: movement > 0 ? "Swipe Right" : "Swipe Left", confidence: 0.78, command: "MODE_SWITCH" as const };
    if (openDistance > 0.28) return { gesture: "Open Palm", confidence: 0.86, command: "GESTURE_MODE_ACTIVE" as const };
    if (openDistance < 0.18) return { gesture: "Fist", confidence: 0.82, command: "RESET_VIEW" as const };
    return { gesture: "Tracking", confidence: 0.6, command: null };
  }, [points]);
}
