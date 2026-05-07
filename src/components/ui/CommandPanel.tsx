export function CommandPanel({ title, children, active=false }: { title: string; children: React.ReactNode; active?: boolean }) {
  return <section className={`command-card p-4 ${active ? 'shadow-[0_0_24px_rgba(0,229,255,0.15)] border-cyan-300/30' : ''}`}><h3 className="panel-kicker text-cyan-200">{title}</h3><div className="mt-3">{children}</div></section>;
}
