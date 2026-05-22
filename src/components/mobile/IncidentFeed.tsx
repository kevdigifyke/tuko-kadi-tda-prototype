import FieldReportCard from "./FieldReportCard";
import type { FieldReport } from "@/data/mobile/mockFieldReports";

export default function IncidentFeed({ reports }: { reports: FieldReport[] }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Live Incident Feed</h2>
        <span className="inline-flex items-center gap-2 text-xs text-red-300"><span className="h-2 w-2 animate-ping rounded-full bg-red-400" />Live</span>
      </div>
      <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
        {reports.map((report) => (
          <FieldReportCard key={report.id} report={report} />
        ))}
      </div>
    </section>
  );
}
