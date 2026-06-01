"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavigation, publicDemoNavigation, secondaryNavigation } from "./navigation";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ publicDemo = false }: { publicDemo?: boolean }) {
  const pathname = usePathname();
  const navItems = publicDemo ? publicDemoNavigation : primaryNavigation;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-cyan-300/10 bg-[#080f11] p-5 md:flex">
      <p className="text-3xl font-bold tracking-tight text-cyan-300">KuraScope EOIS</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#bac9cc]">Election Observatory Intelligence System</p>
      <nav className="mt-8 space-y-1.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-xl border px-3 py-2 text-sm transition ${
              isActive(pathname, item.href)
                ? "border-cyan-300/30 bg-cyan-500/20 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
                : "border-transparent text-[#bac9cc] hover:border-white/10 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <nav className="mt-5 border-t border-white/10 pt-4">
        <p className="panel-kicker mb-2 text-[#bac9cc]">{publicDemo ? "Demo scope" : "Public readiness"}</p>
        <div className="space-y-1">
          {secondaryNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-1.5 text-xs text-[#bac9cc] transition hover:bg-white/5 hover:text-cyan-100">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="mt-auto rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-100">
        {publicDemo ? "Demo Environment – Uses Simulated Election Data." : "Platform application layer unified. Public demo uses simulated election data only."}
      </div>
    </aside>
  );
}
