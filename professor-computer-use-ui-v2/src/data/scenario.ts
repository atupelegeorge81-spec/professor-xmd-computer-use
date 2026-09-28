import type { Scenario } from "../types";
import { CREATED_FILES, SCAFFOLD_FILES } from "./files";

/* ════════════════════════════════════════════════════════════════
   SCENARIO 1 — "Landing page" (the flagship demo run)
   Research competitors on the web → scaffold → build → verify.
   ════════════════════════════════════════════════════════════════ */

export const LANDING_SCENARIO: Scenario = {
  id: "landing",
  trigger:
    "Research the top smart water bottle competitors and build a marketing landing page for my product Aqua Pulse.",
  sessionTitle: "Aqua Pulse — competitor research & landing page",
  actions: [
    {
      id: "u1",
      durationMs: 350,
      tokens: 0,
      data: {
        kind: "user_message",
        text: "Research the top smart water bottle competitors and build a marketing landing page for my product Aqua Pulse.",
      },
    },
    {
      id: "t1",
      durationMs: 4200,
      gapMs: 500,
      tokens: 620,
      data: {
        kind: "thinking",
        thoughts: [
          "The user wants two things: competitor research on smart water bottles, then a landing page for their product Aqua Pulse.",
          "Plan: search the market, study the top two competitors' positioning and pricing, then scaffold a React project and build a bold, modern landing page.",
          "I'll verify the result in a real browser before finishing.",
        ],
      },
    },
    {
      id: "p1",
      durationMs: 3200,
      gapMs: 300,
      tokens: 340,
      data: {
        kind: "plan",
        items: [
          { id: "pi1", text: "Research the smart water bottle market", doneAfter: "s1" },
          { id: "pi2", text: "Study competitor positioning & pricing", doneAfter: "ss2" },
          { id: "pi3", text: "Scaffold a Vite + React project", doneAfter: "tm1" },
          { id: "pi4", text: "Build the landing page sections", doneAfter: "fc5" },
          { id: "pi5", text: "Run dev server & verify in browser", doneAfter: "ss3" },
          { id: "pi6", text: "Final QA & summary", doneAfter: "f1" },
        ],
      },
    },
    {
      id: "t2",
      durationMs: 2400,
      gapMs: 400,
      tokens: 280,
      data: {
        kind: "thinking",
        thoughts: [
          "Starting with broad market research to identify the main players.",
          "I'll use the web search tool first, then open the competitors' sites in the browser.",
        ],
      },
    },
    {
      id: "s1",
      durationMs: 5200,
      gapMs: 300,
      tokens: 900,
      data: {
        kind: "search",
        query: "best smart water bottles 2026 competitors",
        results: [
          {
            title: "HydraCoach — The original smart water bottle",
            url: "https://hydracoach.com",
            snippet:
              "Tracks every sip in real time and coaches you to hit your daily hydration goal. From $79.",
          },
          {
            title: "AquaReset — Hydration reminders that actually work",
            url: "https://aquareset.com",
            snippet:
              "Glow reminders, app sync and family plans. Rated 4.6★ on the stores. From $59.",
          },
          {
            title: "Smart bottle market report 2026 — GlobeConsumer",
            url: "https://globeconsumer.io/reports/smart-bottles-2026",
            snippet:
              "The smart bottle category is projected to reach $2.1B by 2029, growing 18% YoY.",
          },
          {
            title: "SipSense review: quartz sensor accuracy",
            url: "https://sipwear.tech/sipsense-review",
            snippet:
              "SipSense's quartz flow sensor is the most accurate we've tested, but the app feels dated.",
          },
        ],
      },
    },
    {
      id: "t3",
      durationMs: 2600,
      gapMs: 400,
      tokens: 310,
      data: {
        kind: "thinking",
        thoughts: [
          "Four relevant sources. HydraCoach and AquaReset are the two strongest direct competitors.",
          "Positioning gap: everyone sells tracking or reminders — nobody sells *coaching*. Aqua Pulse can own \"AI hydration coaching\".",
          "Let me open both sites in the browser to study their messaging and pricing.",
        ],
      },
    },
    {
      id: "bn0",
      durationMs: 3400,
      gapMs: 250,
      tokens: 200,
      data: {
        kind: "browser_navigate",
        url: "https://novasearch.com",
        siteId: "search",
        typingLabel: "novasearch.com",
      },
    },
    {
      id: "bt1",
      durationMs: 4200,
      gapMs: 300,
      tokens: 160,
      data: {
        kind: "browser_type",
        targetLabel: "Search input",
        x: 50,
        y: 47,
        text: "hydracoach smart water bottle pricing",
        siteId: "search",
      },
    },
    {
      id: "bn0b",
      durationMs: 3200,
      gapMs: 300,
      tokens: 180,
      data: {
        kind: "browser_navigate",
        url: "https://novasearch.com/search?q=hydracoach+smart+water+bottle+pricing",
        siteId: "search-results",
        typingLabel: null,
      },
    },
    {
      id: "bc0",
      durationMs: 2200,
      gapMs: 250,
      tokens: 140,
      data: {
        kind: "browser_click",
        targetLabel: "HydraCoach — official site",
        x: 36,
        y: 33,
        siteId: "search-results",
      },
    },
    {
      id: "bn1",
      durationMs: 4200,
      gapMs: 250,
      tokens: 240,
      data: {
        kind: "browser_navigate",
        url: "https://hydracoach.com",
        siteId: "hydracoach",
        typingLabel: "hydracoach.com",
      },
    },
    {
      id: "bc1",
      durationMs: 2300,
      gapMs: 350,
      tokens: 150,
      data: {
        kind: "browser_click",
        targetLabel: "Pricing nav link",
        x: 62,
        y: 9,
        siteId: "hydracoach",
      },
    },
    {
      id: "bs1",
      durationMs: 2600,
      gapMs: 200,
      tokens: 130,
      data: {
        kind: "browser_scroll",
        direction: "down",
        amountPx: 340,
        siteId: "hydracoach",
      },
    },
    {
      id: "ss1",
      durationMs: 2400,
      gapMs: 250,
      tokens: 220,
      data: {
        kind: "screenshot",
        caption: "HydraCoach pricing — $79 core, $119 pro",
        siteId: "hydracoach",
        scrollY: 340,
      },
    },
    {
      id: "bn2",
      durationMs: 4000,
      gapMs: 300,
      tokens: 230,
      data: {
        kind: "browser_navigate",
        url: "https://aquareset.com",
        siteId: "aquareset",
        typingLabel: "aquareset.com",
      },
    },
    {
      id: "bs2",
      durationMs: 2500,
      gapMs: 200,
      tokens: 120,
      data: {
        kind: "browser_scroll",
        direction: "down",
        amountPx: 300,
        siteId: "aquareset",
      },
    },
    {
      id: "ss2",
      durationMs: 2300,
      gapMs: 250,
      tokens: 210,
      data: {
        kind: "screenshot",
        caption: "AquaReset features — reminders + family plans",
        siteId: "aquareset",
        scrollY: 300,
      },
    },
    {
      id: "t4",
      durationMs: 3400,
      gapMs: 400,
      tokens: 420,
      data: {
        kind: "thinking",
        thoughts: [
          "HydraCoach leads with tracking ($79), AquaReset with reminders ($59 + family plans).",
          "Aqua Pulse should lead with personalized AI coaching — a premium angle that justifies a $49–99 tier.",
          "Design direction: clean aqua palette, bold hero, three feature cards, simple pricing, trustworthy footer.",
        ],
      },
    },
    {
      id: "m1",
      durationMs: 5600,
      gapMs: 300,
      tokens: 480,
      data: {
        kind: "message",
        text: "Research done. Two competitors dominate: **HydraCoach** ($79, real-time tracking) and **AquaReset** ($59, reminders + family plans). The open lane is **AI coaching** — nobody owns it.\n\nI'll position Aqua Pulse as *hydration that thinks*, and build a Vite + React landing page with a hero, features, pricing and footer. Kicking off the scaffold now.",
      },
    },
    {
      id: "tm1",
      durationMs: 5200,
      gapMs: 500,
      tokens: 260,
      data: {
        kind: "terminal",
        shell: 1,
        command: "npm create vite@latest aqua-pulse -- --template react-ts",
        outputLines: [
          "› Creating a new Vite app in /workspace/aqua-pulse",
          "",
          "Scaffolding project in /workspace/aqua-pulse...",
          "Done. Now run:",
          "  cd aqua-pulse",
          "  npm install",
          "  npm run dev",
        ],
        exitCode: 0,
        cwd: "~/workspace",
      },
    },
    {
      id: "fc0",
      durationMs: 4200,
      gapMs: 300,
      tokens: 300,
      data: {
        kind: "file_create",
        path: "aqua-pulse/src/index.css",
        language: "css",
        content: CREATED_FILES["aqua-pulse/src/index.css"].content,
      },
    },
    {
      id: "fc1",
      durationMs: 5200,
      gapMs: 200,
      tokens: 520,
      data: {
        kind: "file_create",
        path: "aqua-pulse/src/components/Hero.tsx",
        language: "tsx",
        content: CREATED_FILES["aqua-pulse/src/components/Hero.tsx"].content,
      },
    },
    {
      id: "fc2",
      durationMs: 5000,
      gapMs: 200,
      tokens: 500,
      data: {
        kind: "file_create",
        path: "aqua-pulse/src/components/Features.tsx",
        language: "tsx",
        content: CREATED_FILES["aqua-pulse/src/components/Features.tsx"].content,
      },
    },
    {
      id: "fc3",
      durationMs: 4600,
      gapMs: 200,
      tokens: 470,
      data: {
        kind: "file_create",
        path: "aqua-pulse/src/components/Pricing.tsx",
        language: "tsx",
        content: CREATED_FILES["aqua-pulse/src/components/Pricing.tsx"].content,
      },
    },
    {
      id: "fc4",
      durationMs: 3200,
      gapMs: 200,
      tokens: 300,
      data: {
        kind: "file_create",
        path: "aqua-pulse/src/components/Footer.tsx",
        language: "tsx",
        content: CREATED_FILES["aqua-pulse/src/components/Footer.tsx"].content,
      },
    },
    {
      id: "fc5",
      durationMs: 3600,
      gapMs: 200,
      tokens: 260,
      data: {
        kind: "file_edit",
        path: "aqua-pulse/src/App.tsx",
        language: "tsx",
        diff: [
          { type: "add", text: 'import Hero from "./components/Hero";' },
          { type: "add", text: 'import Features from "./components/Features";' },
          { type: "add", text: 'import Pricing from "./components/Pricing";' },
          { type: "add", text: 'import Footer from "./components/Footer";' },
          { type: "add", text: "" },
          { type: "ctx", text: "export default function App() {" },
          { type: "ctx", text: "  return (" },
          { type: "del", text: "    <main>" },
          { type: "add", text: '    <main className="min-h-screen">' },
          { type: "add", text: "      <Hero />" },
          { type: "add", text: "      <Features />" },
          { type: "add", text: "      <Pricing />" },
          { type: "add", text: "      <Footer />" },
          { type: "del", text: "      {/* sections composed on build */}" },
          { type: "ctx", text: "    </main>" },
          { type: "ctx", text: "  );" },
          { type: "ctx", text: "}" },
        ],
      },
    },
    {
      id: "tm2",
      durationMs: 6000,
      gapMs: 350,
      tokens: 180,
      data: {
        kind: "terminal",
        shell: 1,
        command: "npm install && npm i motion",
        outputLines: [
          "⠙ Installing dependencies...",
          "added 214 packages, and audited 215 packages in 6s",
          "46 packages are looking for funding",
          "found 0 vulnerabilities",
          "",
          "added 1 package, and audited 216 packages in 2s",
          "found 0 vulnerabilities",
        ],
        exitCode: 0,
        cwd: "~/workspace/aqua-pulse",
      },
    },
    {
      id: "tm3",
      durationMs: 5200,
      gapMs: 300,
      tokens: 140,
      data: {
        kind: "terminal",
        shell: 2,
        command: "npm run dev",
        outputLines: [
          "",
          "  VITE v7.3.2  ready in 412 ms",
          "",
          "  ➜  Local:   http://localhost:5173/",
          "  ➜  Network: http://192.168.1.24:5173/",
          "",
          "  Watching for file changes...",
        ],
        exitCode: 0,
        cwd: "~/workspace/aqua-pulse",
      },
    },
    {
      id: "bn3",
      durationMs: 4200,
      gapMs: 400,
      tokens: 200,
      data: {
        kind: "browser_navigate",
        url: "http://localhost:5173/",
        siteId: "aquapulse",
        typingLabel: "localhost:5173",
      },
    },
    {
      id: "ss3",
      durationMs: 2500,
      gapMs: 250,
      tokens: 190,
      data: {
        kind: "screenshot",
        caption: "Landing page hero renders correctly",
        siteId: "aquapulse",
        scrollY: 0,
      },
    },
    {
      id: "bs3",
      durationMs: 2400,
      gapMs: 250,
      tokens: 110,
      data: {
        kind: "browser_scroll",
        direction: "down",
        amountPx: 620,
        siteId: "aquapulse",
      },
    },
    {
      id: "bc2",
      durationMs: 2300,
      gapMs: 250,
      tokens: 130,
      data: {
        kind: "browser_click",
        targetLabel: "Start free trial button",
        x: 50,
        y: 44,
        siteId: "aquapulse",
      },
    },
    {
      id: "t5",
      durationMs: 2600,
      gapMs: 400,
      tokens: 300,
      data: {
        kind: "thinking",
        thoughts: [
          "Hero, features and pricing all render. The CTA is reachable and the anchor jumps to pricing.",
          "One last QA pass on mobile width would be ideal, but the page is responsive by construction.",
          "Wrapping up with a summary for the user.",
        ],
      },
    },
    {
      id: "f1",
      durationMs: 4200,
      gapMs: 300,
      tokens: 360,
      data: {
        kind: "finish",
        summary:
          "Aqua Pulse landing page is built and verified. It positions the product as *hydration that thinks* — the AI coaching angle none of the competitors own.",
        highlights: [
          "6 files written — hero, features, pricing, footer, styles, app shell",
          "4 shell commands run — scaffold, install, dev server, 0 errors",
          "2 competitor sites researched in the browser with screenshots",
          "Dev server verified at localhost:5173 — CTA and anchors working",
        ],
      },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════
   SCENARIO 2 — "Bug fix" (short run: failing tests → fix → green)
   ════════════════════════════════════════════════════════════════ */

export const BUGFIX_SCENARIO: Scenario = {
  id: "bugfix",
  trigger: "The checkout tests are failing on CI. Find the bug and fix it.",
  sessionTitle: "Checkout — failing tests investigation",
  actions: [
    {
      id: "u1",
      durationMs: 350,
      tokens: 0,
      data: { kind: "user_message", text: "The checkout tests are failing on CI. Find the bug and fix it." },
    },
    {
      id: "t1",
      durationMs: 3000,
      gapMs: 450,
      tokens: 340,
      data: {
        kind: "thinking",
        thoughts: [
          "Failing checkout tests usually mean a regression in pricing, discounts or totals.",
          "Run the suite first — read the failure before touching anything.",
        ],
      },
    },
    {
      id: "tm1",
      durationMs: 5200,
      gapMs: 300,
      tokens: 220,
      data: {
        kind: "terminal",
        shell: 1,
        command: "npm test -- checkout",
        outputLines: [
          "> vitest run checkout",
          "",
          "FAIL  src/checkout.test.ts > applyDiscount > applies WELCOME10",
          "  ✗ expected 90 to be 110  // −20",
          "",
          "FAIL  src/checkout.test.ts > applyDiscount > applies SUMMER20",
          "  ✗ expected 80 to be 120  // −40",
          "",
          "Tests  2 failed | 10 passed (12)",
        ],
        exitCode: 1,
        cwd: "~/shop",
      },
    },
    {
      id: "t2",
      durationMs: 2800,
      gapMs: 400,
      tokens: 380,
      data: {
        kind: "thinking",
        thoughts: [
          "Totals are *higher* than the subtotal — the discount is being added instead of subtracted.",
          "That smells like a one-character bug in applyDiscount. Reading the file.",
        ],
      },
    },
    {
      id: "fr1",
      durationMs: 3400,
      gapMs: 300,
      tokens: 160,
      data: {
        kind: "file_read",
        path: "src/lib/checkout.ts",
        linesShown: 14,
        preview: [
          "export function applyDiscount(subtotal: number, code: string) {",
          "  const codes: Record<string, number> = {",
          "    WELCOME10: 0.1,",
          "    SUMMER20: 0.2,",
          "  };",
          "",
          "  const rate = codes[code];",
          "  if (!rate) return { subtotal, discount: 0, total: subtotal };",
          "",
          "  const discount = subtotal * rate;",
          "  const total = subtotal + discount; // bug: adds the discount",
          "",
          "  return { subtotal, discount, total };",
          "}",
        ],
      },
    },
    {
      id: "fe1",
      durationMs: 4200,
      gapMs: 350,
      tokens: 300,
      data: {
        kind: "file_edit",
        path: "src/lib/checkout.ts",
        language: "ts",
        diff: [
          { type: "ctx", text: "  const rate = codes[code];" },
          { type: "ctx", text: "  if (!rate) return { subtotal, discount: 0, total: subtotal };" },
          { type: "ctx", text: "" },
          { type: "del", text: "  const discount = subtotal * rate;" },
          { type: "del", text: "  const total = subtotal + discount; // bug: adds the discount" },
          { type: "add", text: "  const discount = Math.round(subtotal * rate * 100) / 100;" },
          { type: "add", text: "  const total = subtotal - discount; // apply the discount" },
          { type: "ctx", text: "" },
          { type: "ctx", text: "  return { subtotal, discount, total };" },
        ],
      },
    },
    {
      id: "tm2",
      durationMs: 5000,
      gapMs: 350,
      tokens: 190,
      data: {
        kind: "terminal",
        shell: 1,
        command: "npm test -- checkout",
        outputLines: [
          "> vitest run checkout",
          "",
          "PASS  src/checkout.test.ts > applyDiscount > applies WELCOME10",
          "PASS  src/checkout.test.ts > applyDiscount > applies SUMMER20",
          "",
          "Tests  12 passed (12)",
          "Duration  1.84s",
        ],
        exitCode: 0,
        cwd: "~/shop",
      },
    },
    {
      id: "f1",
      durationMs: 3600,
      gapMs: 300,
      tokens: 240,
      data: {
        kind: "finish",
        summary:
          "Found it — `applyDiscount` was *adding* the discount to the subtotal instead of subtracting it. One sign, two lines, all 12 tests green again.",
        highlights: [
          "Ran the failing suite — 2 failures isolated to applyDiscount",
          "Read src/lib/checkout.ts and spotted the inverted sign",
          "Fixed the total formula and rounded the discount to cents",
          "Re-ran tests — 12/12 passing",
        ],
      },
    },
  ],
};

export const SCENARIOS: Record<string, Scenario> = {
  landing: LANDING_SCENARIO,
  bugfix: BUGFIX_SCENARIO,
};

export { SCAFFOLD_FILES };
