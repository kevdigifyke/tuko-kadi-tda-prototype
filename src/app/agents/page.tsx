import { AgentOperationsView } from "@/src/components/operations/AgentOperationsView";
import { AppShell } from "@/src/components/shell/AppShell";

export default function AgentsPage() {
  return (
    <AppShell>
      <AgentOperationsView />
    </AppShell>
  );
}
