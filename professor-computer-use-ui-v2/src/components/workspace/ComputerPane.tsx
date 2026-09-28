import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  MousePointer2,
  ScanEye,
  X,
} from "lucide-react";
import type { WorldState } from "../../types";
import { Site } from "../mockweb/sites";

/* ════════════════════════════════════════════════════════════════
   The Agent's Computer — a live browser the agent drives:
   URL typing · loading bar · virtual cursor · clicks · typing · scroll
   ════════════════════════════════════════════════════════════════ */

export function ComputerPane({ world }: { world: WorldState }) {
  const b = world.browser;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = b.scrollY;
  }, [b.scrollY]);

  /* URL bar: show chars typing while a navigate event is in its typing phase */
  const active = world.activeEvent;
  let urlText = b.url;
  let typingInBar = false;
  if (active && active.status === "running" && active.action.data.kind === "browser_navigate") {
    const d = active.action.data as { kind: "browser_navigate"; url: string; typingLabel?: string | null };
    const noType = d.typingLabel == null;
    if (!noType && active.progress < 0.42) {
      typingInBar = true;
      urlText = d.url.slice(0, Math.floor((active.progress / 0.42) * d.url.length));
    }
  }
  const urlForDisplay = urlText === "about:typing" ? "" : urlText;
  const isStart = b.siteId === "start" && !b.loading;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-elevated/40">
      {/* ── Browser chrome ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-line bg-header/60 px-3.5 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex gap-1 text-ink-3">
          <ArrowLeft size={14} />
          <ArrowRight size={14} className="opacity-40" />
        </div>
        <div
          className={`flex h-7 flex-1 items-center gap-2 rounded-full border px-3 text-[11.5px] transition-colors ${
            b.loading ? "border-accent/40 bg-accent/5" : "border-line bg-base/60"
          }`}
        >
          <Lock size={10} className={b.loading ? "text-accent" : "text-ink-3"} />
          <span className={`truncate font-mono ${typingInBar ? "text-ink" : "text-ink-2"}`}>
            {urlForDisplay || "about:start"}
            {typingInBar && <span className="animate-caret ml-0.5 text-accent">▍</span>}
          </span>
          <RotateCw size={11} className={`ml-auto shrink-0 text-ink-3 ${b.loading ? "animate-spin" : ""}`} />
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-line bg-base/60 px-2.5 py-1 text-[10.5px] text-ink-3 sm:flex">
          <ScanEye size={11} className="text-accent" />
          Agent's view
        </span>
      </div>

      {/* loading bar */}
      <div className="h-0.5 w-full bg-transparent">
        {b.loading && (
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-accent-2"
            animate={{ width: `${b.loadProgress * 100}%` }}
            transition={{ ease: "easeOut", duration: 0.15 }}
          />
        )}
      </div>

      {/* ── Viewport ───────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden bg-[#f7f8fb]">
        {b.loading ? (
          <div className="flex h-full flex-col gap-4 p-8">
            <div className="skeleton mx-auto mt-16 h-10 w-64 rounded-xl" />
            <div className="skeleton mx-auto h-12 w-full max-w-md rounded-full" />
            <div className="skeleton h-40 w-full rounded-2xl" />
            <div className="skeleton h-40 w-full rounded-2xl" />
          </div>
        ) : (
          <motion.div
            key={b.siteId}
            initial={{ opacity: 0.4, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            ref={scrollRef}
            className={`h-full overflow-y-auto ${isStart ? "" : "cursor-default"}`}
          >
            <Site siteId={b.siteId} typed={b.typing.boxId ? b.typing.text : undefined} />
          </motion.div>
        )}

        {/* screenshot flash */}
        {b.screenshotFlash && (
          <div className="animate-flash pointer-events-none absolute inset-0 z-20 bg-white" />
        )}

        {/* ── Virtual cursor ──────────────────────────────────── */}
        <AnimatePresence>
          {b.cursor.visible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: 1,
                scale: 1,
                left: `${b.cursor.x}%`,
                top: `${b.cursor.y}%`,
              }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 170, damping: 22, opacity: { duration: 0.15 } }}
              className="pointer-events-none absolute z-30"
              style={{ translateX: "-4px", translateY: "-4px" }}
            >
              <div className="relative">
                <MousePointer2 size={19} className="fill-white/90 text-[#1a1d29] drop-shadow-md" />
                {b.cursor.clicking && (
                  <motion.span
                    initial={{ scale: 0.3, opacity: 0.9 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.5, repeat: 2 }}
                    className="absolute -left-3 -top-3 h-8 w-8 rounded-full border-2 border-accent"
                  />
                )}
                {b.cursor.label && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-4 top-4 whitespace-nowrap rounded-md border border-accent/30 bg-[#141826]/95 px-2 py-1 text-[10.5px] font-medium text-accent shadow-lg backdrop-blur"
                  >
                    {b.cursor.label}
                    {b.typing.boxId && (
                      <span className="ml-1.5 font-mono text-accent-2">{b.typing.text}</span>
                    )}
                    {b.cursor.clicking && <span className="ml-1.5 text-ink-3">click</span>}
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* footer strip */}
      <div className="flex items-center gap-3 border-t border-line bg-panel/80 px-3.5 py-1.5 text-[10.5px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              world.activeEvent ? "bg-accent animate-pulse" : "bg-ok"
            }`}
          />
          {world.activeEvent ? "Agent is driving" : "Idle — waiting"}
        </span>
        <span className="ml-auto font-mono">{b.url === "about:typing" ? "" : b.url}</span>
      </div>
    </div>
  );
}
