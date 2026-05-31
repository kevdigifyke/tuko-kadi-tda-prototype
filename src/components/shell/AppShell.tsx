import { MobileBottomNav } from "./MobileBottomNav";
import { MobileTopBar } from "./MobileTopBar";
import { Sidebar } from "./Sidebar";
import { TopCommandBar } from "./TopCommandBar";

export function AppShell({ children, fullBleed = false }: { children: React.ReactNode; fullBleed?: boolean }) {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#dce4e5]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <MobileTopBar />
          <TopCommandBar />
          <main className={fullBleed ? "pb-20 md:pb-0" : "p-4 pb-24 md:p-6 md:pb-6"}>{children}</main>
          <footer className="border-t border-white/10 px-4 py-4 text-xs text-[#bac9cc] md:px-6">
            <p className="font-semibold text-cyan-200">KuraScope EOIS</p>
            <p className="mt-1 uppercase tracking-[0.18em]">Election Observatory Intelligence System</p>
          </footer>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
