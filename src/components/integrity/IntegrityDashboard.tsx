import { IntegrityGauge } from "@/src/components/integrity/IntegrityGauge";
import { IntegrityAlertFeed } from "@/src/components/integrity/IntegrityAlertFeed";
import { mockIntegrityAssessment } from "@/src/data/integrity/mockIntegrityData";

export function IntegrityDashboard() {
  const assessment = mockIntegrityAssessment;

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-4">
        <IntegrityGauge label="National Integrity Score" value={assessment.electionIntegrityScore} />
        <IntegrityGauge label="Democratic Stability" value={assessment.democraticStabilityIndex} />
        <IntegrityGauge label="Fraud Escalation Probability" value={100 - assessment.fraudEscalationProbability} />
        <IntegrityGauge label="Regional Volatility Control" value={100 - assessment.regionalVolatility} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <div className="rounded-2xl border border-cyan-400/20 bg-[#08151b] p-4">
          <h3 className="text-sm uppercase tracking-[0.2em] text-cyan-200">County Integrity Rankings</h3>
          <div className="mt-3 space-y-2">
            {assessment.countyRankings.map((county, idx) => (
              <div key={county.county} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">#{idx + 1} {county.county}</span>
                  <span className="text-cyan-200">{county.integrityScore}</span>
                </div>
                <div className="mt-2 h-2 rounded bg-white/10">
                  <div className="h-2 rounded bg-gradient-to-r from-cyan-300 to-emerald-400" style={{ width: `${county.integrityScore}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <IntegrityAlertFeed alerts={assessment.alerts} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(assessment.constitutionalRiskIndicators).map(([key, value]) => (
          <div key={key} className="rounded-2xl border border-rose-300/20 bg-[#121016] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-rose-200/80">{key.replace(/([A-Z])/g, " $1")}</p>
            <p className="mt-2 text-2xl font-semibold text-rose-100">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
