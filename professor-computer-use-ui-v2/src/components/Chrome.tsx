import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, CircleCheck, Share2, Cpu, Container, Clock, Zap } from "lucide-react";
import type { WorldState } from "../types";
import { fmtMs, fmtTokens } from "../types";

/* ── Top bar ──────────────────────────────────────────────────── */

export function TopBar({ world, sessionTitle }: { world: WorldState | null; sessionTitle: string | null }) {
  const running = world ? !world.finished : false;
  const started = !!world;
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-line bg-panel/80 px-4 backdrop-blur">
      <div className="flex items-center gap-2.5">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-white shadow-md shadow-accent/25">
          <GraduationCap size={15} />
        </span>
        <span className="text-[14px] font-bold tracking-tight text-ink">Professor XMD</span>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-1.5 py-px text-[9.5px] font-bold text-accent">
          v2
        </span>
      </div>

      {sessionTitle && (
        <div className="hidden min-w-0 items-center gap-2 md:flex">
          <span className="text-ink-3">/</span>
          <span className="truncate text-[12.5px] text-ink-2">{sessionTitle}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2.5">
        <AnimatePresence mode="wait">
          {started && (
            <motion.div
              key={world!.finished ? "done" : "working"}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[11.5px] font-medium ${
                world!.finished
                  ? "border-ok/30 bg-ok/10 text-ok"
                  : "border-accent/30 bg-accent/10"
              }`}
            >
              {world!.finished ? (
                <>
                  <CircleCheck size={12} />
                  Completed
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="shimmer-text font-medium">Working</span>
                  <span className="font-mono text-[10.5px] text-ink-3">
                    {world!.completedCount + 1}/{world!.totalActions}
                  </span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {started && (
          <span className="flex items-center gap-1.5 font-mono text-[11.5px] text-ink-2">
            <Clock size={12} className="text-ink-3" />
            {fmtMs(world!.elapsedMs)}
          </span>
        )}

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-line bg-elevated/60 px-2.5 py-1.5 text-[11.5px] text-ink-2 transition-colors hover:bg-hover"
        >
          <Share2 size={12} />
          Share
        </button>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-[11px] font-bold text-white">
          G
        </span>
      </div>
    </header>
  );
}

/* ── Status bar ───────────────────────────────────────────────── */

export function StatusBar({ world }: { world: WorldState | null }) {
  const started = !!world;
  const tokens = world?.tokens ?? 0;
  return (
    <footer className="flex h-7 shrink-0 items-center gap-4 border-t border-line bg-panel/80 px-4 text-[10.5px] text-ink-3">
      <span className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${started ? "bg-ok" : "bg-ink-3"}`} />
        <span className="flex items-center gap-1">
          <Container size={10} /> Sandbox e2b · ubuntu-24.04
        </span>
      </span>
      <span className="flex items-center gap-1.5">
        <Cpu size={10} /> claude-sonnet-4.6
      </span>
      <span className="ml-auto flex items-center gap-1.5 font-mono">
        <Zap size={10} className="text-accent" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={tokens}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block text-ink-2"
          >
            {fmtTokens(tokens)}
          </motion.span>
        </AnimatePresence>
        <span>tokens</span>
      </span>
      {started && (
        <>
          <span className="font-mono">
            {world!.completedCount}/{world!.totalActions} actions
          </span>
          <span className="font-mono text-ink-2">{fmtMs(world!.elapsedMs)} elapsed</span>
        </>
      )}
    </footer>
  );
}
