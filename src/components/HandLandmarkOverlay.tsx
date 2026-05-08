"use client";
export function HandLandmarkOverlay({ points }: { points: { x: number; y: number; z: number }[] }) {
  return <svg className="pointer-events-none absolute inset-0 h-32 w-full" viewBox="0 0 100 100" preserveAspectRatio="none">{points.map((p, i) => <circle key={i} cx={p.x * 100} cy={p.y * 100} r="1.2" fill="#00e5ff" opacity="0.85" />)}</svg>;
}
