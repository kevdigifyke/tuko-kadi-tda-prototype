export function GesturePanel() {
  return (
    <section className="panel-glow rounded-2xl border border-cyan-300/20 bg-[#121922] p-4">
      <h2 className="font-tech mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#00e5ff]">Gesture Control</h2>
      <div className="relative mb-4 h-52 overflow-hidden rounded-2xl border border-slate-600/70 bg-gradient-to-br from-[#070c12] via-[#0d151c] to-[#0f1d23]">
        <div className="scanner-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(0,218,243,0.12),transparent_60%)]" />
        <div className="absolute left-3 top-3 rounded-md border border-cyan-300/30 bg-black/30 px-2 py-1 font-tech text-[10px] tracking-[0.16em] text-[#00e5ff]">CAM-03 ACTIVE</div>
        <svg viewBox="0 0 280 180" className="absolute inset-0 h-full w-full opacity-95">
          <circle cx="138" cy="110" r="16" fill="none" stroke="#00E5FF" strokeWidth="2" />
          <g stroke="#7C4DFF" strokeWidth="2" fill="none">
            <path d="M138 94 L138 54" /><path d="M138 68 L113 44" /><path d="M138 67 L162 44" />
            <path d="M138 82 L94 72" /><path d="M138 82 L182 72" /><path d="M138 95 L98 104" />
          </g>
          {["138,54", "113,44", "162,44", "94,72", "182,72", "98,104", "138,94", "138,110"].map((p) => {
            const [cx, cy] = p.split(",");
            return <circle key={p} cx={cx} cy={cy} r="3.8" fill="#00E5FF" />;
          })}
          <circle cx="138" cy="94" r="28" fill="none" stroke="#00e5ff" strokeOpacity="0.38" strokeDasharray="4 5" />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-green-400/30 bg-green-500/10 p-2">
          <p className="text-[#bac9cc]">Current gesture</p>
          <p className="font-tech text-[#00e5ff]">Pinch Select</p>
        </div>
        <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 p-2">
          <p className="text-[#bac9cc]">Confidence</p>
          <p className="font-tech text-[#00c853]">98.2%</p>
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-slate-700 bg-[#0e151b] p-3">
        <p className="font-tech mb-2 text-[11px] uppercase tracking-[0.16em] text-[#bac9cc]">Gesture command map</p>
        <ul className="space-y-1.5 text-xs text-[#bac9cc]">
          <li><span className="text-white">Open Palm</span> · Activate</li>
          <li><span className="text-white">Point</span> · Hover trace</li>
          <li><span className="text-white">Pinch</span> · Select cluster</li>
          <li><span className="text-white">Two Hands</span> · Zoom network</li>
          <li><span className="text-white">Swipe</span> · Change view</li>
          <li><span className="text-white">Fist</span> · Reset camera lock</li>
        </ul>
      </div>
    </section>
  );
}
