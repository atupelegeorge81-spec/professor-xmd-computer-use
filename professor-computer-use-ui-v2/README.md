# Professor XMD — Computer-Use Agent UI v2

A complete ground-up redesign of the Professor XMD computer-use agent interface.
**UI only — mock engine, zero backend required.** Every agent action has its own
real-time animation, following the patterns used by the top agent products
(Lovable, Devin, Manus, Bolt, v0, Operator).

![layout](screenshots/16-task-complete.png)

## Quick start

```bash
npm install
npm run dev        # → http://localhost:5173
```

Production build:

```bash
npm run build      # outputs to dist/
npm run preview
```

No environment variables, no API keys, no backend — the demo runs on a scripted
simulation engine that behaves exactly like a real agent run.

## What you get

| Area | Details |
|---|---|
| **Chat rail** | User messages, streamed assistant replies (markdown), collapsible Thinking cards with shimmer, plan/todo checklist, one animated card per action |
| **Agent's Computer** | Live browser the agent drives — URL typing, loading bar, virtual cursor that moves/clicks/types, eased scrolling, screenshot flash |
| **Files pane** | Live file tree with `NEW`/`M` badges, flash-highlight on write, streaming code viewer with syntax highlighting, diff view |
| **Terminal pane** | Two shells, streaming output, exit-code coloring, prompt with blinking caret |
| **Preview pane** | Live preview of the app being built — skeleton shimmer while the dev server starts, then the real page; desktop/mobile toggle |
| **Step ledger** | Status pill with step counter, ticking elapsed timer, token meter, 0 fake progress bars |
| **Auto-follow** | Workspace tabs switch automatically to wherever the action is ("Following agent" toggle) |
| **Demo controls** | Play / pause / restart / skip-step / 0.5–4× speed / jump-to-scene popover |

## Every action has an animation

`thinking` shimmer + streamed thoughts · `plan` animated check-offs ·
`search` query typing + results appearing one by one ·
`browser_navigate` address-bar typing + loading bar + page reveal ·
`browser_click` cursor spring-move + click ripple + target label ·
`browser_type` characters appearing in the page's input ·
`browser_scroll` eased page scroll ·
`screenshot` white flash + scaled thumbnail of the page ·
`terminal` command line + streaming output + exit badge + duration ·
`file_create` streaming code with live line counter ·
`file_edit` animated +/- diff · `file_read` streaming preview ·
`message` token-rate streaming with markdown · `finish` summary + stats + shine sweep.

## Demo scenarios

1. **Landing page** (default) — researches competitors on the web, visits their
   sites in the browser, scaffolds a Vite project, writes the files, runs the
   dev server and verifies the result in a real browser view.
2. **Bug fix** — runs failing tests, reads the buggy file, applies a diff,
   re-runs the tests to green.

Pick either from the welcome screen, or via URL params:

```
/?scenario=landing&autostart=1          # start immediately
/?scenario=bugfix&autostart=1&speed=4   # bug hunt, 4× speed
/?scenario=landing&state=mid:fc1        # jump straight into "writing Hero.tsx"
/?scenario=landing&state=after:f1       # jump to the finished state
```

`state=mid:<eventId>` freezes mid-action (great for screenshots and demos);
`state=after:<eventId>` shows the state right after that action finished.

Useful event ids: `t1` thinking · `p1` plan · `s1` web search · `bt1` browser
typing · `bc0`/`bc1` clicks · `ss1` screenshot · `m1` message · `tm1` scaffold ·
`fc1` writing Hero.tsx · `fc5` diff · `tm2` npm install · `tm3` dev server ·
`bn3` verify in browser · `f1` finish.

## Design system

Near-black surface ladder (`#0a0c11 → #1b2030`), hairline borders instead of
shadows, one violet→sky accent pair reserved for live/action surfaces, Inter +
system mono stack (no webfont requests — works fully offline), binary radius
scale (12px / pill). Inspired by Bolt's documented design language, Manus's
"Computer" panel and Devin's workspace tabs. English-only interface.

## Structure

```
src/
├── data/            scenario scripts + mock project files
├── engine/          useSimulation — timeline state machine + world derivation
├── components/
│   ├── cards/       one animated card per agent action
│   ├── workspace/   Computer / Files / Terminal / Preview panes
│   ├── mockweb/     fake websites the agent visits & builds
│   └── ui/          shimmer, streaming text, code viewer, glyphs
└── types.ts
```

To wire a real backend later: replace `useSimulation` with a hook that maps
your event stream (AG-UI SSE, OpenHands events, etc.) onto the same
`RuntimeEvent[]` shape — every component is presentational and data-driven.

## Research

`research/RESEARCH-NOTES.md` documents the UI patterns collected from Lovable,
v0, Bolt, Devin, Manus, Operator/ChatGPT Agent, Claude Code and OpenHands, with
reference screenshots in `research/screenshots/`. Demo screenshots taken during
live runs are in `screenshots/`.
