import { StatusChip } from "@/src/components/ui/StatusChip";
import { WarningStrip } from "@/src/components/ui/WarningStrip";

export function TopCommandBar() {
  return (
    <header className="hidden h-16 items-center justify-between border-b border-white/10 px-6 md:flex">
      <div>
        <p className="text-sm font-bold tracking-[0.18em] text-cyan-200">KuraScope EOIS</p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#bac9cc]">Election Observatory Intelligence System</p>
      </div>
      <div className="flex items-center gap-3">
        <StatusChip status="GREEN" label="GREEN · LIVE" />
        <WarningStrip />
      </div>
    </header>
  );
}
