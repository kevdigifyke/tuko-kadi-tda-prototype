export function MetricCard({ title, value, tone='cyan' }: { title: string; value: string; tone?: 'cyan'|'yellow'|'salmon'|'green' }) {
  const toneClass = { cyan: 'text-cyan-300', yellow: 'text-yellow-300', salmon: 'text-[#ffb4ab]', green: 'text-[#00C853]' }[tone];
  return <div className="command-card p-4"><p className="panel-kicker text-[#bac9cc]">{title}</p><p className={`mt-2 text-data-lg ${toneClass}`}>{value}</p></div>;
}
