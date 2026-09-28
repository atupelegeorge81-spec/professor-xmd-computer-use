import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileCode2,
  FileJson,
  FileText,
  FileType2,
  FolderOpen,
  Folder,
  ChevronRight,
  FileDiff,
} from "lucide-react";
import type { FileNode, RuntimeEvent, WorldState } from "../../types";
import { CodeBlock } from "../ui/bits";

/* ════════════════════════════════════════════════════════════════
   Files — live file tree (NEW / MODIFIED badges, flash on write)
   + code viewer with streaming content and diff view.
   ════════════════════════════════════════════════════════════════ */

function iconFor(name: string) {
  if (name.endsWith(".json")) return <FileJson size={13} className="text-amber-300" />;
  if (name.endsWith(".css")) return <FileType2 size={13} className="text-sky-300" />;
  if (name.endsWith(".html")) return <FileCode2 size={13} className="text-orange-300" />;
  if (name.endsWith(".tsx") || name.endsWith(".ts")) return <FileCode2 size={13} className="text-sky-300" />;
  return <FileText size={13} className="text-ink-3" />;
}

interface Dir {
  name: string;
  dirs: Dir[];
  files: FileNode[];
}

function buildTree(files: FileNode[]): Dir {
  const root: Dir = { name: "", dirs: [], files: [] };
  for (const f of files) {
    const parts = f.path.split("/");
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      let next = node.dirs.find((d) => d.name === parts[i]);
      if (!next) {
        next = { name: parts[i], dirs: [], files: [] };
        node.dirs.push(next);
      }
      node = next;
    }
    node.files.push(f);
  }
  const sortDir = (d: Dir) => {
    d.dirs.sort((a, b) => a.name.localeCompare(b.name));
    d.files.sort((a, b) => a.name.localeCompare(b.name));
    d.dirs.forEach(sortDir);
  };
  sortDir(root);
  return root;
}

