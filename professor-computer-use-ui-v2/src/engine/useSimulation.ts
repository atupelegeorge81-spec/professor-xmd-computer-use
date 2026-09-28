import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  BrowserState,
  RuntimeEvent,
  Scenario,
  TerminalState,
  WorldState,
  FileNode,
  EventStatus,
} from "../types";
import { SCAFFOLD_FILES } from "../data/files";

/* ── Timeline precomputation ─────────────────────────────────── */

interface Windowed extends RuntimeEvent {
  index: number;
}

function buildTimeline(scenario: Scenario): Windowed[] {
  let t = 0;
  return scenario.actions.map((action, index) => {
    t += action.gapMs ?? 200;
    const startAt = t;
    const endAt = t + Math.max(250, action.durationMs);
    t = endAt;
    return { action, index, status: "pending" as EventStatus, progress: 0, startAt, endAt };
  });
}

/* ── World derivation ────────────────────────────────────────── */

const INITIAL_BROWSER: BrowserState = {
  url: "about:start",
  siteId: "start",
  loading: false,
  loadProgress: 0,
  scrollY: 0,
  targetScrollY: 0,
  cursor: { x: 50, y: 50, visible: false, clicking: false, label: null },
  typing: { boxId: null, text: "" },
  screenshotFlash: false,
  screenshot: null,
  history: [],
};

function emptyTerminal(cwd: string): TerminalState {
  return { lines: [], cwd, busyCommand: null, exitCode: null };
}

/** Apply a ctx/add/del diff onto original content (context lines must match). */
function applyDiff(content: string, diff: { type: "add" | "del" | "ctx"; text: string }[]): string {
  const lines = content.split("\n");
  const out: string[] = [];
  let i = 0;
  for (const dl of diff) {
    if (dl.type === "ctx") {
      out.push(lines[i] ?? dl.text);
      i++;
    } else if (dl.type === "del") {
      i++;
    } else {
      out.push(dl.text);
    }
  }
  while (i < lines.length) out.push(lines[i++]);
  return out.join("\n");
}

