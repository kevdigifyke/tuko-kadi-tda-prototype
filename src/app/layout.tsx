import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KuraScope EOIS",
  description:
    "A Geospatial Election Intelligence and Observatory Platform for realtime election monitoring, anomaly detection, simulation, and operational visibility.",
  keywords: [
    "KuraScope EOIS",
    "Election Observatory Intelligence System",
    "election monitoring",
    "geospatial election intelligence",
    "anomaly detection",
    "operational visibility",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
