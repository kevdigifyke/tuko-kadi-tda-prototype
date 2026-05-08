"use client";

import { useMemo } from "react";

const DEFAULT_COMMAND = "GESTURE_MODE_ACTIVE";

export function useGestureCommands(currentGesture: string) {
  return useMemo(() => {
    const command =
      currentGesture === "Pinch Select"
        ? "GRAPH_SELECT"
        : currentGesture === "Open Palm"
          ? "MODE_SWITCH"
          : currentGesture === "Fist Reset"
            ? "RESET_VIEW"
            : currentGesture === "Swipe"
              ? "TIMELINE_PLAY_PAUSE"
              : DEFAULT_COMMAND;

    const safeCommands = [
      "GESTURE_MODE_ACTIVE",
      "GRAPH_SELECT",
      "MODE_SWITCH",
      "FREEZE_VIEW",
      "RESET_VIEW",
      "TIMELINE_PLAY_PAUSE",
    ];

    return {
      command,
      safeCommands,
    };
  }, [currentGesture]);
}
