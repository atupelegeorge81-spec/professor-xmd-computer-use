import { motion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { Check, X, Loader2 } from "lucide-react";

/* ── Shimmer text (thinking / live words) ─────────────────────── */
export function ShimmerText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`shimmer-text ${className}`}>{children}</span>;
}

/* ── Status glyph for the step ledger ─────────────────────────── */
export function StatusGlyph({
  status,
  error,
  size = 14,
}: {
  status: "pending" | "running" | "done";
  error?: boolean;
  size?: number;
}) {
  if (status === "done" && error) {
    return (
      <span className="grid place-items-center rounded-full bg-err/15 text-err" style={{ width: size, height: size }}>
        <X size={size - 5} strokeWidth={3} />
      </span>
    );
  }
  if (status === "done") {
    return (
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="grid place-items-center rounded-full bg-ok/15 text-ok"
        style={{ width: size, height: size }}
      >
        <Check size={size - 5} strokeWidth={3} />
      </motion.span>
    );
  }
  if (status === "running") {
    return (
      <span
        className="grid place-items-center rounded-full bg-accent/15 text-accent animate-pulse-ring"
        style={{ width: size, height: size }}
      >
        <Loader2 size={size - 5} className="animate-spin" />
      </span>
    );
  }
  return <span className="rounded-full border-2 border-line-2" style={{ width: size - 4, height: size - 4 }} />;
}

/* ── Typing dots ──────────────────────────────────────────────── */
export function Dots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full bg-accent animate-bounce-dot"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

/* ── Pill / chip ──────────────────────────────────────────────── */
export function Pill({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "ok" | "err" | "warn";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "bg-white/5 text-ink-2 border-line",
    accent: "bg-accent/10 text-accent border-accent/25",
    ok: "bg-ok/10 text-ok border-ok/25",
    err: "bg-err/10 text-err border-err/25",
    warn: "bg-warn/10 text-warn border-warn/25",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ── Collapsible height animation ─────────────────────────────── */
export function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Streaming text: reveal at progress rate ──────────────────── */
export function StreamingText({
  text,
  progress,
  className = "",
  showCaret,
}: {
  text: string;
  progress: number;
  className?: string;
  showCaret?: boolean;
}) {
  const visible = Math.floor(text.length * Math.min(1, Math.max(0, progress)));
  const shown = text.slice(0, visible);
  const done = visible >= text.length;
  return (
    <span className={className}>
      {shown}
      {showCaret && !done && <span className="animate-caret text-accent">▍</span>}
    </span>
  );
}

/* ── Minimal syntax highlighter ───────────────────────────────── */

type Tok = { t: "com" | "str" | "tag" | "num" | "kw" | "fn" | "punc" | "txt"; v: string };

const MASTER =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.-]*|\/>|>)|(\b\d[\d._]*\b)|(\b(?:import|from|export|default|function|return|const|let|var|if|else|for|while|new|class|extends|type|interface|as|async|await|null|true|false|undefined|document)\b)|([A-Za-z_$][\w$]*(?=\())/g;

function tokenize(line: string): Tok[] {
  const out: Tok[] = [];
  let last = 0;
  MASTER.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MASTER.exec(line))) {
    if (m.index > last) out.push({ t: "txt", v: line.slice(last, m.index) });
    const [, com, str, tag, num, kw, fn] = m;
    if (com) out.push({ t: "com", v: com });
    else if (str) out.push({ t: "str", v: str });
    else if (tag) out.push({ t: "tag", v: tag });
    else if (num) out.push({ t: "num", v: num });
    else if (kw) out.push({ t: "kw", v: kw });
    else if (fn) out.push({ t: "fn", v: fn });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ t: "txt", v: line.slice(last) });
  return out;
}

const TOK_CLASS: Record<Tok["t"], string> = {
  com: "tok-com",
  str: "tok-str",
  tag: "tok-tag",
  num: "tok-num",
  kw: "tok-kw",
  fn: "tok-fn",
  punc: "tok-punc",
  txt: "",
};

export function HighlightedLine({ line }: { line: string }) {
  const toks = tokenize(line);
  if (!line) return <span>&nbsp;</span>;
  return (
    <>
      {toks.map((t, i) => (
        <span key={i} className={TOK_CLASS[t.t]}>
          {t.v}
        </span>
      ))}
    </>
  );
}

/* ── Code block with line numbers + streaming reveal ──────────── */
export function CodeBlock({
  code,
  visibleChars = Infinity,
  startLine = 1,
  className = "",
  minLines = 0,
}: {
  code: string;
  visibleChars?: number;
  startLine?: number;
  className?: string;
  minLines?: number;
}) {
  const lines = code.split("\n");
  let budget = visibleChars;
  const rendered: { line: string; partial: boolean; n: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (budget <= 0) break;
    const l = lines[i];
    if (l.length + 1 <= budget) {
      rendered.push({ line: l, partial: false, n: startLine + i });
      budget -= l.length + 1;
    } else {
      rendered.push({ line: l.slice(0, budget), partial: true, n: startLine + i });
      budget = 0;
    }
  }
  while (rendered.length < minLines) rendered.push({ line: "", partial: false, n: startLine + rendered.length });

  return (
    <div className={`overflow-auto rounded-lg border border-line bg-base/60 font-mono text-[12px] leading-5 ${className}`}>
      <table className="w-full border-collapse">
        <tbody>
          {rendered.map((r, i) => (
            <motion.tr
              key={r.n}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.008, 0.4) }}
            >
              <td className="w-10 select-none border-r border-line px-2 text-right align-top text-ink-3/60">{r.n}</td>
              <td className="whitespace-pre px-3 align-top text-ink/90">
                <HighlightedLine line={r.line} />
                {r.partial && <span className="animate-caret text-accent">▍</span>}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Duration formatting ──────────────────────────────────────── */
export function fmtDur(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}
