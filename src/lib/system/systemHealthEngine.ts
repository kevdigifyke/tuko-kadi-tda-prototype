export interface SystemHealthSnapshot {
  aiEngineStability: number;
  mapRenderingPerformance: number;
  predictionThroughput: number;
  replayEngineHealth: number;
  feedSynchronization: number;
  spatialEngineStatus: number;
  overall: "NOMINAL" | "DEGRADED" | "CRITICAL";
}

const bounded = (v: number) => Math.max(0, Math.min(100, v));

export function generateSystemHealthSnapshot(phase = Date.now() / 25000): SystemHealthSnapshot {
  const aiEngineStability = bounded(86 + Math.sin(phase) * 9);
  const mapRenderingPerformance = bounded(82 + Math.cos(phase * 0.85) * 10);
  const predictionThroughput = bounded(79 + Math.sin(phase * 1.4) * 14);
  const replayEngineHealth = bounded(88 + Math.cos(phase * 1.15) * 8);
  const feedSynchronization = bounded(84 + Math.sin(phase * 0.66) * 12);
  const spatialEngineStatus = bounded(81 + Math.cos(phase * 0.77) * 11);

  const mean = (aiEngineStability + mapRenderingPerformance + predictionThroughput + replayEngineHealth + feedSynchronization + spatialEngineStatus) / 6;

  return {
    aiEngineStability: Number(aiEngineStability.toFixed(1)),
    mapRenderingPerformance: Number(mapRenderingPerformance.toFixed(1)),
    predictionThroughput: Number(predictionThroughput.toFixed(1)),
    replayEngineHealth: Number(replayEngineHealth.toFixed(1)),
    feedSynchronization: Number(feedSynchronization.toFixed(1)),
    spatialEngineStatus: Number(spatialEngineStatus.toFixed(1)),
    overall: mean > 78 ? "NOMINAL" : mean > 55 ? "DEGRADED" : "CRITICAL",
  };
}