function deriveWorld(scenario: Scenario, timeline: Windowed[], simTime: number): WorldState {
  const files = new Map<string, FileNode>();
  const terminals: Record<number, TerminalState> = {
    1: emptyTerminal("~/workspace"),
    2: emptyTerminal("~/workspace"),
  };
  const browser = structuredClone(INITIAL_BROWSER);
  const checked = new Set<string>();
  let tokens = 0;
  let previewReady = false;
  let activeEvent: RuntimeEvent | null = null;
  let elapsedMs = simTime;
  let finished = false;
  let scrollAccum = 0;

  const pathKey = (p: string) => p;

  for (const ev of timeline) {
    const d = ev.action.data;
    const running = ev.status === "running";
    const done = ev.status === "done";
    if (running) activeEvent = ev;
    if (done || running) tokens += ev.action.tokens ?? 0;
    if (running) tokens += (ev.action.tokens ?? 0) * 0; // counted once above

    if (!done && !running) continue;

    switch (d.kind) {
      case "user_message":
      case "thinking":
      case "message":
      case "plan":
        break;

      case "search":
        break;

      case "terminal": {
        const term = (terminals[d.shell] ??= emptyTerminal(d.cwd ?? "~"));
        if (d.cwd) term.cwd = d.cwd;
        if (running && term.busyCommand !== d.command) {
          term.lines.push({ kind: "cmd", text: d.command, ts: ev.startAt });
          term.busyCommand = d.command;
          term.exitCode = null;
        }
        if (done && term.busyCommand === d.command) {
          term.busyCommand = null;
        }
        const visible = Math.floor(d.outputLines.length * (done ? 1 : Math.min(0.995, ev.progress)));
        const already = term.lines.filter((l) => l.kind === "out").length;
        for (let i = already; i < visible; i++) {
          term.lines.push({ kind: "out", text: d.outputLines[i], ts: ev.startAt });
        }
        if (done) {
          const remaining = d.outputLines.slice(visible).length;
          if (remaining > 0) {
            for (const l of d.outputLines.slice(term.lines.filter((l) => l.kind === "out").length)) {
              term.lines.push({ kind: "out", text: l, ts: ev.endAt });
            }
          }
          term.lines.push({
            kind: d.exitCode === 0 ? "ok" : "err",
            text: `Exited with code ${d.exitCode}`,
            ts: ev.endAt,
          });
          term.exitCode = d.exitCode;
          // Scaffold side effect
          if (d.command.includes("create vite")) {
            for (const f of SCAFFOLD_FILES) {
              files.set(pathKey(f.path), {
                path: f.path,
                name: f.path.split("/").pop()!,
                language: f.language,
                content: f.content,
                visibleChars: f.content.length,
                status: "scaffold",
              });
            }
          }
          if (d.command.includes("npm run dev")) previewReady = true;
        }
        break;
      }

      case "file_create": {
        const chars = Math.floor(d.content.length * (done ? 1 : Math.min(0.995, ev.progress)));
        files.set(pathKey(d.path), {
          path: d.path,
          name: d.path.split("/").pop()!,
          language: d.language,
          content: d.content,
          visibleChars: chars,
          status: "new",
        });
        break;
      }

      case "file_edit": {
        const prev = files.get(pathKey(d.path));
        if (prev) {
          prev.status = "edited";
          prev.lastDiff = d.diff;
          if (done) prev.content = applyDiff(prev.content, d.diff);
        }
        break;
      }

      case "file_read": {
        const content = d.preview.join("\n");
        const chars = Math.floor(content.length * (done ? 1 : Math.min(0.995, ev.progress)));
        files.set(pathKey(d.path), {
          path: d.path,
          name: d.path.split("/").pop()!,
          language: "ts",
          content,
          visibleChars: chars,
          status: "read",
        });
        break;
      }

      case "browser_navigate": {
        const noType = (d as { typingLabel?: string | null }).typingLabel == null;
        const typeEnd = noType ? 0 : 0.42;
        const loadEnd = noType ? 0.55 : 0.78;
        if (running) {
          const p = ev.progress;
          browser.url = p < typeEnd ? "about:typing" : d.url;
          browser.loading = p >= typeEnd && p < loadEnd;
          browser.loadProgress = Math.max(0, Math.min(1, (p - typeEnd) / (loadEnd - typeEnd)));
          if (p >= loadEnd) browser.siteId = d.siteId;
          browser.scrollY = 0;
          browser.targetScrollY = 0;
          browser.cursor.visible = false;
        } else if (done) {
          browser.url = d.url;
          browser.siteId = d.siteId;
          browser.loading = false;
          browser.scrollY = 0;
          browser.targetScrollY = 0;
          if (!browser.history.includes(d.url)) browser.history.push(d.url);
        }
        break;
      }

      case "browser_click": {
        if (running) {
          browser.siteId = d.siteId;
          const p = ev.progress;
          browser.cursor.visible = true;
          browser.cursor.label = d.targetLabel;
          browser.cursor.clicking = p > 0.5 && p < 0.72;
          browser.cursor.x = d.x;
          browser.cursor.y = d.y;
        } else if (done) {
          browser.cursor.visible = false;
          browser.cursor.clicking = false;
          browser.cursor.label = null;
        }
        break;
      }

      case "browser_type": {
        if (running) {
          browser.siteId = d.siteId;
          const p = ev.progress;
          browser.cursor.visible = p < 0.6;
          browser.cursor.label = d.targetLabel;
          browser.cursor.x = d.x;
          browser.cursor.y = d.y;
          const chars = Math.floor(d.text.length * Math.max(0, Math.min(1, (p - 0.3) / 0.6)));
          browser.typing = { boxId: d.targetLabel, text: d.text.slice(0, chars) };
        } else if (done) {
          browser.typing = { boxId: null, text: "" };
          browser.cursor.visible = false;
          browser.cursor.label = null;
        }
        break;
      }

      case "browser_scroll": {
        if (running || done) {
          browser.siteId = d.siteId;
          const base = scrollAccum;
          const eased = done ? 1 : easeInOut(ev.progress);
          browser.scrollY = Math.round(base + d.amountPx * eased);
          if (done) scrollAccum = base + d.amountPx;
        }
        break;
      }

      case "screenshot": {
        if (running) {
          browser.siteId = d.siteId;
          browser.screenshotFlash = ev.progress < 0.45;
          browser.scrollY = d.scrollY ?? browser.scrollY;
          browser.cursor.visible = false;
        } else if (done) {
          browser.screenshotFlash = false;
          browser.screenshot = { siteId: d.siteId, scrollY: d.scrollY ?? 0, caption: d.caption };
        }
        break;
      }

      case "finish": {
        if (done) finished = true;
        break;
      }
    }
  }

  // plan checkoffs
  const planEvent = timeline.find((e) => e.action.data.kind === "plan");
  if (planEvent) {
    const items = (planEvent.action.data as { kind: "plan"; items: { id: string; doneAfter: string | null }[] }).items;
    for (const item of items) {
      if (!item.doneAfter) continue;
      const target = timeline.find((e) => e.action.id === item.doneAfter);
      if (target && target.status === "done") checked.add(item.id);
    }
  }

  const completedCount = timeline.filter((e) => e.status === "done" && e.action.data.kind !== "user_message").length;
  const totalActions = timeline.filter((e) => e.action.data.kind !== "user_message").length;

  return {
    started: true,
    finished,
    files: [...files.values()],
    terminals,
    browser,
    plan: {
      items: planEvent
        ? (planEvent.action.data as { kind: "plan"; items: { id: string; text: string; doneAfter: string | null }[] }).items
        : [],
      checked,
    },
    previewReady,
    tokens,
    events: timeline,
    activeEvent,
    elapsedMs,
    completedCount,
    totalActions,
  };
}

