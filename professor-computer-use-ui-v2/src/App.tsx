import { useEffect, useRef, useState } from "react";
import { useSimulation } from "./engine/useSimulation";
import { SCENARIOS, LANDING_SCENARIO, BUGFIX_SCENARIO } from "./data/scenario";
import type { Scenario, WorkspaceTab } from "./types";
import { TopBar, StatusBar } from "./components/Chrome";
import { ChatPanel, WelcomeScreen } from "./components/Chat";
import { Workspace, preferredTab } from "./components/workspace/Workspace";
import { DemoControls } from "./components/DemoControls";

export default function App() {
  const sim = useSimulation();
  const [tab, setTab] = useState<WorkspaceTab>("computer");
  const [autoFollow, setAutoFollow] = useState(true);
  const startedRef = useRef(false);

  /* ── URL params: ?scenario=&autostart=&speed=&state=after:<id>|mid:<id> ── */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const scenarioId = p.get("scenario") ?? "landing";
    const scenario = SCENARIOS[scenarioId] ?? LANDING_SCENARIO;
    const speed = Number(p.get("speed") ?? 0);
    const state = p.get("state");
    if (p.get("autostart") === "1" || state) {
      if (speed > 0) sim.setSpeed(speed);
      if (state) {
        const [mode, id] = state.split(":");
        sim.start(scenario);
        /* find the event window and jump straight into it */
        const ev = scenario.actions.find((a) => a.id === id);
        if (ev) {
          let t = 0;
          for (const a of scenario.actions) {
            t += a.gapMs ?? 200;
            const start = t;
            const end = t + Math.max(250, a.durationMs);
            t = end;
            if (a.id === id) {
              const mid = start + (end - start) * 0.55;
              const after = end + 30;
              sim.jumpTo(mode === "mid" ? mid : after);
              break;
            }
          }
        }
      } else {
        sim.start(scenario);
      }
      startedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── auto-follow: switch tab to where the action is ── */
  useEffect(() => {
    if (!sim.started || !autoFollow || !sim.world) return;
    const ae = sim.world.activeEvent;
    if (!ae) return;
    const pref = preferredTab(ae.action.data.kind);
    if (pref) setTab(pref);
  }, [sim.world?.activeEvent?.action.id, autoFollow, sim.started]);

  const handleStart = (s: Scenario) => {
    setTab("computer");
    setAutoFollow(true);
    sim.start(s);
  };

  const handleComposer = (text: string) => {
    if (!sim.started) return;
    if (sim.world?.finished) {
      /* new task after a finished run → run the matching demo */
      const t = text.toLowerCase();
      const next = /test|bug|fix|fail|checkout/.test(t) ? BUGFIX_SCENARIO : LANDING_SCENARIO;
      handleStart(next);
    }
  };

  return (
    <div className="flex h-full flex-col bg-base text-ink">
      <TopBar world={sim.started ? sim.world : null} sessionTitle={sim.started ? sim.scenario.sessionTitle : null} />

      <main className="min-h-0 flex-1">
        {!sim.started || !sim.world ? (
          <WelcomeScreen onPick={handleStart} scenarios={[LANDING_SCENARIO, BUGFIX_SCENARIO]} />
        ) : (
          <div className="grid h-full min-h-0 grid-cols-[minmax(360px,430px)_1fr]">
            <ChatPanel world={sim.world} onComposerSubmit={handleComposer} running={!sim.world.finished} />
            <div className="min-w-0 p-3">
              <Workspace world={sim.world} tab={tab} setTab={setTab} autoFollow={autoFollow} setAutoFollow={setAutoFollow} />
            </div>
          </div>
        )}
      </main>

      <StatusBar world={sim.started ? sim.world : null} />

      {sim.started && sim.world && (
        <DemoControls
          events={sim.world.events}
          playing={sim.playing}
          speed={sim.speed}
          onToggle={sim.toggle}
          onRestart={sim.restart}
          onStep={sim.stepForward}
          onSpeed={sim.setSpeed}
          onJump={sim.jumpTo}
        />
      )}
    </div>
  );
}
