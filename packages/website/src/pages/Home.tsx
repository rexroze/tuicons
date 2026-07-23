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

/* ── Feature data using actual TUIcons ───────────────────────── */

function findIcon(name: string) {
  return semanticIcons.find((i) => i.name === name);
}

const features = [
  { title: "Safe by default", desc: "Visible Unicode glyphs — never broken boxes. Opt into Nerd Fonts when ready.", icon: "shield-check" },
  { title: "Three fallback modes", desc: "Unicode (safe), Nerd Font (full fidelity), ASCII (maximum compatibility).", icon: "layers" },
  { title: "Semantic names", desc: "Address icons by stable names like play, folder, github — not private-use codepoints.", icon: "tag" },
  { title: "Framework agnostic", desc: "Core resolver works anywhere. Adapters for OpenTUI, React, Ink, and more coming.", icon: "terminal" },
  { title: "Tree shakable", desc: "Import only the icons you use. Each semantic name resolves at runtime.", icon: "code" },
  { title: "OpenTUI ready", desc: "First-class adapter: Icon(renderer, { name: \"play\", fg: \"#7dd3fc\" }).", icon: "play" },
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
      try { await navigator.clipboard.writeText(code); } catch { /* fallback */ }
      show(`Copied: icon("${name}")`);
    },
    [show],
  );

  const popularIcons = popular
    .map((n) => findIcon(n))
    .filter(Boolean) as NonNullable<ReturnType<typeof findIcon>>[];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/[0.04] px-3 py-1 font-mono text-[10px] font-medium tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {semanticIcons.length} semantic icons
          </span>
          <h1 className="mt-6 font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl" style={{ textWrap: "balance" }}>
            Typed icons for terminal interfaces
          </h1>
          <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed text-muted sm:text-base" style={{ textWrap: "pretty" }}>
            Searchable, framework-agnostic terminal icons powered by Nerd&nbsp;Fonts,
            with safe Unicode and ASCII fallbacks. No more broken glyphs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/icons" className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-all hover:bg-accent/90 active:scale-[0.97]">
              Browse icons
              <span className="font-mono text-xs">→</span>
            </Link>
            <a href="https://github.com/rexroze/tuicons" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-edge px-5 py-2.5 text-sm font-medium text-muted transition-all hover:text-body hover:border-muted/30 active:scale-[0.97]">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-px bg-edge sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const ic = findIcon(f.icon);
              return (
                <div key={f.title} className="bg-bg p-6 sm:p-7">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-accent/15 bg-accent/[0.04]">
                    <span className="font-mono text-lg leading-none text-accent">{ic?.unicode ?? "?"}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-body">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Popular icons ───────────────────────────────────────── */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-8 flex items-end justify-between border-b border-edge pb-4">
            <div>
              <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase">Popular icons</h2>
              <p className="mt-1 text-xs text-muted">Click any to copy the import snippet</p>
            </div>
            <Link to="/icons" className="shrink-0 text-xs text-muted transition-colors hover:text-body">View all →</Link>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {popularIcons.map((ic) => (
              <button
                key={ic.name}
                onClick={() => handleCopy(ic.name)}
                className="group flex flex-col items-center gap-1.5 rounded-md border border-edge bg-surface p-3 text-center transition-all hover:border-accent/25 hover:bg-hover active:scale-[0.97]"
                aria-label={`Copy import for ${ic.name}`}
              >
                <span className="font-mono text-2xl leading-none text-body transition-colors group-hover:text-accent sm:text-3xl">{ic.unicode}</span>
                <span className="w-full truncate text-[10px] font-medium text-muted transition-colors group-hover:text-body/80">{ic.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Install ─────────────────────────────────────────────── */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase text-center">Install</h2>
            <div className="mt-6 overflow-hidden rounded-lg border border-edge bg-surface">
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
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-scale-in pointer-events-none" role="status" aria-live="polite">
          <div className="inline-flex items-center gap-2 rounded-lg border border-accent/20 bg-surface px-4 py-2.5 shadow-lg">
            <span className="font-mono text-xs text-accent">✓</span>
            <span className="text-sm text-body">{toast}</span>
          </div>
        </div>
      )}
    </>
  );
}
