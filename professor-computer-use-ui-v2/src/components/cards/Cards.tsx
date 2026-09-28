import { motion } from "motion/react";
import {
  Brain,
  ListChecks,
  Globe,
  TerminalSquare,
  FilePlus2,
  FilePen,
  FileSearch,
  MousePointerClick,
  Keyboard,
  ArrowDownUp,
  Camera,
  Sparkles,
  GraduationCap,
  Check,
} from "lucide-react";
import type { ReactNode } from "react";
import type { RuntimeEvent, WorldState, DiffLine } from "../../types";
import { ActionShell } from "./ActionShell";
import { CodeBlock, Collapse, Pill, ShimmerText, StreamingText, fmtDur } from "../ui/bits";
import { SiteThumb } from "../mockweb/sites";
import { useState } from "react";

/* ══ User message ═════════════════════════════════════════════ */

export function UserMessage({ ev }: { ev: RuntimeEvent }) {
  const text = (ev.action.data as { kind: "user_message"; text: string }).text;
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="flex justify-end gap-2.5 pl-8"
    >
      <div className="max-w-[92%] rounded-xl rounded-tr-sm border border-accent/25 bg-accent/10 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-ink">
        {text}
      </div>
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line bg-elevated text-[11px] font-bold text-ink-2">
        You
      </span>
    </motion.div>
  );
}

/* ══ Thinking ══════════════════════════════════════════════════ */

export function ThinkingCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as { kind: "thinking"; thoughts: string[] };
  const running = ev.status === "running";
  const done = ev.status === "done";
  const [open, setOpen] = useState(false);

  const full = d.thoughts.join("\n");
  const visible = running ? Math.floor(full.length * Math.min(0.995, ev.progress)) : full.length;
  const visibleText = full.slice(0, visible);
  const shownThoughts = visibleText.split("\n");

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="rounded-xl border border-line/60 bg-panel-2/40"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left"
      >
        <span className="grid h-6 w-6 place-items-center rounded-md bg-violet-500/15 text-violet-300">
          <Brain size={13} />
        </span>
        {running ? (
          <ShimmerText className="text-[12.5px] font-medium">Thinking…</ShimmerText>
        ) : done ? (
          <span className="text-[12.5px] font-medium text-ink-2">Thought for {fmtDur(ev.endAt - ev.startAt)}</span>
        ) : (
          <span className="text-[12.5px] font-medium text-ink-3">Thinking</span>
        )}
        {running && (
          <span className="ml-1 flex items-center gap-2 text-[11px] text-ink-3">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
            <span className="font-mono">{Math.round(ev.progress * 100)}%</span>
          </span>
        )}
        <span className={`ml-auto text-[11px] text-ink-3 transition-colors ${open ? "text-accent" : ""}`}>
          {open ? "hide" : "thoughts"}
        </span>
      </button>
      <Collapse open={open || running}>
        <div className="space-y-1.5 border-t border-line/50 px-3.5 pb-3 pt-2.5">
          {shownThoughts.map((t, i) =>
            t ? (
              <p
                key={i}
                className={`text-[12.5px] italic leading-relaxed ${
                  i === shownThoughts.length - 1 && running ? "text-ink-2" : "text-ink-3"
                }`}
              >
                {t}
                {i === shownThoughts.length - 1 && running && (
                  <span className="animate-caret ml-0.5 not-italic text-violet-300">▍</span>
                )}
              </p>
            ) : null,
          )}
        </div>
      </Collapse>
    </motion.div>
  );
}

/* ══ Assistant message (streamed markdown-ish) ═════════════════ */

function MiniMarkdown({ text, caret }: { text: string; caret: boolean }) {
  const paras = text.split("\n\n");
  return (
    <div className="space-y-2.5">
      {paras.map((p, i) => (
        <p key={i} className="text-[13.5px] leading-relaxed text-ink/90">
          <MdSpan text={p} />
          {caret && i === paras.length - 1 && <span className="animate-caret ml-0.5 text-accent">▍</span>}
        </p>
      ))}
    </div>
  );
}

