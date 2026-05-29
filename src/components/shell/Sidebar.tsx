"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavigation } from "./navigation";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-cyan-300/10 bg-[#080f11] p-5 md:flex">
      <p className="text-3xl font-bold tracking-tight text-cyan-300">TUKO_KADI</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#bac9cc]">Election Intel Ops</p>
      <nav className="mt-8 space-y-2">
        {primaryNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg border px-3 py-2 text-sm transition ${
              isActive(pathname, item.href)
                ? "border-cyan-300/30 bg-cyan-500/20 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
                : "border-transparent text-[#bac9cc] hover:border-white/10 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-100">
        Operational application layer active. Observatory remains live intelligence map.
      </div>
    </aside>
  );
}
