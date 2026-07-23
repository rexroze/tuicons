import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { semanticIcons } from "../icons";

const popular = [
  "play", "pause", "folder", "file", "home", "search", "settings",
  "check", "close", "heart", "star", "mail", "bell", "user", "lock",
  "clock", "calendar", "download", "upload", "trash", "edit", "plus",
  "github", "terminal", "database", "wifi", "camera", "music",
  "sun", "moon", "globe", "map-pin",
];

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

export default function Home() {
  const { toast, show } = useToast();

  const handleCopy = useCallback(async (name: string) => {
    const code = `import { icon } from "@tuicons/core";\nicon("${name}")`;
    try { await navigator.clipboard.writeText(code); } catch { /* fallback */ }
    show(`Copied: icon("${name}")`);
  }, [show]);

  const popularIcons = popular.map((n) => semanticIcons[semanticIcons.findIndex((i) => i.name === n)]).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 font-mono text-[10px] font-medium text-accent">
            v0.1.0 · {semanticIcons.length} semantic icons
          </span>
          <h1 className="mt-5 font-mono text-3xl font-bold leading-tight text-body sm:text-4xl lg:text-5xl">
            Typed icons for terminal interfaces
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Searchable, framework-agnostic terminal icons powered by Nerd&nbsp;Fonts,
            with safe Unicode and ASCII fallbacks. No more broken glyphs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/icons" className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent/90">
              View all icons
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <a href="https://github.com/rexroze/tuicons" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-edge px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-body hover:border-muted/30">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Safe by default"
              desc="Uses visible Unicode glyphs — never broken boxes. Opt into Nerd Fonts when you're ready."
            />
            <FeatureCard
              title="Three fallback modes"
              desc="Unicode (safe default), Nerd Font (full fidelity), and ASCII (maximum compatibility)."
            />
            <FeatureCard
              title="Semantic names"
              desc="Address icons by stable names like play, folder, github — not opaque private-use codepoints."
            />
            <FeatureCard
              title="Framework agnostic"
              desc="Core resolver works anywhere. Adaptors for OpenTUI with React, Ink, and more coming."
            />
            <FeatureCard
              title="Tree shakable"
              desc="Import only the icons you use. Each semantic name resolves at runtime with zero overhead."
            />
            <FeatureCard
              title="Opentui ready"
              desc="First-class OpenTUI adapter: Icon(renderer, { name: 'play', fg: '#7dd3fc' })."
            />
          </div>
        </div>
      </section>

      {/* Popular icons */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase">Popular icons</h2>
            <Link to="/icons" className="text-xs text-muted transition-colors hover:text-body">View all →</Link>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
            {popularIcons.map((ic) => (
              <button
                key={ic.name}
                onClick={() => handleCopy(ic.name)}
                className="group flex flex-col items-center gap-1 rounded-lg border border-edge bg-surface p-3 text-center transition-all hover:border-accent/30 hover:shadow-sm active:scale-[0.97]"
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

      {/* Install */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase">Install</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-edge bg-surface">
            <div className="border-b border-edge px-4 py-2 font-mono text-[10px] tracking-wider text-muted/60">Terminal</div>
            <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-body">
              <code>npm install @tuicons/core</code>
            </pre>
          </div>
          <div className="mt-3 overflow-hidden rounded-lg border border-edge bg-surface">
            <div className="border-b border-edge px-4 py-2 font-mono text-[10px] tracking-wider text-muted/60">Usage</div>
            <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-body">
{`import { icon } from "@tuicons/core";
icon("play");                       // ▶
icon("play", { mode: "nerd-font" }); // NerdFont glyph
icon("folder", { mode: "ascii" });   // [D]`}
            </pre>
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-scale-in pointer-events-none">
          <div className="inline-flex items-center gap-2 rounded-lg border border-accent/20 bg-surface px-4 py-2.5 shadow-lg">
            <svg className="h-3.5 w-3.5 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm text-body">{toast}</span>
          </div>
        </div>
      )}
    </>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-edge bg-surface p-5">
      <h3 className="text-sm font-semibold text-body">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{desc}</p>
    </div>
  );
}
