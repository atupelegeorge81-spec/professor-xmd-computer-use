import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import type { RuntimeEvent } from "../../types";
import { StatusGlyph, fmtDur, Collapse } from "../ui/bits";

export interface ShellProps {
  ev: RuntimeEvent;
  icon: ReactNode;
  iconClass: string;
  verbRunning: string;
  verbDone: string;
  title: ReactNode;
  badge?: ReactNode;
  expandable?: boolean;
  /** keep body open after the event finishes */
  stayOpen?: boolean;
  children?: ReactNode;
  dimWhenDone?: boolean;
}

/**
 * Shared chrome for every agent action card:
 * status glyph · icon · verb · title ……… duration · chevron
 * running → shimmer verb + glowing border; done → duration + auto-collapse.
 */
export function ActionShell({
  ev,
  icon,
  iconClass,
  verbRunning,
  verbDone,
  title,
  badge,
  expandable = false,
  stayOpen = false,
  children,
  dimWhenDone = true,
}: ShellProps) {
  const running = ev.status === "running";
  const done = ev.status === "done";
  const [override, setOverride] = useState<boolean | null>(null);
  const bodyOpen = override !== null ? override : running || stayOpen;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className={`rounded-xl border bg-panel-2/80 backdrop-blur-sm transition-colors duration-500 ${
        running ? "running-glow border-accent/30" : "border-line"
      } ${done && dimWhenDone ? "opacity-90" : ""}`}
    >
      <button
        type="button"
        disabled={!expandable}
        onClick={() => expandable && setOverride(!bodyOpen)}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left"
      >
        <StatusGlyph status={ev.status} />
        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${iconClass}`}>{icon}</span>
        <span className="flex min-w-0 flex-1 items-baseline gap-2">
          <span
            className={`shrink-0 text-[12px] font-medium ${
              running ? "" : done ? "text-ink-2" : "text-ink-3"
            }`}
          >
            {running ? <span className="shimmer-text font-medium">{verbRunning}</span> : verbDone}
          </span>
          <span className="min-w-0 truncate font-mono text-[12px] text-ink/85">{title}</span>
        </span>
        {badge}
        {done && (
          <span className="shrink-0 font-mono text-[10.5px] text-ink-3">{fmtDur(ev.endAt - ev.startAt)}</span>
        )}
        {expandable && (
          <motion.span
            animate={{ rotate: bodyOpen ? 90 : 0 }}
            transition={{ duration: 0.18 }}
            className="shrink-0 text-ink-3"
          >
            <ChevronRight size={13} />
          </motion.span>
        )}
      </button>
      <Collapse open={bodyOpen}>
        <div className="border-t border-line/70 px-3 pb-3 pt-2.5">{children}</div>
      </Collapse>
    </motion.div>
  );
}
