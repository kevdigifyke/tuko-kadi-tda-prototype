import { AppShell } from "@/src/components/shell/AppShell";
import { CommandPanel } from "@/src/components/ui/CommandPanel";
import { StatusChip } from "@/src/components/ui/StatusChip";
import { IntegrityDashboard } from "@/src/components/integrity/IntegrityDashboard";
import { mockIntegrityAssessment } from "@/src/data/integrity/mockIntegrityData";

export default function DashboardPage() {
  const assessment = mockIntegrityAssessment;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-display">Electoral Integrity Command Center</h1>
          <StatusChip label="CONSTITUTIONAL_MONITORING_ACTIVE" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <CommandPanel title="Integrity command section" active>
            <p className="text-sm text-[#bac9cc]">Election integrity score: {assessment.electionIntegrityScore}</p>
            <p className="mt-2 text-sm text-[#bac9cc]">National democratic stability index: {assessment.democraticStabilityIndex}</p>
          </CommandPanel>
          <CommandPanel title="Constitutional stability widgets">
            <p className="text-sm text-[#bac9cc]">Legitimacy pressure: {assessment.constitutionalRiskIndicators.legitimacyPressure}</p>
            <p className="mt-2 text-sm text-[#bac9cc]">Institutional stress: {assessment.constitutionalRiskIndicators.institutionalStress}</p>
          </CommandPanel>
          <CommandPanel title="Election defense metrics">
            <p className="text-sm text-[#bac9cc]">Fraud escalation probability: {assessment.fraudEscalationProbability}%</p>
            <p className="mt-2 text-sm text-[#bac9cc]">Regional volatility: {assessment.regionalVolatility}</p>
          </CommandPanel>
        </div>

        <IntegrityDashboard />
      </div>
    </AppShell>
  );
}
