"use client";import Link from "next/link";import { usePathname } from "next/navigation";
const items=[['/','Home'],['/maps','Maps'],['/anomalies','Anomalies'],['/analytics','Data'],['/agents/upload','Agents']];
export function MobileBottomNav(){const p=usePathname();return <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 grid grid-cols-5 border-t border-white/10 bg-[#080f11]">{items.map(([h,l])=><Link key={h} href={h} className={`py-2 text-center text-xs ${p===h?'text-cyan-300':'text-[#bac9cc]'}`}>{l}</Link>)}</nav>}
