import { DashboardView } from "@/src/components/operations/DashboardView";
import { AppShell } from "@/src/components/shell/AppShell";

export default function HomePage() {
  return (
    <AppShell>
      <DashboardView />
    </AppShell>
  );
}
