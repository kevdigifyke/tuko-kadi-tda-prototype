import NationalCommandCenter from "@/src/components/command/NationalCommandCenter";
import { AppShell } from "@/src/components/shell/AppShell";

export default function ObservatoryPage() {
  return (
    <AppShell fullBleed>
      <NationalCommandCenter embedded />
    </AppShell>
  );
}
