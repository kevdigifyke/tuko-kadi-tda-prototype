export function GesturePanel() {
  return (
    <section className="floating-panel w-[300px] p-4">
      <h2 className="panel-kicker text-[#00e5ff]">Gesture Control HUD</h2>
      <div className="mt-4 h-36 rounded-md border border-cyan-400/35 bg-[radial-gradient(circle_at_60%_30%,rgba(0,229,255,0.24),transparent_45%),linear-gradient(120deg,#02070c,#0b1620)]" />
      <div className="mt-3 border-b border-slate-700 pb-2">
        <p className="text-xs text-[#7e8d9a]">Current Gesture</p>
        <div className="flex items-center justify-between">
          <p className="font-ui text-[33] text-2xl font-bold text-[#e5f6f8]">Pinch Select</p>
          <p className="font-mono text-sm text-[#00e5ff]">98% CONF</p>
        </div>
      </div>
      <p className="panel-kicker mt-3 text-[#7e8d9a]">Gesture Library</p>
      <div className="mt-2 space-y-2 text-sm">
        <div className="flex justify-between rounded-sm border border-cyan-400/35 bg-cyan-500/10 px-3 py-2"><span>Pinch</span><span className="text-[#00e5ff]">Select/Drag</span></div>
        <div className="flex justify-between rounded-sm border border-slate-600 bg-[#13202c] px-3 py-2 text-[#9eaab7]"><span>Swipe</span><span>Timeline</span></div>
        <div className="flex justify-between rounded-sm border border-slate-600 bg-[#13202c] px-3 py-2 text-[#9eaab7]"><span>Expand</span><span>Zoom Cluster</span></div>
      </div>
    </section>
  );
}
