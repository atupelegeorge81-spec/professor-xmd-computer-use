/* Mock project files the agent writes during the demo run. */

export const SCAFFOLD_FILES: { path: string; language: string; content: string }[] = [
  {
    path: "aqua-pulse/package.json",
    language: "json",
    content: `{
  "name": "aqua-pulse",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "motion": "^12.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}`,
  },
  {
    path: "aqua-pulse/index.html",
    language: "html",
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aqua Pulse — Hydration that thinks</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  },
  {
    path: "aqua-pulse/src/main.tsx",
    language: "tsx",
    content: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  },
  {
    path: "aqua-pulse/src/App.tsx",
    language: "tsx",
    content: `export default function App() {
  return (
    <main>
      {/* sections composed on build */}
    </main>
  );
}`,
  },
];

export const CREATED_FILES: Record<string, { language: string; content: string }> = {
  "aqua-pulse/src/index.css": {
    language: "css",
    content: `@import "tailwindcss";

:root {
  --aqua-50: #f0f9ff;
  --aqua-400: #38bdf8;
  --aqua-600: #0284c7;
  --ink: #0c1220;
}

body {
  font-family: Inter, system-ui, sans-serif;
  color: var(--ink);
  background: var(--aqua-50);
}

.hero-gradient {
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 45%, #cffafe 100%);
}`,
  },
  "aqua-pulse/src/components/Hero.tsx": {
    language: "tsx",
    content: `import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="hero-gradient px-10 py-24 text-center">
      <span className="badge">AI hydration coaching</span>
      <h1 className="text-6xl font-bold tracking-tight">
        Water, <span className="text-aqua-600">perfected.</span>
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Aqua Pulse learns your rhythm and reminds you before you thirst.
      </p>
      <motion.a
        whileHover={{ scale: 1.04 }}
        href="#pricing"
        className="btn-primary mt-8 inline-block rounded-full bg-aqua-600 px-8 py-3 text-white"
      >
        Start free trial
      </motion.a>
    </section>
  );
}`,
  },
  "aqua-pulse/src/components/Features.tsx": {
    language: "tsx",
    content: `const FEATURES = [
  {
    title: "Adaptive reminders",
    body: "Nudges timed to your habits, not a fixed clock.",
    icon: "bell",
  },
  {
    title: "Smart tracking",
    body: "Every sip logged automatically — no manual entry.",
    icon: "chart",
  },
  {
    title: "Health sync",
    body: "Fits Apple Health, Google Fit and 12 more apps.",
    icon: "sync",
  },
];

export default function Features() {
  return (
    <section className="grid gap-6 px-10 py-16 md:grid-cols-3">
      {FEATURES.map((f) => (
        <article key={f.title} className="card p-6">
          <h3 className="font-semibold">{f.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{f.body}</p>
        </article>
      ))}
    </section>
  );
}`,
  },
  "aqua-pulse/src/components/Pricing.tsx": {
    language: "tsx",
    content: `const PLANS = [
  { name: "Solo", price: "$0", note: "1 bottle, basic tracking" },
  { name: "Coach", price: "$6", note: "AI plans + health sync", hot: true },
  { name: "Family", price: "$14", note: "Up to 5 bottles" },
];

export default function Pricing() {
  return (
    <section id="pricing" className="px-10 py-16">
      <h2 className="text-3xl font-bold">Simple pricing</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.name} className={p.hot ? "card hot" : "card"}>
            <h3>{p.name}</h3>
            <p className="price">{p.price}/mo</p>
            <p>{p.note}</p>
            <button>Choose {p.name}</button>
          </div>
        ))}
      </div>
    </section>
  );
}`,
  },
  "aqua-pulse/src/components/Footer.tsx": {
    language: "tsx",
    content: `export default function Footer() {
  return (
    <footer className="border-t px-10 py-10 text-sm text-slate-500">
      <div className="flex items-center justify-between">
        <span>© 2026 Aqua Pulse Inc.</span>
        <nav className="flex gap-6">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#support">Support</a>
        </nav>
      </div>
    </footer>
  );
}`,
  },
  "aqua-pulse/src/App.tsx": {
    language: "tsx",
    content: `import Hero from "./components/Hero";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";

export default function App() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}`,
  },
};

/* ── Bugfix scenario files ────────────────────────────────────── */

export const CHECKOUT_FILE = `export function applyDiscount(subtotal: number, code: string) {
  const codes: Record<string, number> = {
    WELCOME10: 0.1,
    SUMMER20: 0.2,
  };

  const rate = codes[code];
  if (!rate) return { subtotal, discount: 0, total: subtotal };

  const discount = Math.round(subtotal * rate * 100) / 100;
  const total = subtotal - discount; // percentage off the subtotal

  return { subtotal, discount, total };
}`;

export const CHECKOUT_DIFF = [
  { type: "ctx", text: "  const rate = codes[code];" },
  { type: "ctx", text: "  if (!rate) return { subtotal, discount: 0, total: subtotal };" },
  { type: "ctx", text: "" },
  { type: "del", text: "  const discount = subtotal * rate;" },
  { type: "del", text: "  const total = subtotal + discount; // bug: adds the discount" },
  { type: "add", text: "  const discount = Math.round(subtotal * rate * 100) / 100;" },
  { type: "add", text: "  const total = subtotal - discount; // apply the discount" },
  { type: "ctx", text: "" },
  { type: "ctx", text: "  return { subtotal, discount, total };" },
];
