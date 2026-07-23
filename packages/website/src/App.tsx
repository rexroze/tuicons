import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { semanticIcons, type SemanticIconDefinition } from "./icons";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const allCategories = [...new Set(semanticIcons.flatMap((i) => i.categories))].sort();

function matchesQuery(icon: SemanticIconDefinition, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return icon.name.includes(q) || icon.label.includes(q) || icon.categories.some((c) => c.includes(q));
}

function snippet(name: string) {
  return `import { icon } from "@tuicons/core";\nicon("${name}")`;
}

/* ------------------------------------------------------------------ */
/*  Colors                                                             */
/* ------------------------------------------------------------------ */

const CAT_PALETTE = [
  "bg-rose-500/10 text-rose-400",
  "bg-amber-500/10 text-amber-400",
  "bg-emerald-500/10 text-emerald-400",
  "bg-sky-500/10 text-sky-400",
  "bg-violet-500/10 text-violet-400",
  "bg-cyan-500/10 text-cyan-400",
  "bg-fuchsia-500/10 text-fuchsia-400",
  "bg-lime-500/10 text-lime-400",
  "bg-orange-500/10 text-orange-400",
  "bg-indigo-500/10 text-indigo-400",
];

function catColor(cat: string) {
  const i = allCategories.indexOf(cat);
  return CAT_PALETTE[i % CAT_PALETTE.length]!;
}

const CAT_DOT = [
  "bg-rose-400", "bg-amber-400", "bg-emerald-400", "bg-sky-400", "bg-violet-400",
  "bg-cyan-400", "bg-fuchsia-400", "bg-lime-400", "bg-orange-400", "bg-indigo-400",
];
function catDot(cat: string) {
  const i = allCategories.indexOf(cat);
  return CAT_DOT[i % CAT_DOT.length]!;
}

/* ================================================================== */
/*  App                                                                */
/* ================================================================== */

export default function App() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const searchRef = useRef<HTMLInputElement>(null);

  const fireToast = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }, []);

  const filtered = useMemo(() => {
    let r = semanticIcons;
    if (query) r = r.filter((i) => matchesQuery(i, query));
    if (activeCat) r = r.filter((i) => i.categories.includes(activeCat));
    return r;
  }, [query, activeCat]);

  const handleCopy = useCallback(
    async (name: string) => {
      const code = snippet(name);
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        // Fallback for older browsers / non-HTTPS
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(name);
      fireToast(`Copied: import { icon } from "@tuicons/core";`);
      setTimeout(() => setCopied(null), 1200);
    },
    [fireToast],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ================================================================ */
  return (
    <div className="min-h-screen bg-bg text-body font-sans">
      {/* ---- Header ---- */}
      <header className="border-b border-edge bg-bg/90 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
          <a href="/" className="flex shrink-0 items-center gap-2 select-none">
            <span className="font-mono text-lg font-bold tracking-tight text-accent">&gt;_</span>
            <span className="hidden font-sans text-sm font-semibold text-body sm:inline">TUIcons</span>
          </a>
          <div className="relative flex-1 max-w-md">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search {semanticIcons.length} icons…"
              aria-label="Search icons"
              className="w-full rounded-md border border-edge bg-surface py-2 pl-9 pr-3 text-sm text-body placeholder-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-edge bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline-block">⌘K</kbd>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <a href="https://github.com/rexroze/tuicons" target="_blank" rel="noopener noreferrer" className="text-xs text-muted transition-colors hover:text-body">GitHub</a>
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 font-mono text-[10px] font-medium text-accent">
              v0.1.0
            </span>
          </div>
        </div>
      </header>

      {/* ---- Body: sidebar + grid ---- */}
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pt-6 pb-16 sm:px-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-44 shrink-0 lg:block">
          <nav className="sticky top-[73px] space-y-0.5">
            <button
              onClick={() => setActiveCat(null)}
              className={`block w-full rounded-md px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                activeCat === null ? "bg-accent/10 text-accent" : "text-muted hover:text-body"
              }`}
            >
              All icons
            </button>
            {allCategories.map((cat) => {
              const isActive = activeCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(isActive ? null : cat)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-medium capitalize transition-colors ${
                    isActive ? "bg-surface text-body ring-1 ring-edge" : "text-muted hover:text-body hover:bg-surface/50"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${catDot(cat)}`} />
                  {cat}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main grid area */}
        <div className="min-w-0 flex-1">
          {/* Category chips (mobile/tablet) */}
          <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setActiveCat(null)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                activeCat === null ? "bg-accent text-bg" : "border border-edge text-muted hover:text-body"
              }`}
            >
              All
            </button>
            {allCategories.map((cat) => {
              const isActive = activeCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(isActive ? null : cat)}
                  className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                    isActive ? `${catColor(cat)} ring-1 ring-inset ring-current/20` : "border border-edge text-muted hover:text-body"
                  }`}
                >
                  <span className={`h-1 w-1 rounded-full ${catDot(cat)}`} />
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <p className="mb-4 text-xs text-muted">
            {filtered.length} icon{filtered.length !== 1 ? "s" : ""}
            {activeCat && <span> in <span className="font-medium capitalize text-body/60">{activeCat}</span></span>}
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6">
              {filtered.map((ic, idx) => (
                <button
                  key={ic.name}
                  onClick={() => handleCopy(ic.name)}
                  className="group relative flex flex-col items-center gap-1 rounded-lg border border-edge bg-surface p-3 text-center transition-all hover:border-accent/30 hover:shadow-sm hover:shadow-accent/5 active:scale-[0.97]"
                  style={{ animationDelay: `${(idx % 12) * 25}ms`, animation: "card-in 0.3s ease-out both" }}
                >
                  {/* Glyph */}
                  <span className="font-mono text-3xl leading-none text-body transition-colors group-hover:text-accent sm:text-4xl md:text-5xl">
                    {ic.unicode}
                  </span>
                  {/* Name */}
                  <span className="w-full truncate text-[11px] font-medium leading-tight text-body/60 transition-colors group-hover:text-body/90">
                    {ic.name}
                  </span>
                  {/* Fallback */}
                  <span className="font-mono text-[9px] leading-tight text-muted/50">{ic.ascii}</span>
                  {/* Copy check overlay */}
                  {copied === ic.name && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-accent/10 backdrop-blur-[1px] animate-fade-in">
                      <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-edge py-20 text-center">
              <p className="text-sm text-muted">No icons match your search.</p>
              <button
                onClick={() => { setQuery(""); setActiveCat(null); searchRef.current?.focus(); }}
                className="mt-2 text-sm text-accent transition-colors hover:text-accent/80"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Install section */}
          <section className="mt-16 border-t border-edge pt-10">
            <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase">Install</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-edge bg-surface">
              <div className="border-b border-edge px-4 py-2 font-mono text-[10px] tracking-wider text-muted/60">npm / pnpm / yarn / bun</div>
              <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-body">
                <code>npm install @tuicons/core</code>
              </pre>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg border border-edge bg-surface">
              <div className="border-b border-edge px-4 py-2 font-mono text-[10px] tracking-wider text-muted/60">Usage</div>
              <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-body">
{`import { icon } from "@tuicons/core";
icon("play");                       // ▶
icon("play", { mode: "nerd-font" }); // uses NerdFont glyph
icon("folder", { mode: "ascii" });   // [D]`}
              </pre>
            </div>
          </section>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-scale-in">
          <div className="inline-flex items-center gap-2 rounded-lg border border-accent/20 bg-surface px-4 py-2.5 shadow-lg">
            <svg className="h-3.5 w-3.5 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm text-body">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
