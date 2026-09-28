import { motion } from "motion/react";
import { MonitorPlay, FolderCode, TerminalSquare, AppWindow, Crosshair } from "lucide-react";
import type { WorkspaceTab, WorldState } from "../../types";
import { ComputerPane } from "./ComputerPane";
import { FilesPane } from "./FilesPane";
import { TerminalPane } from "./TerminalPane";
import { PreviewPane } from "./PreviewPane";

const TABS: { id: WorkspaceTab; label: string; icon: typeof MonitorPlay }[] = [
  { id: "computer", label: "Computer", icon: MonitorPlay },
  { id: "files", label: "Files", icon: FolderCode },
  { id: "terminal", label: "Terminal", icon: TerminalSquare },
  { id: "preview", label: "Preview", icon: AppWindow },
];

/** Which tab best shows the agent's current action. */
export function preferredTab(kind: string): WorkspaceTab | null {
  if (kind.startsWith("browser_") || kind === "screenshot") return "computer";
  if (kind === "terminal") return "terminal";
  if (kind === "file_create" || kind === "file_edit" || kind === "file_read") return "files";
  if (kind === "finish") return "preview";
  return null;
}

export function Workspace({
  world,
  tab,
  setTab,
  autoFollow,
  setAutoFollow,
}: {
  world: WorldState;
  tab: WorkspaceTab;
  setTab: (t: WorkspaceTab) => void;
  autoFollow: boolean;
  setAutoFollow: (v: boolean) => void;
}) {
  return (
    <div className="flex h-full min-w-0 flex-col gap-2">
      {/* header: tabs + follow toggle */}
      <div className="flex items-center gap-1.5">
        <div className="flex gap-1 rounded-xl border border-line bg-panel/70 p-1">
          {TABS.map((t) => {
            const active = tab === t.id;
            const isBusy =
              (t.id === "computer" && (world.activeEvent?.action.data.kind.startsWith("browser_") || world.activeEvent?.action.data.kind === "screenshot")) ||
              (t.id === "terminal" && world.activeEvent?.action.data.kind === "terminal") ||
              (t.id === "files" && ["file_create", "file_edit", "file_read"].includes(world.activeEvent?.action.data.kind ?? ""));
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  active ? "text-ink" : "text-ink-3 hover:text-ink-2"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="ws-tab-pill"
                    className="absolute inset-0 rounded-lg bg-white/8 ring-1 ring-white/10"
                    transition={{ type: "spring", stiffness: 500, damping: 36 }}
                  />
                )}
                <t.icon size={13} className="relative" />
                <span className="relative">{t.label}</span>
                {isBusy && (
                  <span className="relative ml-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoFollow(!autoFollow)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
              autoFollow
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-line bg-panel/70 text-ink-3 hover:text-ink-2"
            }`}
            title="Automatically switch tabs to follow what the agent is doing"
          >
            <Crosshair size={11} />
            {autoFollow ? "Following agent" : "Free view"}
          </button>
        </div>
      </div>

      {/* pane */}
      <div className="min-h-0 flex-1">
        {tab === "computer" && <ComputerPane world={world} />}
        {tab === "files" && <FilesPane world={world} />}
        {tab === "terminal" && <TerminalPane world={world} />}
        {tab === "preview" && <PreviewPane world={world} />}
      </div>
    </div>
  );
}
