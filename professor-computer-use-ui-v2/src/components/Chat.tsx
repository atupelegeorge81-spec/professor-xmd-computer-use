import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, Paperclip, Globe2, Send, Square, Sparkles, MonitorPlay, Wand2, ShieldCheck, GraduationCap } from "lucide-react";
import type { RuntimeEvent, Scenario, WorldState } from "../types";
import { EventCard } from "./cards/Cards";

/* ── Chat rail ────────────────────────────────────────────────── */

export function ChatPanel({
  world,
  onComposerSubmit,
  running,
}: {
  world: WorldState;
  onComposerSubmit: (text: string) => void;
  running: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);
  const visible = world.events.filter((e) => e.status !== "pending");

  /* sticky scroll: follow the stream unless the user scrolled up */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
      setPinned(nearBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && pinned) el.scrollTo({ top: el.scrollHeight });
  }, [visible.length, world.elapsedMs, pinned]);

  return (
    <div className="flex h-full min-h-0 flex-col border-r border-line bg-panel/40">
      {/* messages */}
      <div className="relative min-h-0 flex-1">
        <div ref={scrollRef} className="h-full space-y-3 overflow-y-auto px-4 py-4">
          {visible.map((ev: RuntimeEvent) => (
            <EventCard key={ev.action.id} ev={ev} world={world} />
          ))}
        </div>
        {!pinned && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              setPinned(true);
              scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
            }}
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-elevated/95 px-3 py-1.5 text-[11px] text-ink-2 shadow-lg backdrop-blur"
          >
            <ArrowDown size={11} /> Jump to latest
          </motion.button>
        )}
      </div>

      {/* composer */}
      <Composer onSubmit={onComposerSubmit} running={running} />
    </div>
  );
}

/* ── Composer ─────────────────────────────────────────────────── */

export function Composer({
  onSubmit,
  running,
  autoFocus = false,
  big = false,
}: {
  onSubmit: (text: string) => void;
  running: boolean;
  autoFocus?: boolean;
  big?: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, big ? 160 : 110)}px`;
    }
  }, [value, big]);

  const submit = () => {
    const t = value.trim();
    if (!t || running) return;
    onSubmit(t);
    setValue("");
  };

  return (
    <div className={`shrink-0 ${big ? "" : "border-t border-line bg-panel/60 p-3"}`}>
      <div
        className={`rounded-2xl border border-line-2 bg-elevated/70 shadow-lg shadow-black/20 transition-colors focus-within:border-accent/50 ${
          big ? "p-3" : "p-2.5"
        }`}
      >
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={big ? 2 : 1}
          placeholder={running ? "Agent is working…" : "Describe a task for the agent…"}
          className={`w-full resize-none bg-transparent px-1.5 text-ink placeholder:text-ink-3 focus:outline-none ${
            big ? "text-[14.5px]" : "text-[13px]"
          }`}
        />
        <div className="mt-1.5 flex items-center gap-1.5">
          <button type="button" className="grid h-7 w-7 place-items-center rounded-lg text-ink-3 transition-colors hover:bg-white/5 hover:text-ink-2" title="Attach">
            <Paperclip size={14} />
          </button>
          <button
            type="button"
            className="flex h-7 items-center gap-1.5 rounded-lg border border-sky-400/25 bg-sky-400/10 px-2.5 text-[11px] font-medium text-sky-300"
            title="Agent can browse the web"
          >
            <Globe2 size={12} /> Web
          </button>
          <span className="ml-1 hidden rounded-md border border-line bg-base/60 px-2 py-0.5 font-mono text-[10px] text-ink-3 sm:block">
            Agent Mode
          </span>
          <span className="ml-auto" />
          {running ? (
            <span className="flex h-8 items-center gap-2 rounded-xl bg-white/5 px-3 text-[11.5px] text-ink-3">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              working…
            </span>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={submit}
              disabled={!value.trim()}
              className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-md shadow-accent/25 disabled:opacity-35 disabled:shadow-none"
            >
              {running ? <Square size={12} /> : <Send size={13} />}
            </motion.button>
          )}
        </div>
      </div>
      {!big && (
        <p className="mt-2 text-center text-[10px] text-ink-3">
          Professor can browse, type, click, run commands and edit files to complete tasks.
        </p>
      )}
    </div>
  );
}

/* ── Welcome / empty state ────────────────────────────────────── */

export function WelcomeScreen({
  onPick,
  scenarios,
}: {
  onPick: (s: Scenario) => void;
  scenarios: Scenario[];
}) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-6">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent-2/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
        className="relative flex w-full max-w-2xl flex-col items-center"
      >
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
          className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-xl shadow-accent/30"
        >
          <GraduationCap size={30} />
        </motion.span>
        <h1 className="text-center text-[34px] font-bold tracking-tight text-ink">
          What should <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">Professor</span> do today?
        </h1>
        <p className="mt-2.5 max-w-md text-center text-[13.5px] leading-relaxed text-ink-2">
          A computer-use agent that researches the web, writes code, runs commands and verifies its
          work — while you watch every step.
        </p>

        <div className="mt-7 w-full">
          <Composer onSubmit={(t) => onPick(matchScenario(t, scenarios))} running={false} big autoFocus />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {scenarios.map((s) => (
            <motion.button
              key={s.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onPick(s)}
              className="flex items-center gap-2 rounded-full border border-line bg-panel-2/80 px-3.5 py-2 text-[12px] text-ink-2 transition-colors hover:border-accent/40 hover:text-ink"
            >
              <Sparkles size={12} className="text-accent" />
              {s.id === "landing" ? "Research competitors & build a landing page" : "Fix the failing checkout tests"}
            </motion.button>
          ))}
        </div>

        <div className="mt-10 grid w-full grid-cols-3 gap-3">
          {[
            [MonitorPlay, "Watch it work", "Live browser, files and terminal — every action rendered in real time."],
            [Wand2, "Every action animated", "Thinking, clicking, typing, commands, diffs — nothing is a black box."],
            [ShieldCheck, "Verified before done", "The agent screenshots and tests its own work before reporting back."],
          ].map(([Icon, t, d], i) => (
            <motion.div
              key={t as string}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              className="rounded-xl border border-line bg-panel-2/60 p-4"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/10 text-accent">
                <Icon size={15} />
              </span>
              <h3 className="mt-2.5 text-[12.5px] font-semibold text-ink">{t as string}</h3>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-3">{d as string}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-[10.5px] text-ink-3"
          >
            UI v2 demo · mock engine, no backend required · English-only interface
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function matchScenario(text: string, scenarios: Scenario[]): Scenario {
  const t = text.toLowerCase();
  const bugfix = scenarios.find((s) => s.id === "bugfix");
  const landing = scenarios.find((s) => s.id === "landing");
  if (bugfix && /test|bug|fix|fail|checkout/.test(t)) return bugfix;
  return landing ?? scenarios[0];
}
