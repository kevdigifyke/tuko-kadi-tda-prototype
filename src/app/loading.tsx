export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F14] text-[#dce4e5]">
      <div className="rounded-2xl border border-cyan-300/20 bg-[#080f11]/90 p-8 text-center shadow-[0_0_40px_rgba(34,211,238,0.12)]">
        <p className="text-2xl font-bold tracking-tight text-cyan-200">KuraScope EOIS</p>
        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[#bac9cc]">Election Observatory Intelligence System</p>
        <p className="mt-5 text-sm text-cyan-100">Loading observatory intelligence workspace…</p>
      </div>
    </div>
  );
}
