"use client";

import dynamic from "next/dynamic";

const IEBCBoundaryMap = dynamic(
  () => import("../../components/maps/IEBCBoundaryMap"),
  {
    ssr: false,
  }
);

export default function MapsPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        IEBC Boundary Engine
      </h1>

      <IEBCBoundaryMap />
    </main>
  );
}