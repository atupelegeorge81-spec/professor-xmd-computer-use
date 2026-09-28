import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Monitor, Smartphone, RotateCw, Radio } from "lucide-react";
import type { WorldState } from "../../types";
import { Site } from "../mockweb/sites";

/* ════════════════════════════════════════════════════════════════
   Preview — live preview of the app the agent is building.
   Skeleton shimmer until the dev server is up, then the real page.
   ════════════════════════════════════════════════════════════════ */

export function PreviewPane({ world }: { world: WorldState }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const ready = world.previewReady;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-elevated/40">
      {/* toolbar */}
      <div className="flex items-center gap-3 border-b border-line bg-header/60 px-3 py-2">
        <span className="flex items-center gap-1.5 rounded-full border border-ok/25 bg-ok/10 px-2.5 py-1 text-[10.5px] font-medium text-ok">
          <Radio size={10} className={ready ? "animate-pulse" : ""} />
          {ready ? "Live" : "Building"}
        </span>
        <div className="flex h-6.5 flex-1 items-center rounded-md border border-line bg-base/60 px-2.5 font-mono text-[11px] text-ink-3" style={{ height: 26 }}>
          {ready ? "http://localhost:5173" : "waiting for dev server…"}
        </div>
        <div className="flex overflow-hidden rounded-lg border border-line">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`px-2 py-1 ${device === "desktop" ? "bg-accent/15 text-accent" : "text-ink-3 hover:bg-white/5"}`}
            title="Desktop"
          >
            <Monitor size={13} />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`px-2 py-1 ${device === "mobile" ? "bg-accent/15 text-accent" : "text-ink-3 hover:bg-white/5"}`}
            title="Mobile"
          >
            <Smartphone size={13} />
          </button>
        </div>
        <RotateCw size={12} className={`text-ink-3 ${!ready ? "animate-spin" : ""}`} />
      </div>

      {/* viewport */}
      <div className="flex-1 overflow-auto bg-[#0d1017] p-4">
        <AnimatePresence mode="wait">
          {!ready ? (
            <motion.div
              key="skeleton"
              exit={{ opacity: 0 }}
              className="mx-auto flex h-full max-w-3xl flex-col gap-4"
            >
              <div className="skeleton h-44 rounded-2xl" />
              <p className="animate-pulse text-center text-[12px] text-ink-3">
                Dev server starting — preview will appear here
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="skeleton h-24 rounded-xl" />
                <div className="skeleton h-24 rounded-xl" />
                <div className="skeleton h-24 rounded-xl" />
              </div>
              <div className="skeleton h-16 rounded-xl" />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 26 }}
              className={`mx-auto h-full overflow-hidden rounded-xl border border-line bg-white shadow-2xl ${
                device === "mobile" ? "w-[390px]" : "w-full"
              }`}
            >
              <Site siteId="aquapulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
