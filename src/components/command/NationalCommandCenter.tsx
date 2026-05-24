"use client";

import dynamic from "next/dynamic";

import TelemetryFeed from "./TelemetryFeed";
import CommandSidebar from "./CommandSidebar";
import BottomReplayRail from "./BottomReplayRail";

const IEBCBoundaryMap = dynamic(
  () => import("../maps/IEBCBoundaryMap"),
  {
    ssr: false,
  }
);

export default function NationalCommandCenter() {
  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">

      {/* TOP */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDEBAR */}
        <div className="w-72 shrink-0">
          <CommandSidebar />
        </div>

        {/* CENTER MAP */}
        <div className="flex-1 relative">
          <IEBCBoundaryMap />
        </div>

        {/* RIGHT TELEMETRY */}
        <div className="w-80 shrink-0">
          <TelemetryFeed />
        </div>

      </div>

      {/* BOTTOM RAIL */}
      <BottomReplayRail />

    </div>
  );
}