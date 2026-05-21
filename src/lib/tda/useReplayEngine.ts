"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ElectionTimelineFrame,
  generateElectionTimeline,
} from "@/data/geo/electionTimeline";

const SPEED_MULTIPLIERS = [0.5, 1, 2, 4] as const;

export default function useReplayEngine() {
  const timeline = useMemo(() => generateElectionTimeline(), []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [speed, setSpeed] = useState<(typeof SPEED_MULTIPLIERS)[number]>(1);
  const [index, setIndex] = useState(0);

  const maxIndex = timeline.length - 1;
  const currentFrame: ElectionTimelineFrame | null = timeline[index] ?? null;

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const reset = useCallback(() => {
    setIsPlaying(false);
    setIndex(0);
  }, []);

  const scrubTo = useCallback(
    (nextIndex: number) => {
      setIndex(Math.min(maxIndex, Math.max(0, nextIndex)));
    },
    [maxIndex],
  );

  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.round(1400 / speed);
    const timer = window.setInterval(() => {
      setIndex((prev) => {
        if (prev >= maxIndex) {
          if (isLooping) return 0;
          setIsPlaying(false);
          return prev;
        }

        return prev + 1;
      });
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [isLooping, isPlaying, maxIndex, speed]);

  return {
    timeline,
    currentFrame,
    currentIndex: index,
    maxIndex,
    isPlaying,
    isLooping,
    speed,
    speedOptions: SPEED_MULTIPLIERS,
    play,
    pause,
    reset,
    scrubTo,
    setSpeed,
    setLooping: setIsLooping,
  };
}
