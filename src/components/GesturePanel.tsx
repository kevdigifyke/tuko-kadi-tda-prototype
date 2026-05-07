export function GesturePanel() {
  return (
    <section className="floating-panel w-full max-w-[300px] p-4">
      <h2 className="panel-kicker text-[#00daf3]">Gesture Control HUD</h2>
      <div className="mt-3 rounded-md border border-cyan-300/30 bg-[#0b1417] p-2">
        <div className="h-32 rounded border border-cyan-300/40 bg-[radial-gradient(circle_at_62%_34%,rgba(0,229,255,0.28),transparent_42%),radial-gradient(circle_at_34%_68%,rgba(124,77,255,0.2),transparent_40%),linear-gradient(130deg,#061017,#10222e)]" />
      </div>
      <div className="mt-3 border-b border-white/10 pb-2">
        <p className="text-xs text-[#bac9cc]">Current Gesture</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-h2 text-[#dce4e5]">Pinch Select</p>
          <p className="font-mono text-sm font-semibold text-[#00e5ff]">98% CONF</p>
        </div>
      </div>
      <p className="panel-kicker mt-3 text-[#bac9cc]">Gesture Library</p>
      <div className="mt-2 space-y-2 text-sm">
        <div className="flex items-center justify-between rounded-sm border border-cyan-300/40 bg-cyan-400/10 px-3 py-2"><span>Pinch</span><span className="text-[#00e5ff]">Select/Drag</span></div>
        <div className="flex items-center justify-between rounded-sm border border-white/15 bg-[#151d1e] px-3 py-2 text-[#bac9cc]"><span>Swipe</span><span>Timeline</span></div>
        <div className="flex items-center justify-between rounded-sm border border-white/15 bg-[#151d1e] px-3 py-2 text-[#bac9cc]"><span>Expand</span><span>Zoom Cluster</span></div>
      </div>
    </section>
  );
}
