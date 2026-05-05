const navItems = ["Command", "Signals", "Clusters", "Archive", "Simulation"];

export function Sidebar() {
  return (
    <aside className="tk-sidebar flex h-full w-full flex-col border-r border-cyan-400/20 bg-[#0e171f] px-4 py-6">
      <div>
        <p className="font-ui text-2xl font-bold text-[#00e5ff]">Tuko Kadi Intel</p>
        <p className="font-mono mt-2 text-xs text-[#7e8d9a]">V3.42 OMEGA</p>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map((item, idx) => (
          <button
            key={item}
            className={`w-full border-l-2 px-3 py-3 text-left font-ui text-[13px] uppercase tracking-[0.12em] transition ${
              idx === 0
                ? "border-[#00e5ff] bg-[#12303a]/65 text-[#e5f6f8]"
                : "border-transparent text-[#7e8d9a] hover:bg-[#11242f] hover:text-[#e5f6f8]"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <button className="w-full rounded-md bg-[#00e5ff] px-4 py-3 font-ui text-sm font-bold text-[#062129]">New Report</button>
        <div className="space-y-2 border-t border-slate-700 pt-3 font-ui text-xs text-[#7e8d9a]">
          <p>Support</p>
          <p>Logs</p>
        </div>
      </div>
    </aside>
  );
}