function easeInOut(p: number): number {
  return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
}

/* ── The hook ────────────────────────────────────────────────── */

export interface SimulationControls {
  world: WorldState;
  playing: boolean;
  speed: number;
  started: boolean;
  scenario: Scenario;
  start: (scenario: Scenario) => void;
  toggle: () => void;
  restart: () => void;
  setSpeed: (s: number) => void;
  stepForward: () => void;
  timeToEventEnd: (id: string) => number;
  jumpTo: (ms: number) => void;
}

export function useSimulation(): SimulationControls {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [timeline, setTimeline] = useState<Windowed[] | null>(null);
  const [simTime, setSimTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeedState] = useState(1);

  const raf = useRef<number | null>(null);
  const lastTs = useRef<number>(0);
  const simTimeRef = useRef(0);
  const speedRef = useRef(1);
  speedRef.current = speed;

  const stopLoop = useCallback(() => {
    if (raf.current != null) cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  const tick = useCallback(
    (ts: number) => {
      if (lastTs.current === 0) lastTs.current = ts;
      const dt = (ts - lastTs.current) * speedRef.current;
      lastTs.current = ts;
      simTimeRef.current += dt;
      setSimTime(simTimeRef.current);
      raf.current = requestAnimationFrame(tick);
    },
    [],
  );

  const startLoop = useCallback(() => {
    stopLoop();
    lastTs.current = 0;
    raf.current = requestAnimationFrame(tick);
  }, [stopLoop, tick]);

  /* Recompute statuses whenever sim time changes */
  const computedTimeline = useMemo(() => {
    if (!timeline) return null;
    return timeline.map((ev) => {
      let status: EventStatus = "pending";
      let progress = 0;
      if (simTime >= ev.endAt) {
        status = "done";
        progress = 1;
      } else if (simTime >= ev.startAt) {
        status = "running";
        progress = (simTime - ev.startAt) / (ev.endAt - ev.startAt);
      }
      return { ...ev, status, progress };
    });
  }, [timeline, simTime]);

  /* Stop the clock when everything is done */
  useEffect(() => {
    if (!computedTimeline) return;
    const last = computedTimeline[computedTimeline.length - 1];
    if (last && last.status === "done" && playing) {
      setPlaying(false);
      stopLoop();
    }
  }, [computedTimeline, playing, stopLoop]);

  useEffect(() => () => stopLoop(), [stopLoop]);

  const start = useCallback(
    (sc: Scenario, opts?: { startAtMs?: number }) => {
      const tl = buildTimeline(sc);
      setTimeline(tl);
      setScenario(sc);
      simTimeRef.current = opts?.startAtMs ?? 0;
      setSimTime(simTimeRef.current);
      setPlaying(true);
      startLoop();
    },
    [startLoop],
  );

  const toggle = useCallback(() => {
    setPlaying((p) => {
      const next = !p;
      if (next) startLoop();
      else stopLoop();
      return next;
    });
  }, [startLoop, stopLoop]);

  const restart = useCallback(() => {
    if (scenario) start(scenario);
  }, [scenario, start]);

  const setSpeed = useCallback((s: number) => {
    setSpeedState(s);
  }, []);

  const stepForward = useCallback(() => {
    if (!computedTimeline) return;
    const nextEv = computedTimeline.find((e) => e.status !== "done");
    if (!nextEv) return;
    const wasPlaying = playing;
    stopLoop();
    setPlaying(false);
    simTimeRef.current = nextEv.endAt + 1;
    setSimTime(simTimeRef.current);
    if (wasPlaying) {
      // resume shortly after
      setTimeout(() => {
        setPlaying(true);
        startLoop();
      }, 600);
    }
  }, [computedTimeline, playing, startLoop, stopLoop]);

  const timeToEventEnd = useCallback(
    (id: string): number => {
      if (!timeline) return 0;
      const ev = timeline.find((e) => e.action.id === id);
      return ev ? ev.endAt : 0;
    },
    [timeline],
  );

  /** Jump sim time to an arbitrary point (ms). Pauses. */
  const jumpTo = useCallback(
    (ms: number) => {
      stopLoop();
      setPlaying(false);
      simTimeRef.current = ms;
      setSimTime(ms);
    },
    [stopLoop],
  );

  const world = useMemo(() => {
    if (!scenario || !computedTimeline) {
      return null;
    }
    return deriveWorld(scenario, computedTimeline, simTime);
  }, [scenario, computedTimeline, simTime]);

  return {
    world: world as unknown as WorldState,
    playing,
    speed,
    started: !!scenario,
    scenario: scenario as Scenario,
    start,
    toggle,
    restart,
    setSpeed,
    stepForward,
    timeToEventEnd,
    jumpTo,
  };
}
