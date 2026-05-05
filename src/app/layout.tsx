import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tuko Kadi Election Intelligence",
  description: "Futuristic election anomaly intelligence prototype",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0B0F14]">{children}</body>
    </html>
  );
}
