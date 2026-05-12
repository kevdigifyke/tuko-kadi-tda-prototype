"use client";
import Link from "next/link";import { usePathname } from "next/navigation";
const items=[['/','Dashboard'],['/maps','Maps'],['/anomalies','Anomalies'],['/analytics','Analytics'],['/upload','Upload'],['/review','Review']];
export function Sidebar(){const p=usePathname();return <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#080f11] p-5"><p className="text-3xl font-bold text-cyan-300">TUKO_KADI</p><p className="text-[#bac9cc] mt-1">TUKO_ELECT_INTEL</p><nav className="mt-8 space-y-2">{items.map(([href,label])=><Link key={href} href={href} className={`block rounded-lg px-3 py-2 ${p===href?'bg-cyan-500/20 text-cyan-300':'text-[#bac9cc]'}`}>{label}</Link>)}</nav></aside>}
