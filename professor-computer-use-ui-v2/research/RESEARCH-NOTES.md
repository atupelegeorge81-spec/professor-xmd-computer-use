# Agent UI Research Notes — professor-computer-use-ui-v2

Deep research conducted before building v2. Screenshots of real products are in
`screenshots/` (Lovable, Devin, Manus, v0, Bolt). Written pattern analysis sourced from:
setproduct.com (16 AI agent UI design patterns), AYDesign (Best AI agent UIs),
Devin docs & reviews, Manus reviews, Bolt.new design system breakdown, v0 guides,
OpenAI Operator / ChatGPT Agent articles, OpenHands ICLR paper, NN/g.

## The dominant layout (used by Manus, Devin, Bolt, v0, Lovable, Operator)

```
┌──────────────────────────────────────────────────────────────┐
│ Top bar: brand · session title · status pill · actions       │
├────────────┬─────────────────────────────────────────────────┤
│  CHAT RAIL │  WORKSPACE ("Agent's Computer")                 │
│  (narrow)  │  Tabs: Computer · Files · Terminal · Preview    │
│  messages  │  Live view of what the agent is doing right now │
│  + action  │  (browser w/ virtual cursor, file tree + diffs, │
│    cards   │   streaming shell output, live app preview)     │
│  composer  │  Step ledger with status glyphs                 │
├────────────┴─────────────────────────────────────────────────┤
│ Status bar: sandbox · model · tokens · elapsed time          │
└──────────────────────────────────────────────────────────────┘
```

## 16 patterns distilled (by phase)

### Understand
1. **Intent capture** — composer with suggestions, attachments, mode toggle.

### Plan
2. **Editable plan card** — agent proposes steps as a checklist, user can correct before execution (Devin plan approval).
3. **Todo list with live checkoffs** — Manus signature: tasks check off as they complete.

### Execute
4. **Live step ledger** — vertical list of steps; status glyph per step:
   pending = hollow circle · running = animated pulse · done = check · failed = cross.
   Running step pinned into view. "Avoid percent bars when total length is unknown;
   show elapsed time and completed steps instead."
5. **Tool call cards** — every action becomes a card: tool name, input, output
   (truncated + expandable), duration, status. Identical consecutive calls collapse
   with a count. Seen in: Claude Code, Cursor, ChatGPT Agent.
6. **Reasoning disclosure** — collapsed "Thinking" section per step, closed by default,
   one-line summary visible; shimmer while streaming. "If it changed the world →
   tool call card. If it changed the agent's mind → reasoning."
7. **Named tool states** — "Searching the web", "Reading invoice.pdf", "Running npm test" —
   a named state with a glyph beats generic dots the moment activity is known.
   Users forgive waits they can narrate.
8. **Elapsed-time honesty** — ticking timer + completed steps; never invented percentages.

### Checkpoint
9. **Takeover mode** — user takes over the browser; agent hard-paused (Operator, Muse, ChatGPT Agent).
10. **Permission prompt** — proportional to risk, impossible to miss.

### Result
11. **Diff-first summary** — end with changed-files list + diffs (Cursor, Claude Code,
    GitHub Copilot coding agent, Lovable, Bolt).
12. **Session replay / timelapse** — Devin timelapse with progress bar; Manus replay.
13. **Per-turn rollback / checkpoints** — Lovable.

## Product-specific findings

| Product | Signature move |
|---|---|
| **Lovable** | Chat + live app preview split; visible build steps in plain language; per-turn rollback |
| **v0** | Streams generated code while preview updates; Code/Preview tabs; Design Mode |
| **Bolt** | 4-panel workspace: chat, file tree, code editor, web preview; diff-aware changes; WebContainers terminal |
| **Devin** | Left chat + workspace right with Progress/Shell/Browser/Editor tabs; interactive Timelapse; multiple shells |
| **Manus** | "Manus's Computer" right panel: watch pages open, forms typed, tasks checked off; raw terminal also visible; full replay |
| **Operator/CU Agent** | Virtual cursor you watch click/type/scroll; takeover for logins; confirmation before significant actions |
| **ChatGPT Agent** | On-screen narration of every action; screenshots of the virtual browser inline |
| **Claude Code** | Every tool invocation = collapsible block with command + output |

## Visual language (from Bolt.new's documented design system)

- Near-black canvas `#111114` (not pure black), surface laddering: `#1e1e21` (panels), `#2c2c30` (headers)
- White-alpha hairline borders instead of shadows
- One electric accent (azure/cobalt) reserved for action/live surfaces
- Inter 14–16px body; mono stack (ui-monospace/Fira Code/Menlo) for editor & terminal
- Binary radius scale: 12px surfaces, full pill for chips/CTAs
- "Dark developer cockpit, not glossy consumer site"

## Animation vocabulary (honest-motion principles)

- Thinking indicator: shimmer text + pulsing glyph, shown only between request and first token
- Streaming text: appended at arrival rate (micro-batched), never fake typewriter replay of finished text
- Code blocks: append into styled block live; syntax highlight on completion
- Named tool states with the object named where safe
- Elapsed time for long tasks; step list where plan is knowable
- Tool card carries duration ("a 40s npm install reads as thinking unless the card says 40s")
- Skeleton shimmer for loading surfaces
- Live cursor overlay on the agent's browser view (watch it move, click, type)
- Checkoff animation on plan items; card enter springs; collapsible height animations

## What v2 must have (checklist)

- [x] Chat rail + Agent's Computer workspace split (resizable not required v1)
- [x] Workspace tabs: Computer / Files / Terminal / Preview + step ledger
- [x] Thinking card with shimmer + streamed thoughts + collapsible
- [x] Plan/todo card with animated checkoffs
- [x] Tool cards: terminal, file create/edit/read, web search, browser navigate/click/type/scroll, screenshot, finish — each with icon, status, duration, expand/collapse
- [x] File tree with NEW / EDITED badges, flash-highlight on change, code viewer with diff
- [x] Terminal pane with streaming output + exit codes
- [x] Computer pane: mock browser, URL bar typing, loading bar, virtual cursor that moves/clicks/types/scrolls
- [x] Preview pane: skeleton shimmer → live mock app, device toggle
- [x] Status pill: animated "Working" state, step count, ticking elapsed timer
- [x] Step ledger with pending/running/done glyphs
- [x] Finish card with diff summary stats
- [x] English only. No Swahili. No integration with backend — pure mock engine.
- [x] Demo controls: play/pause/restart/speed + jump-to-step (for testing & demos)
