export function CommandPanel({ title, children, active=false }: { title: string; children: React.ReactNode; active?: boolean }) {
  return (
    <section className={`command-card p-4 md:p-5 ${active ? "border-cyan-300/30 shadow-[0_0_24px_rgba(0,229,255,0.15)]" : ""}`}>
      <h3 className="panel-kicker text-cyan-200">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}
