import type { FC } from "react";

/* ────────────────────────────────────────────────────────────────
   Mock websites the agent visits / builds. Rendered inside the
   Computer pane (full size) and as screenshot thumbnails (scaled).
   Pure presentational — safe to render anywhere.
   ──────────────────────────────────────────────────────────────── */

export interface SiteProps {
  /** text currently being typed into this site's input (search box) */
  typed?: string;
}

/* ── New tab page ─────────────────────────────────────────────── */
const StartPage: FC<SiteProps> = () => (
  <div className="flex min-h-full flex-col items-center justify-center gap-8 bg-[#f7f8fb] px-8 py-16">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-400 text-2xl">
      🌐
    </div>
    <div className="flex h-12 w-full max-w-md items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 text-[15px] text-neutral-400 shadow-sm">
      <span className="text-neutral-300">🔍</span> Search or enter address
    </div>
    <div className="flex gap-4">
      {[
        ["H", "#0ea5e9", "HydraCoach"],
        ["A", "#14b8a6", "AquaReset"],
        ["N", "#8b5cf6", "NovaSearch"],
        ["G", "#f59e0b", "GlobeConsumer"],
      ].map(([l, c, n]) => (
        <div key={n} className="flex w-20 flex-col items-center gap-2">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ background: c as string }}
          >
            {l}
          </div>
          <span className="text-[11px] text-neutral-500">{n}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Search engine home ───────────────────────────────────────── */
const SearchPage: FC<SiteProps> = ({ typed }) => (
  <div className="flex min-h-full flex-col items-center justify-center gap-7 bg-white px-8 py-16">
    <div className="flex items-end gap-1 text-[44px] font-bold tracking-tight">
      <span className="text-[#8b5cf6]">Nova</span>
      <span className="text-[#38bdf8]">Search</span>
    </div>
    <div className="flex h-13 w-full max-w-xl items-center gap-3 rounded-full border-2 border-[#8b5cf6]/30 bg-white px-6 py-3.5 shadow-[0_2px_14px_rgba(139,92,246,0.12)]">
      <span className="text-neutral-400">🔍</span>
      <span className="text-[16px] text-neutral-800">
        {typed ?? ""}
        <span className="animate-caret ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-[#8b5cf6]" />
      </span>
    </div>
    <div className="flex gap-3">
      <span className="rounded-lg border border-neutral-200 px-5 py-2 text-[13px] text-neutral-600">Nova Search</span>
      <span className="rounded-lg border border-neutral-200 px-5 py-2 text-[13px] text-neutral-600">I'm feeling hydrated</span>
    </div>
    <p className="mt-6 text-[12px] text-neutral-400">NovaSearch — 2.4B pages indexed · 0 ads on page one</p>
  </div>
);

/* ── Search results ───────────────────────────────────────────── */
const RESULTS = [
  {
    t: "HydraCoach — The original smart water bottle | Official site",
    u: "https://hydracoach.com",
    d: "Tracks every sip in real time and coaches you to your daily goal. Core $79 · Pro $119. Free app, 30-day returns.",
    c: "#0ea5e9",
    l: "H",
  },
  {
    t: "HydraCoach Pro review — 3 months in",
    u: "https://sipwear.tech/hydracoach-pro-review",
    d: "The flow sensor is flawless and battery lasts 11 days. The coaching app nudges a bit aggressively for our taste…",
    c: "#f59e0b",
    l: "S",
  },
  {
    t: "Best smart water bottles in 2026 — full comparison",
    u: "https://globeconsumer.io/best-smart-bottles-2026",
    d: "We tested 14 bottles. HydraCoach leads on accuracy, AquaReset on reminders, SipSense on value.",
    c: "#10b981",
    l: "G",
  },
  {
    t: "r/HydroHomies — HydraCoach pricing went UP?",
    u: "https://reddit.com/r/HydroHomies",
    d: "142 comments · Core went from $69 to $79 last month. Still worth it IMO, the coaching alone pays for it.",
    c: "#ff4500",
    l: "R",
  },
];

const SearchResultsPage: FC<SiteProps> = () => (
  <div className="min-h-full bg-white px-10 py-6 font-sans">
    <div className="flex items-center gap-4 border-b border-neutral-200 pb-4">
      <span className="text-[22px] font-bold">
        <span className="text-[#8b5cf6]">Nova</span>
        <span className="text-[#38bdf8]">Search</span>
      </span>
      <div className="flex h-10 flex-1 max-w-lg items-center rounded-full border border-neutral-200 px-4 text-[13px] text-neutral-700">
        hydracoach smart water bottle pricing
        <span className="ml-auto text-neutral-400">🔍</span>
      </div>
    </div>
    <p className="py-3 text-[12px] text-neutral-400">About 1,240,000 results (0.31 seconds)</p>
    <div className="flex flex-col gap-7">
      {RESULTS.map((r) => (
        <div key={r.u} className="max-w-2xl">
          <div className="mb-1 flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold text-white"
              style={{ background: r.c }}
            >
              {r.l}
            </span>
            <div className="leading-tight">
              <div className="text-[13px] text-neutral-800">HydraCoach</div>
              <div className="text-[12px] text-[#1a0dab]">{r.u}</div>
            </div>
          </div>
          <div className="cursor-pointer text-[18px] text-[#1a0dab] hover:underline">{r.t}</div>
          <p className="mt-1 text-[13px] leading-relaxed text-neutral-600">{r.d}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── HydraCoach (competitor 1 — light blue SaaS-y) ────────────── */
const HydraCoachSite: FC<SiteProps> = () => (
  <div className="min-h-full bg-white font-sans text-neutral-800">
    <nav className="flex items-center justify-between border-b border-sky-100 px-10 py-4">
      <div className="flex items-center gap-2 text-[19px] font-extrabold tracking-tight">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white">💧</span>
        Hydra<span className="text-sky-500">Coach</span>
      </div>
      <div className="flex items-center gap-7 text-[14px] font-medium text-neutral-600">
        <span>Features</span>
        <span className="rounded-full bg-sky-500 px-3 py-1 text-white">Pricing</span>
        <span className="rounded-full border border-sky-200 px-4 py-1.5 text-sky-600">Buy now</span>
      </div>
    </nav>
    <section className="flex items-center gap-14 bg-gradient-to-br from-sky-50 to-white px-12 py-14">
      <div className="flex-1">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-[12px] font-semibold text-sky-700">
          As seen on Shark Tank
        </span>
        <h1 className="mt-4 text-[40px] font-extrabold leading-[1.08] tracking-tight">
          Drink smarter.<br />
          <span className="text-sky-500">The original smart bottle.</span>
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-600">
          HydraCoach logs every sip automatically and nudges you to your goal. Trusted by 340,000 athletes since 2023.
        </p>
        <div className="mt-6 flex gap-3">
          <span className="rounded-full bg-sky-500 px-6 py-2.5 text-[14px] font-semibold text-white">Shop Core — $79</span>
          <span className="rounded-full border border-sky-200 px-6 py-2.5 text-[14px] font-semibold text-sky-600">
            Take the quiz
          </span>
        </div>
      </div>
      <Bottle color="#38bdf8" cap="#0c4a6e" />
    </section>
    <section className="px-12 py-12">
      <h2 className="text-[24px] font-bold">Simple pricing</h2>
      <div className="mt-6 grid grid-cols-3 gap-5">
        {[
          ["Core", "$79", "Real-time tracking · goal nudges · 30-day battery", false],
          ["Pro", "$119", "+ AI hydration plans · health app sync · coaching", true],
          ["Team", "$249", "6 bottles · coach dashboard · league tables", false],
        ].map(([n, p, d, hot]) => (
          <div
            key={n as string}
            className={`rounded-2xl border p-6 ${hot ? "border-sky-400 bg-sky-50 ring-2 ring-sky-200" : "border-neutral-200"}`}
          >
            <div className="text-[13px] font-bold uppercase tracking-wider text-sky-600">{n}</div>
            <div className="mt-2 text-[34px] font-extrabold">
              {p}
              <span className="text-[14px] font-medium text-neutral-400">/once</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">{d}</p>
            <div className="mt-4 rounded-lg bg-sky-500 py-2 text-center text-[13px] font-semibold text-white">
              Choose {n}
            </div>
          </div>
        ))}
      </div>
    </section>
    <footer className="border-t border-neutral-100 px-12 py-8 text-[12px] text-neutral-400">
      © 2026 HydraCoach Inc. · Privacy · Terms · Support
    </footer>
  </div>
);

/* ── AquaReset (competitor 2 — dark mint) ─────────────────────── */
const AquaResetSite: FC<SiteProps> = () => (
  <div className="min-h-full bg-[#07211d] font-sans text-[#e6fffa]">
    <nav className="flex items-center justify-between px-10 py-4">
      <div className="flex items-center gap-2 text-[19px] font-extrabold">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 text-[#07211d]">↻</span>
        Aqua<span className="text-emerald-400">Reset</span>
      </div>
      <div className="flex items-center gap-7 text-[14px] font-medium text-[#99f6e4]">
        <span>How it works</span>
        <span>Family</span>
        <span className="rounded-full bg-emerald-400 px-4 py-1.5 font-semibold text-[#07211d]">Get yours</span>
      </div>
    </nav>
    <section className="flex items-center gap-14 px-12 py-16">
      <div className="flex-1">
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[12px] font-semibold text-emerald-300">
          4.6★ · 21,000 reviews
        </span>
        <h1 className="mt-4 text-[42px] font-extrabold leading-[1.06] tracking-tight">
          Never forget<br />
          to drink <span className="text-emerald-400">again.</span>
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#a7f3d0]/80">
          AquaReset glows when it's time — a gentle ring of light on your desk, synced to the whole family.
        </p>
        <div className="mt-6 flex gap-3">
          <span className="rounded-full bg-emerald-400 px-6 py-2.5 text-[14px] font-bold text-[#07211d]">
            From $59
          </span>
          <span className="rounded-full border border-emerald-400/40 px-6 py-2.5 text-[14px] font-semibold text-emerald-300">
            Family plan — 4 for $149
          </span>
        </div>
      </div>
      <GlowOrb />
    </section>
    <section className="px-12 pb-16">
      <div className="grid grid-cols-3 gap-5">
        {[
          ["Glow reminders", "A soft light ring — no buzzing, no apps required."],
          ["Auto-log", "Weight sensor knows when you drank, not just when you poured."],
          ["Family sync", "One dashboard for up to 6 bottles. Kids love the streaks."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-6">
            <h3 className="text-[16px] font-bold">{t}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#a7f3d0]/70">{d}</p>
          </div>
        ))}
      </div>
    </section>
    <footer className="border-t border-emerald-400/10 px-12 py-8 text-[12px] text-[#a7f3d0]/40">
      © 2026 AquaReset BV · Privacy · Terms
    </footer>
  </div>
);

/* ── Aqua Pulse (the page the agent builds) ───────────────────── */
const AquaPulseSite: FC<SiteProps> = () => (
  <div className="min-h-full bg-[#f0f9ff] font-sans text-[#0c1220]">
    <nav className="flex items-center justify-between px-12 py-4">
      <div className="flex items-center gap-2 text-[19px] font-extrabold tracking-tight">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500 text-white">
          ◉
        </span>
        Aqua<span className="text-cyan-600">Pulse</span>
      </div>
      <div className="flex items-center gap-7 text-[14px] font-medium text-slate-600">
        <span>Features</span>
        <span>Pricing</span>
        <span className="rounded-full bg-cyan-600 px-5 py-1.5 font-semibold text-white shadow-sm">
          Start free trial
        </span>
      </div>
    </nav>
    <section className="bg-gradient-to-br from-sky-100 via-[#f0f9ff] to-cyan-100 px-12 pb-20 pt-16 text-center">
      <span className="rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-cyan-700 shadow-sm">
        ✦ AI hydration coaching
      </span>
      <h1 className="mx-auto mt-5 max-w-2xl text-[52px] font-extrabold leading-[1.05] tracking-tight">
        Water, <span className="text-cyan-600">perfected.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-slate-600">
        Aqua Pulse learns your rhythm and reminds you before you thirst. Not a tracker — a coach.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <span className="rounded-full bg-cyan-600 px-8 py-3 text-[15px] font-semibold text-white shadow-lg shadow-cyan-600/20">
          Start free trial
        </span>
        <span className="rounded-full border border-cyan-600/30 px-8 py-3 text-[15px] font-semibold text-cyan-700">
          See how it works
        </span>
      </div>
      <p className="mt-4 text-[12px] text-slate-400">Free for 30 days · No card required</p>
    </section>
    <section className="grid grid-cols-3 gap-6 px-12 py-16">
      {[
        ["🔔", "Adaptive reminders", "Nudges timed to your habits, not a fixed clock."],
        ["📈", "Smart tracking", "Every sip logged automatically — no manual entry."],
        ["🔄", "Health sync", "Fits Apple Health, Google Fit and 12 more apps."],
      ].map(([e, t, d]) => (
        <div key={t} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-sky-100">
          <div className="text-[26px]">{e}</div>
          <h3 className="mt-3 text-[17px] font-bold">{t}</h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{d}</p>
        </div>
      ))}
    </section>
    <section className="px-12 pb-20">
      <h2 className="text-center text-[30px] font-extrabold tracking-tight">Simple pricing</h2>
      <p className="mt-2 text-center text-[14px] text-slate-500">Start free. Upgrade when you're thirsty for more.</p>
      <div className="mt-8 grid grid-cols-3 gap-6">
        {[
          ["Solo", "$0", "1 bottle, basic tracking", false],
          ["Coach", "$6", "AI plans + health sync", true],
          ["Family", "$14", "Up to 5 bottles", false],
        ].map(([n, p, d, hot]) => (
          <div
            key={n as string}
            className={`rounded-2xl p-7 ${hot ? "bg-[#0c1220] text-white ring-2 ring-cyan-400" : "bg-white shadow-sm ring-1 ring-sky-100"}`}
          >
            <div className={`text-[13px] font-bold uppercase tracking-wider ${hot ? "text-cyan-300" : "text-cyan-700"}`}>
              {n}
            </div>
            <div className="mt-2 text-[36px] font-extrabold">
              {p}
              <span className="text-[14px] font-medium opacity-50">/mo</span>
            </div>
            <p className={`mt-2 text-[13px] ${hot ? "text-white/70" : "text-slate-600"}`}>{d}</p>
            <div
              className={`mt-5 rounded-lg py-2.5 text-center text-[13px] font-semibold ${
                hot ? "bg-cyan-400 text-[#0c1220]" : "bg-cyan-600 text-white"
              }`}
            >
              Choose {n}
            </div>
          </div>
        ))}
      </div>
    </section>
    <footer className="flex items-center justify-between border-t border-sky-100 bg-white px-12 py-9 text-[13px] text-slate-400">
      <span>© 2026 Aqua Pulse Inc.</span>
      <div className="flex gap-6">
        <span>Privacy</span>
        <span>Terms</span>
        <span>Support</span>
      </div>
    </footer>
  </div>
);

/* ── CSS illustrations ────────────────────────────────────────── */
function Bottle({ color, cap }: { color: string; cap: string }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="h-7 w-12 rounded-t-lg" style={{ background: cap }} />
      <div
        className="h-56 w-28 rounded-[28px] border-4 border-white shadow-xl"
        style={{ background: `linear-gradient(180deg, ${color} 0%, ${color}cc 40%, ${color}99 100%)` }}
      >
        <div className="mt-8 flex justify-center">
          <div className="rounded-lg bg-white/85 px-2 py-1.5 text-center">
            <div className="text-[10px] font-bold tracking-wide text-slate-700">HYDRACOACH</div>
            <div className="mt-1 h-1.5 w-14 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-2/3 rounded-full bg-emerald-400" />
            </div>
            <div className="mt-1 text-[8px] text-slate-500">1,420 / 2,100 ml</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        <span className="text-[11px] font-medium text-slate-600">Syncing — 68% to goal</span>
      </div>
    </div>
  );
}

function GlowOrb() {
  return (
    <div className="relative grid h-64 w-64 place-items-center">
      <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/10" />
      <div className="absolute h-44 w-44 rounded-full bg-emerald-400/20 blur-xl" />
      <div className="relative grid h-32 w-32 place-items-center rounded-full border-4 border-emerald-300/60 bg-emerald-400/10">
        <div className="h-16 w-16 rounded-full bg-emerald-300/50 blur-md" />
        <span className="absolute text-[11px] font-bold text-emerald-200">DRINK NOW</span>
      </div>
    </div>
  );
}

/* ── Registry ─────────────────────────────────────────────────── */
export const SITES: Record<string, FC<SiteProps>> = {
  start: StartPage,
  search: SearchPage,
  "search-results": SearchResultsPage,
  hydracoach: HydraCoachSite,
  aquareset: AquaResetSite,
  aquapulse: AquaPulseSite,
};

export function Site({ siteId, typed }: { siteId: string; typed?: string }) {
  const C = SITES[siteId] ?? StartPage;
  return <C typed={typed} />;
}

/** Scaled-down render for screenshot thumbnails. */
export function SiteThumb({ siteId, scrollY = 0, width = 320 }: { siteId: string; scrollY?: number; width?: number }) {
  const scale = width / 1280;
  return (
    <div className="h-full w-full overflow-hidden bg-white">
      <div style={{ width: 1280, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <div style={{ marginTop: -scrollY, pointerEvents: "none" }}>
          <Site siteId={siteId} />
        </div>
      </div>
    </div>
  );
}
