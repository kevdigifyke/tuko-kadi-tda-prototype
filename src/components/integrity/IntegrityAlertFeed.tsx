import type { IntegrityAlert } from "@/src/lib/integrity/electoralIntegrityEngine";

const severityClass: Record<IntegrityAlert["severity"], string> = {
  low: "border-cyan-500/30 text-cyan-200",
  medium: "border-yellow-500/40 text-yellow-200",
  high: "border-orange-500/40 text-orange-200",
  critical: "border-rose-500/40 text-rose-200",
};

export function IntegrityAlertFeed({ alerts }: { alerts: IntegrityAlert[] }) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-[#08151b] p-4">
      <h3 className="text-sm uppercase tracking-[0.2em] text-cyan-200">Fraud Escalation Alerts</h3>
      <div className="mt-3 space-y-2 max-h-96 overflow-auto pr-1">
        {alerts.slice(0, 12).map((alert) => (
          <div key={alert.id} className={`rounded-xl border bg-black/20 p-3 ${severityClass[alert.severity]}`}>
            <div className="flex items-center justify-between text-xs uppercase tracking-wider">
              <span>{alert.category.replaceAll("_", " ")}</span>
              <span>{alert.severity}</span>
            </div>
            <p className="mt-2 text-sm text-white">{alert.message}</p>
            <p className="mt-1 text-xs text-[#9fb3ba]">Signal {alert.score} • {new Date(alert.observedAt).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