function MdSpan({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**"))
          return (
            <strong key={i} className="font-semibold text-ink">
              {p.slice(2, -2)}
            </strong>
          );
        if (p.startsWith("*") && p.endsWith("*") && p.length > 2)
          return (
            <em key={i} className="text-ink-2">
              {p.slice(1, -1)}
            </em>
          );
        if (p.startsWith("`") && p.endsWith("`") && p.length > 2)
          return (
            <code key={i} className="rounded bg-white/8 px-1 py-0.5 font-mono text-[12px] text-accent-2">
              {p.slice(1, -1)}
            </code>
          );
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

export function MessageCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as { kind: "message"; text: string };
  const running = ev.status === "running";
  const visible = running ? Math.floor(d.text.length * Math.min(0.995, ev.progress)) : d.text.length;
  const shown = d.text.slice(0, visible);
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="flex gap-2.5 pr-8"
    >
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-white shadow-md shadow-accent/20">
        <GraduationCap size={14} />
      </span>
      <div className="min-w-0 flex-1 rounded-xl rounded-tl-sm border border-line bg-panel-2/80 px-3.5 py-3">
        <MiniMarkdown text={shown} caret={running} />
      </div>
    </motion.div>
  );
}

/* ══ Plan / todo ═══════════════════════════════════════════════ */

