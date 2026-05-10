"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type GestureCommand =
  | "GESTURE_MODE_ACTIVE"
  | "GRAPH_SELECT_NEXT"
  | "MODE_SWITCH_NEXT"
  | "FREEZE_VIEW_TOGGLE"
  | "RESET_VIEW"
  | "TIMELINE_PLAY_PAUSE"
  | "NONE";

export type GestureCommandEvent = {
  command: GestureCommand;
  label: string;
  gesture: string;
  timestamp: number;
};

type UseGestureCommandsResult = {
  command: GestureCommand;
  lastCommand: GestureCommand;
  commandLabel: string;
  commandPulseId: number;
};

const COMMAND_LABELS: Record<GestureCommand, string> = {
  GESTURE_MODE_ACTIVE: "Open Palm: gesture mode active",
  GRAPH_SELECT_NEXT: "Pinch: selected next anomaly cluster",
  MODE_SWITCH_NEXT: "Swipe: switched mode",
  FREEZE_VIEW_TOGGLE: "Hold: frozen view toggled",
  RESET_VIEW: "Fist: reset view",
  TIMELINE_PLAY_PAUSE: "Swipe: timeline play/pause",
  NONE: "Standby",
};

const COOLDOWN_MS = 1000;
const HOLD_MS = 1200;

export function useGestureCommands(currentGesture: string): UseGestureCommandsResult {
  const [command, setCommand] = useState<GestureCommand>("NONE");
  const [lastCommand, setLastCommand] = useState<GestureCommand>("NONE");
  const [commandPulseId, setCommandPulseId] = useState(0);

  const lastFiredAtRef = useRef(0);
  const lastFiredCommandRef = useRef<GestureCommand>("NONE");
  const holdStartRef = useRef<number | null>(null);
  const holdFreezeTriggeredRef = useRef(false);

  const mappedCommand = useMemo<GestureCommand>(() => {
    if (currentGesture === "Open Palm") return "GESTURE_MODE_ACTIVE";
    if (currentGesture === "Pinch Select") return "GRAPH_SELECT_NEXT";
    if (currentGesture === "Swipe") return "MODE_SWITCH_NEXT";
    if (currentGesture === "Fist Reset") return "RESET_VIEW";
    return "NONE";
  }, [currentGesture]);

  useEffect(() => {
    const now = Date.now();

    if (currentGesture === "Open Palm") {
      if (holdStartRef.current == null) {
        holdStartRef.current = now;
        holdFreezeTriggeredRef.current = false;
      }

      const holdDuration = now - holdStartRef.current;
      if (holdDuration >= HOLD_MS && !holdFreezeTriggeredRef.current) {
        const freezeCommand: GestureCommand = "FREEZE_VIEW_TOGGLE";
        if (now - lastFiredAtRef.current >= COOLDOWN_MS) {
          setCommand(freezeCommand);
          setLastCommand(freezeCommand);
          setCommandPulseId(now);
          lastFiredAtRef.current = now;
          lastFiredCommandRef.current = freezeCommand;
          holdFreezeTriggeredRef.current = true;
          return;
        }
      }
    } else {
      holdStartRef.current = null;
      holdFreezeTriggeredRef.current = false;
    }

    if (mappedCommand === "NONE") {
      setCommand("NONE");
      return;
    }

    const isSameCommand = mappedCommand === lastFiredCommandRef.current;
    const inCooldown = now - lastFiredAtRef.current < COOLDOWN_MS;

    if (isSameCommand && inCooldown) {
      return;
    }

    setCommand(mappedCommand);
    setLastCommand(mappedCommand);
    setCommandPulseId(now);
    lastFiredAtRef.current = now;
    lastFiredCommandRef.current = mappedCommand;
  }, [currentGesture, mappedCommand]);

  return {
    command,
    lastCommand,
    commandLabel: COMMAND_LABELS[command],
    commandPulseId,
  };
}
