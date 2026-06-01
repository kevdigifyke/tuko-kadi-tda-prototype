import NationalCommandCenter from "@/src/components/command/NationalCommandCenter";
import { AppShell } from "@/src/components/shell/AppShell";

export default function PresentationPage() {
  return (
    <AppShell fullBleed>
      <NationalCommandCenter embedded mode="presentation" />
    </AppShell>
  );
}
