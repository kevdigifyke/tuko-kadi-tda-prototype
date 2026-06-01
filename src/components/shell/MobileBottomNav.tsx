"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavigation, publicDemoNavigation } from "./navigation";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav({ publicDemo = false }: { publicDemo?: boolean }) {
  const pathname = usePathname();
  const navItems = publicDemo ? publicDemoNavigation : primaryNavigation;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex gap-1 overflow-x-auto border-t border-white/10 bg-[#080f11]/95 px-2 py-2 backdrop-blur md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`min-w-[76px] rounded-lg px-2 py-2 text-center text-[11px] ${
            isActive(pathname, item.href) ? "bg-cyan-500/15 text-cyan-200" : "text-[#bac9cc]"
          }`}
        >
          {item.shortLabel}
        </Link>
      ))}
    </nav>
  );
}
