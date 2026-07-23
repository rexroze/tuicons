import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { semanticIcons, type SemanticIconDefinition } from "./icons";

const allCategories = [...new Set(semanticIcons.flatMap((i) => i.categories))].sort();

function matchesQuery(icon: SemanticIconDefinition, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return icon.name.includes(q) || icon.label.includes(q) || icon.aliases.some((a) => a.includes(q)) || icon.categories.some((c) => c.includes(q));
}

function iconImportSnippet(name: string): string {
  return `import { icon } from "@tuicons/core";\nicon("${name}")`;
}

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

const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  media: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  actions: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  navigation: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
  status: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  files: { bg: "bg-sky-500/10", text: "text-sky-400", dot: "bg-sky-400" },
  development: { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400" },
  devices: { bg: "bg-cyan-500/10", text: "text-cyan-400", dot: "bg-cyan-400" },
  system: { bg: "bg-stone-500/10", text: "text-stone-400", dot: "bg-stone-400" },
  brands: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  music: { bg: "bg-pink-500/10", text: "text-pink-400", dot: "bg-pink-400" },
  arrows: { bg: "bg-indigo-500/10", text: "text-indigo-400", dot: "bg-indigo-400" },
  communication: { bg: "bg-teal-500/10", text: "text-teal-400", dot: "bg-teal-400" },
  people: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-400", dot: "bg-fuchsia-400" },
  security: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  weather: { bg: "bg-cyan-500/10", text: "text-cyan-400", dot: "bg-cyan-400" },
  time: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  shapes: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
  design: { bg: "bg-pink-500/10", text: "text-pink-400", dot: "bg-pink-400" },
  buildings: { bg: "bg-stone-500/10", text: "text-stone-400", dot: "bg-stone-400" },
  transportation: { bg: "bg-lime-500/10", text: "text-lime-400", dot: "bg-lime-400" },
  commerce: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  health: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  food: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  gaming: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
  text: { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400" },
  math: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  layout: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" },
  connectivity: { bg: "bg-teal-500/10", text: "text-teal-400", dot: "bg-teal-400" },
  accessibility: { bg: "bg-sky-500/10", text: "text-sky-400", dot: "bg-sky-400" },
  science: { bg: "bg-indigo-500/10", text: "text-indigo-400", dot: "bg-indigo-400" },
  nature: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  seasons: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
};
const defaultCategoryColor = { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" };

export default function App() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const { toast, show: showToast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    let result = semanticIcons;
    if (query) result = result.filter((icon) => matchesQuery(icon, query));
    if (activeCategory) result = result.filter((icon) => icon.categories.includes(activeCategory));
    return result;
  }, [query, activeCategory]);

  const handleCopy = useCallback(
    async (ic: SemanticIconDefinition) => {
      const snippet = iconImportSnippet(ic.name);
      try {
        await navigator.clipboard.writeText(snippet);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = snippet;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedIcon(ic.name);
      showToast(`Copied import for "${ic.name}"`);
      setTimeout(() => setCopiedIcon(null), 1500);
    },
    [showToast],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* ---- Intro ---- */}
      <header className="mx-auto max-w-6xl px-4 pt-14 pb-6 sm:pt-20 sm:pb-8">
        <div className="inline-flex items-center gap-2 rounded-sm border border-accent/20 bg-accent/5 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
          v0.1.0 · {semanticIcons.length} semantic icons
        </div>
        <h1 className="mt-4 font-mono text-2xl font-bold leading-tight text-body sm:text-3xl">
          Typed icons for terminal interfaces
        </h1>
        <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-muted sm:text-base">
          Searchable, framework-agnostic terminal icons powered by Nerd&nbsp;Fonts,
          with safe Unicode and ASCII fallbacks. No more broken glyphs.
        </p>
      </header>

      {/* ---- Sticky search bar ---- */}
      <div className="sticky top-0 z-40 border-b border-edge bg-bg/85 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-4 py-2.5">
          <div className="relative">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons by name, alias, or category…"
              aria-label="Search icons"
              className="w-full rounded-sm border border-edge bg-surface py-2 pl-3 pr-8 font-sans text-sm text-body placeholder-muted outline-none transition-colors focus:border-accent/40"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
              <kbd className="hidden rounded-sm border border-edge bg-bg px-1 py-0.5 font-mono text-[10px] text-muted sm:inline-block">⌘K</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Category chips (horizontal scroll, single row) ---- */}
      <div className="mx-auto max-w-6xl px-4 pt-3">
        <div className="flex gap-1.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-sm px-2.5 py-1 font-sans text-xs font-medium capitalize transition-colors ${
              activeCategory === null
                ? "bg-accent text-bg"
                : "border border-edge text-muted hover:text-body"
            }`}
          >
            All
          </button>
          {allCategories.map((cat) => {
            const col = categoryColors[cat] ?? defaultCategoryColor;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-sm px-2.5 py-1 font-sans text-xs font-medium capitalize transition-colors ${
                  isActive
                    ? `${col.bg} ${col.text} ring-1 ring-inset ring-current/30`
                    : "border border-edge text-muted hover:text-body"
                }`}
              >
                <span className={`h-1 w-1 rounded-full ${col.dot}`} />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- Icon grid ---- */}
      <main className="mx-auto max-w-6xl px-4 pt-4 pb-16">
        <div className="mb-4 font-sans text-xs text-muted">
          {filtered.length} icon{filtered.length !== 1 ? "s" : ""}
          {activeCategory && <span> in <span className="font-medium capitalize text-body/60">{activeCategory}</span></span>}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((ic, idx) => (
              <button
                key={ic.name}
                onClick={() => handleCopy(ic)}
                className="group relative flex animate-card-in flex-col items-center gap-0.5 rounded-sm border border-edge bg-surface p-3 text-center transition-colors hover:border-accent/30 hover:bg-hover active:scale-[0.97]"
                style={{ animationDelay: `${(idx % 12) * 30}ms` }}
              >
                <span className="font-mono text-4xl leading-none text-body transition-colors group-hover:text-accent sm:text-5xl lg:text-6xl">
                  {ic.unicode}
                </span>
                <span className="mt-0.5 w-full truncate text-[11px] font-medium leading-tight text-body/70 transition-colors group-hover:text-body">
                  {ic.name}
                </span>
                <span className="font-mono text-[9px] leading-tight text-muted">{ic.ascii}</span>
                {ic.categories.length > 0 && (
                  <div className="mt-0.5 flex flex-wrap justify-center gap-[3px]">
                    {ic.categories.slice(0, 4).map((cat) => (
                      <span key={cat} className={`inline-block h-1 w-1 rounded-full ${categoryColors[cat]?.dot ?? "bg-muted"}`} />
                    ))}
                  </div>
                )}
                {copiedIcon === ic.name && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-sm bg-accent/10 backdrop-blur-sm animate-fade-in">
                    <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-edge py-24 text-center">
            <svg className="mb-4 h-8 w-8 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <p className="text-sm text-muted">No icons match your search.</p>
            <button
              onClick={() => { setQuery(""); setActiveCategory(null); searchRef.current?.focus(); }}
              className="mt-2 text-sm text-accent transition-colors hover:text-accent/80"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ---- Install section ---- */}
        <section className="mt-20 border-t border-edge pt-12">
          <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase">Installation</h2>
          <div className="mt-4 overflow-hidden rounded-sm border border-edge bg-surface">
            <div className="border-b border-edge px-4 py-2 font-mono text-[10px] tracking-wider text-muted">Terminal</div>
            <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-body">
              <code>npm install @tuicons/core</code>
            </pre>
          </div>
          <div className="mt-3 overflow-hidden rounded-sm border border-edge bg-surface">
            <div className="border-b border-edge px-4 py-2 font-mono text-[10px] tracking-wider text-muted">Usage</div>
            <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-body">
{`import { icon } from "@tuicons/core";

icon("play");                       // ▶
icon("play", { mode: "nerd-font" }); // NerdFont glyph
icon("folder", { mode: "ascii" });   // [D]`}
            </pre>
          </div>
          <p className="mt-4 font-sans text-xs leading-relaxed text-muted/60">
            All {semanticIcons.length} icons render as single Unicode codepoints with automatic Nerd Font and ASCII fallback. Designed for terminal interfaces.
          </p>
        </section>
      </main>

      {/* ---- Footer ---- */}
      <footer className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <p className="font-sans text-xs text-muted">TUIcons<span className="text-muted/40"> · </span>v0.1.0</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/rexroze/tuicons" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-sans text-xs text-muted transition-colors hover:text-body">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/@tuicons/core" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-sans text-xs text-muted transition-colors hover:text-body">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.838h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" /></svg>
              npm
            </a>
          </div>
        </div>
      </footer>

      {/* ---- Toast ---- */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-scale-in">
          <div className="inline-flex items-center gap-2 rounded-sm border border-accent/20 bg-surface px-4 py-2.5 shadow-lg shadow-accent/5">
            <svg className="h-3.5 w-3.5 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="font-sans text-sm text-body">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
