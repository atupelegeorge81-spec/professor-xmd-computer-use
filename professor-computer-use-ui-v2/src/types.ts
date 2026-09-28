/* ── Professor XMD UI v2 — core types ─────────────────────────── */

export type ActionKind =
  | "user_message"
  | "thinking"
  | "message"
  | "plan"
  | "search"
  | "terminal"
  | "file_create"
  | "file_edit"
  | "file_read"
  | "browser_navigate"
  | "browser_click"
  | "browser_type"
  | "browser_scroll"
  | "screenshot"
  | "finish";

export type EventStatus = "pending" | "running" | "done";

export type WorkspaceTab = "computer" | "files" | "terminal" | "preview";

export interface PlanItem {
  id: string;
  text: string;
  /** this plan item gets checked when the event with this id completes */
  doneAfter: string | null;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface DiffLine {
  type: "add" | "del" | "ctx";
  text: string;
}

export type ActionData =
  | { kind: "user_message"; text: string }
  | { kind: "thinking"; thoughts: string[] }
  | { kind: "message"; text: string }
  | { kind: "plan"; items: PlanItem[] }
  | { kind: "search"; query: string; results: SearchResult[] }
  | {
      kind: "terminal";
      shell: 1 | 2;
      command: string;
      outputLines: string[];
      exitCode: number;
      cwd?: string;
    }
  | { kind: "file_create"; path: string; language: string; content: string }
  | { kind: "file_edit"; path: string; language: string; diff: DiffLine[] }
  | { kind: "file_read"; path: string; linesShown: number; preview: string[] }
  | { kind: "browser_navigate"; url: string; siteId: string; typingLabel?: string | null }
  | { kind: "browser_click"; targetLabel: string; x: number; y: number; siteId: string }
  | { kind: "browser_type"; targetLabel: string; x: number; y: number; text: string; siteId: string }
  | { kind: "browser_scroll"; direction: "down" | "up"; amountPx: number; siteId: string }
  | { kind: "screenshot"; caption: string; siteId: string; scrollY?: number }
  | { kind: "finish"; summary: string; highlights: string[] };

export interface ScenarioAction {
  id: string;
  data: ActionData;
  /** simulated wall-clock duration of the running phase (ms) */
  durationMs: number;
  /** idle gap before this action starts, after the previous one ends (ms) */
  gapMs?: number;
  /** approximate tokens consumed — drives the token meter */
  tokens?: number;
}

export interface Scenario {
  id: string;
  trigger: string;
  sessionTitle: string;
  actions: ScenarioAction[];
}

/* ── Runtime ──────────────────────────────────────────────────── */

export interface RuntimeEvent {
  action: ScenarioAction;
  status: EventStatus;
  /** 0..1 progress through the running phase */
  progress: number;
  /** absolute sim-time window */
  startAt: number;
  endAt: number;
}

/* ── Derived world state (what the agent has done so far) ────── */

export interface TermLine {
  kind: "cmd" | "out" | "ok" | "err" | "info";
  text: string;
  ts: number;
}

export interface TerminalState {
  lines: TermLine[];
  cwd: string;
  busyCommand: string | null;
  exitCode: number | null;
}

export interface FileNode {
  path: string;
  name: string;
  language: string;
  content: string;
  /** streamed chars visible so far */
  visibleChars: number;
  status: "new" | "edited" | "read" | "scaffold";
  lastDiff?: DiffLine[];
}

export interface BrowserState {
  url: string;
  siteId: string;
  loading: boolean;
  loadProgress: number;
  scrollY: number;
  targetScrollY: number;
  cursor: { x: number; y: number; visible: boolean; clicking: boolean; label: string | null };
  typing: { boxId: string | null; text: string };
  screenshotFlash: boolean;
  screenshot: { siteId: string; scrollY: number; caption: string } | null;
  history: string[];
}

export interface WorldState {
  started: boolean;
  finished: boolean;
  files: FileNode[];
  terminals: Record<number, TerminalState>;
  browser: BrowserState;
  plan: { items: PlanItem[]; checked: Set<string> };
  previewReady: boolean;
  tokens: number;
  events: RuntimeEvent[];
  activeEvent: RuntimeEvent | null;
  elapsedMs: number;
  completedCount: number;
  totalActions: number;
}

export function fmtMs(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function fmtTokens(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}