function TreeDirView({
  dir,
  depth,
  selected,
  onSelect,
  flashPath,
}: {
  dir: Dir;
  depth: number;
  selected: string | null;
  onSelect: (p: string) => void;
  flashPath: string | null;
}) {
  return (
    <div>
      {dir.dirs.map((d) => (
        <DirRow key={d.name} dir={d} depth={depth} selected={selected} onSelect={onSelect} flashPath={flashPath} />
      ))}
      {dir.files.map((f) => (
        <motion.button
          key={f.path}
          type="button"
          onClick={() => onSelect(f.path)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 34 }}
          className={`group flex w-full items-center gap-1.5 rounded-md px-2 py-[5px] text-left text-[12px] transition-colors ${
            selected === f.path ? "bg-accent/15 text-ink" : "text-ink-2 hover:bg-white/5"
          }`}
          style={{ paddingLeft: depth * 12 + 8 }}
        >
          {iconFor(f.name)}
          <span className="truncate">{f.name}</span>
          {f.status === "new" && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto rounded-full bg-ok/15 px-1.5 py-px text-[9px] font-bold text-ok"
            >
              NEW
            </motion.span>
          )}
          {f.status === "edited" && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto rounded-full bg-amber-400/15 px-1.5 py-px text-[9px] font-bold text-amber-300"
            >
              M
            </motion.span>
          )}
          {flashPath === f.path && (
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-md"
              initial={{ backgroundColor: "rgba(52, 211, 153, 0.22)" }}
              animate={{ backgroundColor: "rgba(52, 211, 153, 0)" }}
              transition={{ duration: 1.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}

function DirRow({
  dir,
  depth,
  selected,
  onSelect,
  flashPath,
}: {
  dir: Dir;
  depth: number;
  selected: string | null;
  onSelect: (p: string) => void;
  flashPath: string | null;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-[5px] text-left text-[12px] font-medium text-ink-2 hover:bg-white/5"
        style={{ paddingLeft: depth * 12 + 8 }}
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight size={12} className="text-ink-3" />
        </motion.span>
        {open ? <FolderOpen size={13} className="text-accent-2/80" /> : <Folder size={13} className="text-accent-2/80" />}
        <span className="truncate">{dir.name}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative">
              <span className="absolute bottom-1 top-1 w-px bg-line" style={{ left: depth * 12 + 13 }} />
              <TreeDirView dir={dir} depth={depth + 1} selected={selected} onSelect={onSelect} flashPath={flashPath} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilesPane({ world }: { world: WorldState }) {
  const files = world.files;
  const tree = useMemo(() => buildTree(files), [files]);
  const [manual, setManual] = useState<string | null>(null);
  const [view, setView] = useState<"code" | "diff">("code");

  /* auto-follow the file the agent is touching */
  let autoPath: string | null = null;
  for (const e of world.events) {
    if (e.status === "pending") continue;
    const k = e.action.data.kind;
    if (k === "file_create" || k === "file_edit" || k === "file_read") {
      autoPath = (e.action.data as { path: string }).path;
    }
  }
  const selectedPath = manual ?? autoPath;
  const file = files.find((f) => f.path === selectedPath) ?? null;

  /* flash the file currently being written */
  let flashPath: string | null = null;
  const ae = world.activeEvent;
  if (ae && ae.status === "running" && ["file_create", "file_edit"].includes(ae.action.data.kind)) {
    flashPath = (ae.action.data as { path: string }).path;
  }
  if (flashPath && manual === null) {
    /* also auto-switch viewer to it */
  }

  const fileCount = files.length;
  const editedCount = files.filter((f) => f.status !== "scaffold" && f.status !== "read").length;

  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-line bg-elevated/40">
      {/* ── Tree ───────────────────────────────────────────────── */}
      <div className="flex w-60 shrink-0 flex-col border-r border-line bg-panel/60">
        <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">Workspace</span>
          <span className="font-mono text-[10px] text-ink-3">
            {fileCount} files · {editedCount} changed
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-1.5">
          {fileCount === 0 ? (
            <div className="grid h-full place-items-center px-4 text-center">
              <div>
                <div className="skeleton mx-auto mb-3 h-12 w-full rounded-lg" />
                <div className="skeleton mb-2 h-3 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <p className="mt-3 text-[11px] text-ink-3">Waiting for the agent to write files…</p>
              </div>
            </div>
          ) : (
            <TreeDirView dir={tree} depth={0} selected={selectedPath} onSelect={(p) => setManual(p)} flashPath={flashPath} />
          )}
        </div>
      </div>

      {/* ── Viewer ─────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {file ? (
          <>
            <div className="flex items-center gap-2 border-b border-line px-3 py-2">
              {iconFor(file.name)}
              <span className="truncate font-mono text-[11.5px] text-ink-2">{file.path}</span>
              {file.lastDiff && (
                <div className="ml-auto flex overflow-hidden rounded-lg border border-line text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => setView("code")}
                    className={`px-2.5 py-1 ${view === "code" ? "bg-accent/15 text-accent" : "text-ink-3 hover:bg-white/5"}`}
                  >
                    Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("diff")}
                    className={`flex items-center gap-1 px-2.5 py-1 ${view === "diff" ? "bg-accent/15 text-accent" : "text-ink-3 hover:bg-white/5"}`}
                  >
                    <FileDiff size={11} /> Diff
                  </button>
                </div>
              )}
              {file.status === "new" && (
                <span className="ml-auto rounded-full bg-ok/15 px-2 py-0.5 text-[9.5px] font-bold text-ok">NEW</span>
              )}
              {file.status === "edited" && !file.lastDiff && null}
              {file.status === "edited" && view === "code" && (
                <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-0.5 text-[9.5px] font-bold text-amber-300">
                  MODIFIED
                </span>
              )}
            </div>
            <div className="flex-1 overflow-auto p-3">
              {view === "diff" && file.lastDiff ? (
                <div className="overflow-hidden rounded-lg border border-line bg-base/70 font-mono text-[12px]">
                  {file.lastDiff.map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: l.type === "add" ? 14 : -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.05, 1), type: "spring", stiffness: 480, damping: 34 }}
                      className={`flex gap-2 px-2.5 py-px leading-5 ${
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
              ) : (
                <CodeBlock code={file.content} visibleChars={file.visibleChars} className="max-h-full" />
              )}
            </div>
          </>
        ) : (
          <div className="grid h-full place-items-center text-[12px] text-ink-3">
            Select a file to view it
          </div>
        )}
      </div>
    </div>
  );
}
