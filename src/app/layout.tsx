import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });
export const metadata: Metadata = { title: "Tuko Kadi Election Intelligence Command Center" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className={`${inter.variable} ${mono.variable}`}><body>{children}</body></html>; }
