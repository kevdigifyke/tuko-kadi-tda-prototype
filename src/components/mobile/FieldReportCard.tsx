import type { FieldReport } from "@/data/mobile/mockFieldReports";

const severityTone: Record<FieldReport["severity"], string> = {
  critical: "text-red-300 border-red-500/40 bg-red-500/10",
  high: "text-orange-300 border-orange-500/40 bg-orange-500/10",
  moderate: "text-yellow-300 border-yellow-500/40 bg-yellow-500/10",
  low: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
};

export default function FieldReportCard({ report }: { report: FieldReport }) {
  return (
    <article className="rounded-xl border border-cyan-500/20 bg-zinc-950/80 p-3 shadow-lg shadow-cyan-950/40">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-mono text-cyan-300">{report.id}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${severityTone[report.severity]}`}>{report.severity}</span>
      </div>
      <p className="text-sm font-semibold text-zinc-100">{report.pollingStation}</p>
      <p className="mt-1 text-xs text-zinc-400">{report.summary}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
        <p>County: <span className="text-zinc-100">{report.county}</span></p>
        <p>Constituency: <span className="text-zinc-100">{report.constituency}</span></p>
        <p>Ward: <span className="text-zinc-100">{report.ward}</span></p>
        <p>Status: <span className="rounded bg-zinc-800 px-1.5 py-0.5 uppercase">{report.status}</span></p>
        <p className="col-span-2">GPS: <span className="font-mono text-zinc-100">{report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}</span></p>
        <p className="col-span-2">Timestamp: <span className="text-zinc-100">{new Date(report.timestamp).toLocaleString()}</span></p>
      </div>
    </article>
  );
}
