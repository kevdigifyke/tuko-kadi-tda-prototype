"use client";

import { motion } from "framer-motion";

interface IntegrityGaugeProps {
  label: string;
  value: number;
}

export function IntegrityGauge({ label, value }: IntegrityGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const stroke = clamped >= 75 ? "#00C853" : clamped >= 50 ? "#FACC15" : "#F43F5E";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-[#061217] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">{label}</p>
      <div className="mt-4 grid place-items-center">
        <svg viewBox="0 0 140 140" className="h-40 w-40">
          <circle cx="70" cy="70" r="54" stroke="#12303f" strokeWidth="12" fill="none" />
          <motion.circle
            cx="70"
            cy="70"
            r="54"
            stroke={stroke}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ strokeDasharray: circumference, transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-cyan-100 text-3xl font-semibold">
            {clamped}
          </text>
        </svg>
      </div>
      <p className="text-center text-sm text-[#9cb0b6]">{clamped >= 75 ? "Stable" : clamped >= 50 ? "Guarded" : "Critical"} integrity posture</p>
    </div>
  );
}
