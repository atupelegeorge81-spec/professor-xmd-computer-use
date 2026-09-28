import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { TerminalSquare } from "lucide-react";
import type { WorldState } from "../../types";

/* ════════════════════════════════════════════════════════════════
   Terminal — streaming shell output from the agent's sandbox,
   with multiple shells (Devin-style) and exit-code coloring.
   ════════════════════════════════════════════════════════════════ */

export function TerminalPane({ world }: { world: WorldState }) {
  const shells = [1, 2].filter((s) => world.terminals[s]?.lines.length > 0 || s === 1);
  const runningShell = (() => {
    const ae = world.activeEvent;
    if (ae && ae.status === "running" && ae.action.data.kind === "terminal") {
      return (ae.action.data as { shell: number }).shell;
    }
    return null;
  })();
  const [manual, setManual] = useState<number | null>(null);
  const active = manual ?? runningShell ?? shells[0] ?? 1;
  const term = world.terminals[active];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [term?.lines.length, active]);

  const busy = term?.busyCommand != null;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-base/80">
      {/* shell tabs */}
      <div className="flex items-center gap-1 border-b border-line bg-header/50 px-2 py-1.5">
        {shells.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setManual(s)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] transition-colors ${
              active === s ? "bg-white/8 text-ink" : "text-ink-3 hover:bg-white/4"
            }`}
          >
            <TerminalSquare size={12} />
            Shell {s}
            {runningShell === s && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />}
          </button>
        ))}
        <span className="ml-auto pr-2 font-mono text-[10px] text-ink-3">e2b · ubuntu-24.04</span>
      </div>

      {/* output */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 font-mono text-[12px] leading-[1.65]">
        {term.lines.length === 0 && (
          <p className="text-ink-3">Shell idle — the agent hasn't run any commands yet.</p>
        )}
        {term.lines.map((l, i) => {
          if (l.kind === "cmd")
            return (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex gap-2">
                <span className="text-accent">➜</span>
                <span className="text-ink-3">{term.cwd}</span>
                <span className="font-semibold text-ink">$</span>
                <span className="text-ink">{l.text}</span>
              </motion.div>
            );
          if (l.kind === "ok")
            return (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-ok">
                ✓ {l.text}
              </motion.div>
            );
          if (l.kind === "err")
            return (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-err">
                ✗ {l.text}
              </motion.div>
            );
          return (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap text-ink-2">
              {l.text || "\u00A0"}
            </motion.div>
          );
        })}
        {busy && (
          <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-3">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            running…
          </div>
        )}
        <div className="mt-1 flex gap-2">
          <span className="text-accent">➜</span>
          <span className="text-ink-3">{term.cwd}</span>
          <span className="font-semibold text-ink">$</span>
          {!busy && <span className="animate-caret text-ink">▍</span>}
        </div>
      </div>
    </div>
  );
}
