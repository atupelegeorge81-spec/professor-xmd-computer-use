import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, SkipForward, Gauge, SlidersHorizontal } from "lucide-react";
import type { RuntimeEvent } from "../types";

/* ── Floating demo controls: play / pause / restart / step / speed ── */

const SPEEDS = [0.5, 1, 2, 4];

const SCENE_LABELS: Record<string, string> = {
  t1: "Thinking",
  p1: "Plan",
  s1: "Web search",
  bn0: "Browser · search",
  bt1: "Browser · typing",
  bn1: "Competitor site",
  ss1: "Screenshot",
  m1: "Research summary",
  tm1: "Terminal · scaffold",
  fc1: "Writing Hero.tsx",
  tm2: "npm install",
  tm3: "Dev server",
  bn3: "Verify in browser",
  f1: "Finish",
  tm1b: "Failing tests",
  fr1: "Read checkout.ts",
  fe1: "Apply fix",
};

export function DemoControls({
  events,
  playing,
  speed,
  onToggle,
  onRestart,
  onStep,
  onSpeed,
  onJump,
}: {
  events: RuntimeEvent[];
  playing: boolean;
  speed: number;
  onToggle: () => void;
  onRestart: () => void;
  onStep: () => void;
  onSpeed: (s: number) => void;
  onJump: (simTime: number) => void;
}) {
  const [open, setOpen] = useState(false);

  /* total scenario length */
  const total = events.length ? events[events.length - 1].endAt : 0;
  const doneT = events.reduce((acc, e) => (e.status === "done" ? Math.max(acc, e.endAt) : acc), 0);
  const pct = total ? Math.min(100, (doneT / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            className="w-64 rounded-xl border border-line bg-panel/95 p-2 shadow-2xl backdrop-blur"
          >
            <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-3">
              Jump to scene
            </p>
            <div className="max-h-64 overflow-y-auto pr-1">
              {events
                .filter((e) => e.action.data.kind !== "user_message")
                .map((e) => (
                  <button
                    key={e.action.id}
                    type="button"
                    onClick={() => onJump(e.startAt + (e.endAt - e.startAt) * 0.55)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11.5px] transition-colors ${
                      e.status === "done" ? "text-ink-2" : e.status === "running" ? "text-accent" : "text-ink-3"
                    } hover:bg-white/5`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        e.status === "done" ? "bg-ok" : e.status === "running" ? "bg-accent animate-pulse" : "bg-ink-3/50"
                      }`}
                    />
                    <span className="truncate">
                      {SCENE_LABELS[e.action.id] ?? e.action.data.kind.replaceAll("_", " ")}
                    </span>
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1 rounded-xl border border-line bg-panel/95 p-1.5 shadow-2xl backdrop-blur">
        <button
          type="button"
          onClick={onToggle}
          className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent transition-colors hover:bg-accent/25"
          title={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          type="button"
          onClick={onStep}
          className="grid h-8 w-8 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-white/5"
          title="Skip to next action"
        >
          <SkipForward size={14} />
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="grid h-8 w-8 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-white/5"
          title="Restart run"
        >
          <RotateCcw size={14} />
        </button>
        <button
          type="button"
          onClick={() => onSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
          className="flex h-8 items-center gap-1 rounded-lg px-2 text-[11px] font-mono text-ink-2 transition-colors hover:bg-white/5"
          title="Cycle speed"
        >
          <Gauge size={13} />
          {speed}x
        </button>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
            open ? "bg-white/8 text-ink" : "text-ink-2 hover:bg-white/5"
          }`}
          title="Scenes"
        >
          <SlidersHorizontal size={13} />
        </button>
        <div className="mx-1 h-5 w-px bg-line" />
        <div className="w-24">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-[width] duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
