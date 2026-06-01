import Link from "next/link";

import { MobileBottomNav } from "./MobileBottomNav";
import { MobileTopBar } from "./MobileTopBar";
import { Sidebar } from "./Sidebar";
import { TopCommandBar } from "./TopCommandBar";
import { secondaryNavigation } from "./navigation";

export function PlatformFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-5 text-xs text-[#bac9cc] md:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-semibold text-cyan-200">KuraScope EOIS</p>
          <p className="mt-1 uppercase tracking-[0.18em]">Election Observatory Intelligence System</p>
        </div>
        <nav className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.16em]">
          {secondaryNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-cyan-100/75 transition hover:text-cyan-100">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export function AppShell({ children, fullBleed = false, publicDemo = false }: { children: React.ReactNode; fullBleed?: boolean; publicDemo?: boolean }) {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#dce4e5]">
      <div className="flex min-h-screen">
        <Sidebar publicDemo={publicDemo} />
        <div className="min-w-0 flex-1">
          <MobileTopBar />
          <TopCommandBar />
          <main className={fullBleed ? "pb-20 md:pb-0" : "p-4 pb-24 md:p-6 md:pb-6"}>{children}</main>
          {!fullBleed && <PlatformFooter />}
        </div>
      </div>
      <MobileBottomNav publicDemo={publicDemo} />
    </div>
  );
}
