import { useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { semanticIcons } from "../icons";

/* ── Popular icon names ──────────────────────────────────────── */

const popular = [
  "play", "pause", "folder", "file", "home", "search", "settings",
  "check", "close", "heart", "star", "mail", "bell", "user", "lock",
  "clock", "calendar", "download", "upload", "trash", "edit", "plus",
  "github", "terminal", "database", "wifi", "camera", "music",
  "sun", "moon", "globe", "map-pin",
];

/* ── Feature card data with SVG icons ────────────────────────── */

const features = [
  {
    title: "Safe by default",
    desc: "Uses visible Unicode glyphs — never broken boxes. Opt into Nerd Fonts when you're ready.",
    icon: (
      <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Three fallback modes",
    desc: "Unicode (safe default), Nerd Font (full fidelity), and ASCII (maximum compatibility).",
    icon: (
      <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
  },
  {
    title: "Semantic names",
    desc: "Address icons by stable names like play, folder, github — not opaque private-use codepoints.",
    icon: (
      <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
  {
    title: "Framework agnostic",
    desc: "Core resolver works anywhere. Adaptors for OpenTUI with React, Ink, and more coming.",
    icon: (
      <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: "Tree shakable",
    desc: "Import only the icons you use. Each semantic name resolves at runtime with zero overhead.",
    icon: (
      <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 3.75l-6 6-6-6" />
      </svg>
    ),
  },
  {
    title: "OpenTUI ready",
    desc: "First-class OpenTUI adapter: Icon(renderer, { name: 'play', fg: '#7dd3fc' }).",
    icon: (
      <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l-3 2.5 3 2.5M18 6l3 2.5-3 2.5M9 15l6-6" />
      </svg>
    ),
  },
];

/* ── Toast hook ──────────────────────────────────────────────── */

function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2000);
  }, []);
  return { toast, show };
}

/* ================================================================ */
/*  Home Page                                                       */
/* ================================================================ */

export default function Home() {
  const { toast, show } = useToast();

  const handleCopy = useCallback(
    async (name: string) => {
      const code = `import { icon } from "@tuicons/core";\nicon("${name}")`;
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        /* clipboard not available */
      }
      show(`Copied: icon("${name}")`);
    },
    [show],
  );

  const popularIcons = popular
    .map((n) => semanticIcons[semanticIcons.findIndex((i) => i.name === n)])
    .filter(Boolean);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/[0.04] px-3 py-1 font-mono text-[10px] font-medium tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {semanticIcons.length} semantic icons
          </span>

          {/* Headline */}
          <h1 className="mt-6 font-mono text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
            Typed icons for terminal interfaces
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed text-muted sm:text-base text-pretty">
            Searchable, framework-agnostic terminal icons powered by Nerd&nbsp;Fonts,
            with safe Unicode and ASCII fallbacks. No more broken glyphs.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/icons"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-all hover:bg-accent/90 active:scale-[0.97]"
            >
              Browse icons
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="https://github.com/rexroze/tuicons"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-edge px-5 py-2.5 text-sm font-medium text-muted transition-all hover:text-body hover:border-muted/30 active:scale-[0.97]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-px bg-edge sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-bg p-6 sm:p-7"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-accent/15 bg-accent/[0.04]">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-body">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular icons ───────────────────────────────────────── */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          {/* Section header */}
          <div className="mb-8 flex items-end justify-between border-b border-edge pb-4">
            <div>
              <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase">
                Popular icons
              </h2>
              <p className="mt-1 text-xs text-muted">
                Click any to copy the import snippet
              </p>
            </div>
            <Link
              to="/icons"
              className="shrink-0 text-xs text-muted transition-colors hover:text-body"
            >
              View all &rarr;
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {popularIcons.map((ic, i) => (
              <button
                key={ic.name}
                onClick={() => handleCopy(ic.name)}
                className="group flex flex-col items-center gap-1.5 rounded-md border border-edge bg-surface p-3 text-center transition-all hover:border-accent/25 hover:bg-hover active:scale-[0.97]"
                style={{ animationDelay: `${i * 30}ms` }}
                aria-label={`Copy import for ${ic.name}`}
              >
                <span className="font-mono text-2xl leading-none text-body transition-colors group-hover:text-accent sm:text-3xl">
                  {ic.unicode}
                </span>
                <span className="w-full truncate text-[10px] font-medium text-muted transition-colors group-hover:text-body/80">
                  {ic.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Install ─────────────────────────────────────────────── */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase text-center">
              Install
            </h2>
            <div className="mt-6 overflow-hidden rounded-lg border border-edge bg-surface">
              {/* Tab bar */}
              <div className="flex border-b border-edge">
                <span className="inline-flex items-center gap-1.5 border-b-2 border-accent px-4 py-2 font-mono text-[10px] font-medium tracking-wider text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Terminal
                </span>
              </div>
              <pre className="overflow-x-auto px-4 py-3.5 font-mono text-sm leading-relaxed text-body">
                <code>npm install @tuicons/core</code>
              </pre>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg border border-edge bg-surface">
              <div className="flex border-b border-edge">
                <span className="inline-flex items-center gap-1.5 border-b-2 border-accent px-4 py-2 font-mono text-[10px] font-medium tracking-wider text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Usage
                </span>
              </div>
              <pre className="overflow-x-auto px-4 py-3.5 font-mono text-sm leading-relaxed text-body">
                <code>{`import { icon } from "@tuicons/core";
icon("play");                       // ▶
icon("play", { mode: "nerd-font" }); // NerdFont glyph
icon("folder", { mode: "ascii" });   // [D]`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Toast ───────────────────────────────────────────────── */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-scale-in pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div className="inline-flex items-center gap-2 rounded-lg border border-accent/20 bg-surface px-4 py-2.5 shadow-lg">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm text-body">{toast}</span>
          </div>
        </div>
      )}
    </>
  );
}
