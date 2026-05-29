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
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
