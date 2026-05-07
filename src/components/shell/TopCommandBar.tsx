import { StatusChip } from "@/src/components/ui/StatusChip";import { WarningStrip } from "@/src/components/ui/WarningStrip";
export function TopCommandBar(){return <header className="hidden md:flex h-16 items-center justify-between border-b border-white/10 px-6"><StatusChip label="LIVE STATUS"/><WarningStrip/></header>}
