export type PlatformStatus = "GREEN" | "AMBER" | "RED" | "CRITICAL";

type StatusChipProps = {
  status?: PlatformStatus;
  label?: string;
};

export const statusStyles: Record<PlatformStatus, { dot: string; chip: string; label: string }> = {
  GREEN: {
    dot: "bg-emerald-300",
    chip: "border-emerald-300/40 bg-emerald-400/10 text-emerald-100",
    label: "GREEN",
  },
  AMBER: {
    dot: "bg-amber-300",
    chip: "border-amber-300/45 bg-amber-400/10 text-amber-100",
    label: "AMBER",
  },
  RED: {
    dot: "bg-red-300",
    chip: "border-red-300/45 bg-red-400/10 text-red-100",
    label: "RED",
  },
  CRITICAL: {
    dot: "bg-rose-200",
    chip: "border-rose-300/55 bg-rose-500/15 text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.16)]",
    label: "CRITICAL",
  },
};

export function normalizePlatformStatus(status: string | undefined | null): PlatformStatus {
  if (!status) return "GREEN";
  const normalized = status.toUpperCase();

  if (normalized === "INFO" || normalized === "LIVE" || normalized === "STABLE" || normalized === "NORMAL") return "GREEN";
  if (normalized === "WARNING" || normalized === "TRACKING" || normalized === "PREDICTIVE") return "AMBER";
  if (normalized === "MAGENTA" || normalized === "ESCALATED" || normalized === "DIVERGENT") return "RED";
  if (normalized === "CRITICAL") return "CRITICAL";
  if (normalized === "GREEN" || normalized === "AMBER" || normalized === "RED") return normalized;

  return "GREEN";
}

export function StatusChip({ status = "GREEN", label }: StatusChipProps) {
  const resolved = normalizePlatformStatus(status);
  const style = statusStyles[resolved];

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-mono font-bold tracking-[0.1em] ${style.chip}`}>
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      {label ?? style.label}
    </span>
  );
}
