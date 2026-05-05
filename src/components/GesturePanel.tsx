export function GesturePanel() {
  return (
    <section className="panel-glow rounded-2xl border border-slate-700 bg-[#121922] p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#00E5FF]">Gesture Control</h2>
      <div className="relative mb-4 h-44 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800">
        <svg viewBox="0 0 240 160" className="absolute inset-0 h-full w-full opacity-90">
          <circle cx="118" cy="105" r="16" fill="none" stroke="#00E5FF" strokeWidth="2" />
          <g stroke="#7C4DFF" strokeWidth="2" fill="none">
            <path d="M118 92 L118 56" /><path d="M118 72 L96 52" /><path d="M118 70 L138 50" />
            <path d="M118 84 L86 72" /><path d="M118 85 L151 72" /><path d="M118 94 L90 100" />
          </g>
          <circle cx="118" cy="56" r="4" fill="#00E5FF" />
          <circle cx="96" cy="52" r="4" fill="#00E5FF" />
          <circle cx="138" cy="50" r="4" fill="#00E5FF" />
        </svg>
      </div>
      <p className="text-sm text-slate-300">Current gesture: <span className="text-[#00E5FF]">Pinch Select</span></p>
      <p className="mb-3 text-sm text-slate-300">Tracking confidence: <span className="text-[#00C853]">98%</span></p>
      <ul className="space-y-1 text-xs text-slate-400">
        <li>Open Palm: Activate</li><li>Point: Hover</li><li>Pinch: Select</li><li>Two Hands: Zoom</li><li>Swipe: Change View</li><li>Fist: Reset</li>
      </ul>
    </section>
  );
}
