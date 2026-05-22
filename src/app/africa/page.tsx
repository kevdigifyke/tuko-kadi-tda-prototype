"use client";

import { useMemo, useState } from "react";

import { AfricaElectionMap } from "@/src/components/africa/AfricaElectionMap";
import { ContinentalFeed } from "@/src/components/africa/ContinentalFeed";
import { CountryRiskPanel } from "@/src/components/africa/CountryRiskPanel";
import { AppShell } from "@/src/components/shell/AppShell";
import { africanElectionData } from "@/src/data/africa/mockAfricanElectionData";

export default function AfricaPage() {
  const [selectedCountryCode, setSelectedCountryCode] = useState("KE");

  const selectedCountry = useMemo(
    () => africanElectionData.find((c) => c.code === selectedCountryCode) ?? africanElectionData[0],
    [selectedCountryCode],
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-display">Pan-African Election Intelligence Command</h1>
          <p className="text-sm text-[#bac9cc]">Continental election operations center with geopolitical and democratic stability telemetry.</p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_370px]">
          <AfricaElectionMap
            countries={africanElectionData}
            selectedCountryCode={selectedCountryCode}
            onSelectCountry={setSelectedCountryCode}
          />

          <aside className="command-card p-4">
            <h3 className="panel-kicker text-cyan-200">Country selector</h3>
            <select
              className="mt-3 w-full rounded-lg border border-cyan-300/30 bg-[#0f181b] p-2 text-sm outline-none"
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
            >
              {africanElectionData.map((country) => <option key={country.code} value={country.code}>{country.country}</option>)}
            </select>
            <p className="mt-3 text-xs text-[#8ea2a7]">Dynamic regional switching enabled for East, West, and Southern Africa election theaters.</p>
          </aside>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_430px]">
          <CountryRiskPanel country={selectedCountry} />
          <ContinentalFeed />
        </div>
      </div>
    </AppShell>
  );
}