export function PlanCard({ ev, world }: { ev: RuntimeEvent; world: WorldState }) {
  const d = ev.action.data as { kind: "plan"; items: { id: string; text: string }[] };
  const running = ev.status === "running";
  const allDone = d.items.every((i) => world.plan.checked.has(i.id));
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className={`overflow-hidden rounded-xl border bg-panel-2/80 ${
        running ? "running-glow border-accent/30" : allDone ? "border-ok/25" : "border-line"
      }`}
    >
      <div className="flex items-center gap-2.5 border-b border-line/60 bg-header/40 px-3 py-2.5">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-accent/15 text-accent">
          <ListChecks size={13} />
        </span>
        {running ? (
          <ShimmerText className="text-[12.5px] font-medium">Building the plan…</ShimmerText>
        ) : (
          <span className="text-[12.5px] font-medium text-ink">Plan</span>
        )}
        <span className="ml-auto">
          <Pill tone={allDone ? "ok" : "default"}>
            {d.items.filter((i) => world.plan.checked.has(i.id)).length}/{d.items.length}
          </Pill>
        </span>
      </div>
      <ol className="space-y-1 px-3 py-2.5">
        {d.items.map((item, i) => {
          const checked = world.plan.checked.has(item.id);
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 400, damping: 28 }}
              className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5"
            >
              <motion.span
                animate={checked ? { scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 0.35 }}
                className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                  checked ? "border-ok bg-ok/20 text-ok" : "border-line-2 text-transparent"
                }`}
                style={{ width: 18, height: 18 }}
              >
                <Check size={11} strokeWidth={3.5} />
              </motion.span>
              <span
                className={`text-[13px] transition-all duration-300 ${
                  checked ? "text-ink-3 line-through decoration-ink-3/50" : "text-ink/90"
                }`}
              >
                {item.text}
              </span>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}

/* ══ Web search ════════════════════════════════════════════════ */

export function SearchCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as {
    kind: "search";
    query: string;
    results: { title: string; url: string; snippet: string }[];
  };
  const running = ev.status === "running";
  const p = running ? ev.progress : 1;
  const typingDone = p > 0.3;
  const visibleResults = typingDone ? Math.ceil(Math.max(0, (p - 0.3) / 0.7) * d.results.length) : 0;
  const colors = ["#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6", "#f43f5e"];
  return (
    <ActionShell
      ev={ev}
      icon={<Globe size={13} />}
      iconClass="bg-sky-500/15 text-sky-300"
      verbRunning="Searching the web"
      verbDone="Searched the web"
      title={<StreamingText text={`"${d.query}"`} progress={Math.min(1, p / 0.3)} />}
      expandable
      badge={ev.status === "done" ? <Pill>{d.results.length} results</Pill> : undefined}
    >
      <div className="space-y-2.5">
        {d.results.slice(0, running ? visibleResults : d.results.length).map((r, i) => (
          <motion.div
            key={r.url}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="flex gap-2.5"
          >
            <span
              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
              style={{ background: colors[i % colors.length] }}
            >
              {r.url.replace("https://", "")[0].toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="truncate font-mono text-[11px] text-emerald-400/80">{r.url}</div>
              <div className="truncate text-[12.5px] font-medium text-ink/90">{r.title}</div>
              <div className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-ink-3">{r.snippet}</div>
            </div>
          </motion.div>
        ))}
        {running && visibleResults < d.results.length && (
          <div className="skeleton h-9 rounded-lg" />
        )}
      </div>
    </ActionShell>
  );
}

/* ══ Terminal ══════════════════════════════════════════════════ */

export function TerminalCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as {
    kind: "terminal";
    command: string;
    outputLines: string[];
    exitCode: number;
    shell: number;
  };
  const running = ev.status === "running";
  const failed = ev.status === "done" && d.exitCode !== 0;
  const p = running ? ev.progress : 1;
  const visible = Math.floor(d.outputLines.length * Math.min(0.995, p));
  const lines = d.outputLines.slice(0, visible);
  return (
    <ActionShell
      ev={ev}
      icon={<TerminalSquare size={13} />}
      iconClass={failed ? "bg-err/15 text-err" : "bg-emerald-500/12 text-emerald-300"}
      verbRunning="Running command"
      verbDone={failed ? "Command failed" : "Ran command"}
      title={<span className={failed ? "text-err/90" : ""}>$ {d.command}</span>}
      expandable
      badge={
        ev.status === "done" ? (
          <Pill tone={failed ? "err" : "ok"}>exit {d.exitCode}</Pill>
        ) : undefined
      }
    >
      <div className="max-h-56 overflow-auto rounded-lg border border-line bg-base/80 p-2.5 font-mono text-[11.5px] leading-relaxed">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className={`whitespace-pre-wrap ${
              l.startsWith("FAIL") || l.startsWith("  ✗") ? "text-err/90" : l.startsWith("PASS") ? "text-ok/90" : "text-ink-2"
            }`}
          >
            {l || "\u00A0"}
          </motion.div>
        ))}
        {running && (
          <div className="flex items-center gap-1 text-ink-3">
            <span className="animate-caret text-emerald-300">▍</span>
          </div>
        )}
      </div>
    </ActionShell>
  );
}

/* ══ File actions ══════════════════════════════════════════════ */

export function FileCreateCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as { kind: "file_create"; path: string; content: string; language: string };
  const running = ev.status === "running";
  const total = d.content.split("\n").length;
  const visibleChars = running ? Math.floor(d.content.length * Math.min(0.995, ev.progress)) : Infinity;
  return (
    <ActionShell
      ev={ev}
      icon={<FilePlus2 size={13} />}
      iconClass="bg-emerald-500/12 text-emerald-300"
      verbRunning="Writing file"
      verbDone="Created file"
      title={d.path}
      expandable
      badge={<Pill tone="ok">NEW</Pill>}
    >
      <div className="space-y-2">
        <CodeBlock code={d.content} visibleChars={visibleChars} />
        {running && (
          <div className="flex items-center justify-between text-[10.5px] text-ink-3">
            <span>
              {Math.min(Math.floor(visibleChars / Math.max(1, d.content.length / total)) + 1, total)} / {total} lines
            </span>
            <span className="font-mono">{Math.round(ev.progress * 100)}%</span>
          </div>
        )}
      </div>
    </ActionShell>
  );
}

export function FileEditCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as { kind: "file_edit"; path: string; diff: DiffLine[] };
  const running = ev.status === "running";
  const visible = running ? Math.ceil(d.diff.length * Math.min(0.995, ev.progress)) : d.diff.length;
  return (
    <ActionShell
      ev={ev}
      icon={<FilePen size={13} />}
      iconClass="bg-amber-500/12 text-amber-300"
      verbRunning="Editing file"
      verbDone="Edited file"
      title={d.path}
      expandable
      badge={<Pill tone="warn">MODIFIED</Pill>}
    >
      <div className="overflow-hidden rounded-lg border border-line bg-base/80 font-mono text-[11.5px]">
        {d.diff.slice(0, visible).map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: l.type === "add" ? 12 : -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            className={`flex gap-2 px-2 py-px leading-5 ${
              l.type === "add"
                ? "bg-emerald-500/10 text-emerald-200"
                : l.type === "del"
                  ? "bg-rose-500/10 text-rose-200/80"
                  : "text-ink-2"
            }`}
          >
            <span className="w-3 shrink-0 select-none text-right opacity-60">
              {l.type === "add" ? "+" : l.type === "del" ? "−" : " "}
            </span>
            <span className="whitespace-pre">{l.text || "\u00A0"}</span>
          </motion.div>
        ))}
      </div>
    </ActionShell>
  );
}

export function FileReadCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as { kind: "file_read"; path: string; preview: string[]; linesShown: number };
  const running = ev.status === "running";
  const full = d.preview.join("\n");
  const visibleChars = running ? Math.floor(full.length * Math.min(0.995, ev.progress)) : Infinity;
  return (
    <ActionShell
      ev={ev}
      icon={<FileSearch size={13} />}
      iconClass="bg-sky-500/12 text-sky-300"
      verbRunning="Reading file"
      verbDone="Read file"
      title={d.path}
      expandable
      badge={<Pill>{d.linesShown} lines</Pill>}
    >
      <CodeBlock code={full} visibleChars={visibleChars} />
    </ActionShell>
  );
}

/* ══ Browser actions ═══════════════════════════════════════════ */

export function BrowserNavigateCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as { kind: "browser_navigate"; url: string };
  const running = ev.status === "running";
  const p = running ? ev.progress : 1;
  const typing = p < 0.42;
  return (
    <ActionShell
      ev={ev}
      icon={<Globe size={13} />}
      iconClass="bg-sky-500/15 text-sky-300"
      verbRunning={typing ? "Typing address" : "Loading page"}
      verbDone="Navigated to"
      title={
        typing ? (
          <span className="text-ink-2">
            <StreamingText text={d.url} progress={p / 0.42} />
            <span className="animate-caret ml-0.5 text-sky-300">▍</span>
          </span>
        ) : running ? (
          <span className="text-ink-2">{d.url}</span>
        ) : (
          d.url
        )
      }
    >
      <div className="h-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
          animate={{ width: `${Math.min(100, Math.max(0, ((p - 0.42) / 0.36) * 100))}%` }}
          transition={{ ease: "easeOut" }}
        />
      </div>
    </ActionShell>
  );
}

export function BrowserClickCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as { kind: "browser_click"; targetLabel: string; x: number; y: number };
  return (
    <ActionShell
      ev={ev}
      icon={<MousePointerClick size={13} />}
      iconClass="bg-accent/15 text-accent"
      verbRunning="Clicking"
      verbDone="Clicked"
      title={d.targetLabel}
      badge={
        <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-ink-3">
          {Math.round(d.x)}%, {Math.round(d.y)}%
        </span>
      }
    />
  );
}

export function BrowserTypeCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as { kind: "browser_type"; text: string; targetLabel: string };
  const running = ev.status === "running";
  const p = running ? Math.max(0, Math.min(1, (ev.progress - 0.3) / 0.6)) : 1;
  return (
    <ActionShell
      ev={ev}
      icon={<Keyboard size={13} />}
      iconClass="bg-accent/15 text-accent"
      verbRunning="Typing into"
      verbDone="Typed into"
      title={d.targetLabel}
    >
      <div className="rounded-lg border border-line bg-base/70 px-3 py-2 font-mono text-[12px] text-accent-2">
        <StreamingText text={d.text} progress={p} showCaret />
      </div>
    </ActionShell>
  );
}

export function BrowserScrollCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as { kind: "browser_scroll"; direction: string; amountPx: number };
  return (
    <ActionShell
      ev={ev}
      icon={<ArrowDownUp size={13} />}
      iconClass="bg-sky-500/12 text-sky-300"
      verbRunning="Scrolling"
      verbDone="Scrolled"
      title={`${d.direction} ${d.amountPx}px`}
    />
  );
}

export function ScreenshotCard({ ev }: { ev: RuntimeEvent }) {
  const d = ev.action.data as { kind: "screenshot"; caption: string; siteId: string; scrollY: number };
  const running = ev.status === "running";
  return (
    <ActionShell
      ev={ev}
      icon={<Camera size={13} />}
      iconClass="bg-violet-500/15 text-violet-300"
      verbRunning="Capturing screenshot"
      verbDone="Captured screenshot"
      title={d.caption}
      stayOpen
    >
      <div className="relative overflow-hidden rounded-lg border border-line bg-white">
        {running ? (
          <>
            <div className="skeleton aspect-[16/10] w-full" />
            <div className="animate-flash pointer-events-none absolute inset-0 bg-white" />
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="aspect-[16/10] w-full"
          >
            <SiteThumb siteId={d.siteId} scrollY={d.scrollY} width={560} />
          </motion.div>
        )}
      </div>
    </ActionShell>
  );
}

/* ══ Finish ════════════════════════════════════════════════════ */

export function FinishCard({ ev, world }: { ev: RuntimeEvent; world: WorldState }) {
  const d = ev.action.data as { kind: "finish"; summary: string; highlights: string[] };
  const running = ev.status === "running";
  const p = running ? ev.progress : 1;
  const stats: [string, string][] = [
    ["Files written", `${world.files.filter((f) => f.status === "new" || f.status === "edited").length}`],
    ["Commands run", `${Object.values(world.terminals).reduce((a, t) => a + t.lines.filter((l) => l.kind === "cmd").length, 0)}`],
    ["Screenshots", `${world.events.filter((e) => e.action.data.kind === "screenshot" && e.status === "done").length}`],
    ["Elapsed", fmtDur(world.elapsedMs)],
  ];
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="relative overflow-hidden rounded-xl border border-ok/30 bg-gradient-to-br from-panel-2 to-elevated/60"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-y-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-ok/8 to-transparent"
          style={{ animationIterationCount: 3 }}
        />
      </div>
      <div className="relative flex items-center gap-2.5 border-b border-line/60 px-3.5 py-3">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-md shadow-emerald-500/20">
          <Sparkles size={14} />
        </span>
        {running ? (
          <ShimmerText className="text-[13px] font-semibold">Wrapping up…</ShimmerText>
        ) : (
          <span className="text-[13px] font-semibold text-ink">Task complete</span>
        )}
        <Pill tone="ok" className="ml-auto">
          <Check size={10} strokeWidth={3} /> verified
        </Pill>
      </div>
      <div className="relative space-y-4 px-3.5 py-3">
        <MiniMarkdown text={running ? d.summary.slice(0, Math.floor(d.summary.length * Math.min(0.995, p))) : d.summary} caret={running} />
        <div className="grid grid-cols-4 gap-2">
          {stats.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              className="rounded-lg border border-line bg-base/50 px-2.5 py-2 text-center"
            >
              <div className="font-mono text-[15px] font-bold text-ink">{v}</div>
              <div className="mt-0.5 text-[10px] text-ink-3">{k}</div>
            </motion.div>
          ))}
        </div>
        <div className="space-y-1.5">
          {d.highlights.slice(0, Math.ceil(p * d.highlights.length)).map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="flex items-start gap-2 text-[12.5px] text-ink-2"
            >
              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-ok/15 text-ok">
                <Check size={9} strokeWidth={3.5} />
              </span>
              {h}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ══ Dispatcher ════════════════════════════════════════════════ */

export function EventCard({ ev, world }: { ev: RuntimeEvent; world: WorldState }): ReactNode {
  switch (ev.action.data.kind) {
    case "user_message":
      return <UserMessage ev={ev} />;
    case "thinking":
      return <ThinkingCard ev={ev} />;
    case "message":
      return <MessageCard ev={ev} />;
    case "plan":
      return <PlanCard ev={ev} world={world} />;
    case "search":
      return <SearchCard ev={ev} />;
    case "terminal":
      return <TerminalCard ev={ev} />;
    case "file_create":
      return <FileCreateCard ev={ev} />;
    case "file_edit":
      return <FileEditCard ev={ev} />;
    case "file_read":
      return <FileReadCard ev={ev} />;
    case "browser_navigate":
      return <BrowserNavigateCard ev={ev} />;
    case "browser_click":
      return <BrowserClickCard ev={ev} />;
    case "browser_type":
      return <BrowserTypeCard ev={ev} />;
    case "browser_scroll":
      return <BrowserScrollCard ev={ev} />;
    case "screenshot":
      return <ScreenshotCard ev={ev} />;
    case "finish":
      return <FinishCard ev={ev} world={world} />;
    default:
      return null;
  }
}
