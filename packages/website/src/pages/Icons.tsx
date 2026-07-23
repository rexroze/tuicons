import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { semanticIcons, type SemanticIconDefinition } from "../icons";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const allCategories = [...new Set(semanticIcons.flatMap((i) => i.categories))].sort();

function matchesQuery(icon: SemanticIconDefinition, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return icon.name.includes(q) || icon.label.includes(q) || icon.categories.some((c) => c.includes(q));
}

const CAT_PALETTE = [
  "bg-rose-500/10 text-rose-400", "bg-amber-500/10 text-amber-400",
  "bg-emerald-500/10 text-emerald-400", "bg-sky-500/10 text-sky-400",
  "bg-violet-500/10 text-violet-400", "bg-cyan-500/10 text-cyan-400",
  "bg-fuchsia-500/10 text-fuchsia-400", "bg-lime-500/10 text-lime-400",
  "bg-orange-500/10 text-orange-400", "bg-indigo-500/10 text-indigo-400",
];
const CAT_DOT = [
  "bg-rose-400", "bg-amber-400", "bg-emerald-400", "bg-sky-400", "bg-violet-400",
  "bg-cyan-400", "bg-fuchsia-400", "bg-lime-400", "bg-orange-400", "bg-indigo-400",
];
function catStyle(cat: string, field: "colors" | "dot") {
  const i = allCategories.indexOf(cat);
  return (field === "colors" ? CAT_PALETTE : CAT_DOT)[i % 10]!;
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

/* ================================================================== */
/*  Icons Page                                                         */
/* ================================================================== */

export default function Icons() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const activeCat = searchParams.get("cat") ?? null;
  const [copied, setCopied] = useState<string | null>(null);
  const { toast, show } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  const setQuery = (q: string) => {
    const p = new URLSearchParams(searchParams);
    if (q) p.set("q", q); else p.delete("q");
    setSearchParams(p, { replace: true });
  };
  const setActiveCat = (cat: string | null) => {
    const p = new URLSearchParams(searchParams);
    if (cat) p.set("cat", cat); else p.delete("cat");
    setSearchParams(p, { replace: true });
  };

  const filtered = useMemo(() => {
    let r = semanticIcons;
    if (query) r = r.filter((i) => matchesQuery(i, query));
    if (activeCat) r = r.filter((i) => i.categories.includes(activeCat));
    return r;
  }, [query, activeCat]);

  const handleCopy = useCallback(async (name: string) => {
    const code = `import { icon } from "@tuicons/core";\nicon("${name}")`;
    try { await navigator.clipboard.writeText(code); } catch { /* fallback */ }
    setCopied(name);
    show(`Copied: icon("${name}")`);
    setTimeout(() => setCopied(null), 1200);
  }, [show]);

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

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 pt-6 pb-16 sm:px-6">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-44 shrink-0 lg:block">
        <nav className="sticky top-[61px] space-y-0.5">
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
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${catStyle(cat, "dot")}`} />
                {cat}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
        {/* Search */}
        <div className="relative mb-4">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${semanticIcons.length} icons…`}
            aria-label="Search icons"
            className="w-full rounded-lg border border-edge bg-surface py-2 pl-9 pr-3 text-sm text-body placeholder-muted outline-none transition-colors focus:border-accent/50"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-edge bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline-block">⌘K</kbd>
        </div>

        {/* Category chips (mobile) */}
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveCat(null)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeCat === null ? "bg-accent text-bg" : "border border-edge text-muted hover:text-body"
            }`}
          >All</button>
          {allCategories.map((cat) => {
            const isActive = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(isActive ? null : cat)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  isActive ? `${catStyle(cat, "colors")} ring-1 ring-inset ring-current/20` : "border border-edge text-muted hover:text-body"
                }`}
              >
                <span className={`h-1 w-1 rounded-full ${catStyle(cat, "dot")}`} />{cat}
              </button>
            );
          })}
        </div>

        {/* Count */}
        <p className="mb-4 text-xs text-muted">
          {filtered.length} icon{filtered.length !== 1 ? "s" : ""}
          {activeCat && <span> in <span className="font-medium capitalize text-body/60">{activeCat}</span></span>}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((ic) => (
              <button
                key={ic.name}
                onClick={() => handleCopy(ic.name)}
                className="group relative flex flex-col items-center gap-1 rounded-lg border border-edge bg-surface p-3 text-center transition-all hover:border-accent/30 hover:shadow-sm active:scale-[0.97]"
              >
                <Link
                  to={`/icons/${ic.name}`}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 right-2 rounded p-1 text-muted/40 opacity-0 transition-all hover:text-muted group-hover:opacity-100"
                  title="View details"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <span className="font-mono text-3xl leading-none text-body transition-colors group-hover:text-accent sm:text-4xl md:text-5xl">
                  {ic.unicode}
                </span>
                <span className="w-full truncate text-[11px] font-medium leading-tight text-body/60 transition-colors group-hover:text-body/90">{ic.name}</span>
                <span className="font-mono text-[9px] leading-tight text-muted/50">{ic.ascii}</span>
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
            <p className="text-sm text-muted">No icons match.</p>
            <button onClick={() => { setQuery(""); setActiveCat(null); searchRef.current?.focus(); }} className="mt-2 text-sm text-accent transition-colors hover:text-accent/80">Clear filters</button>
          </div>
        )}
      </div>

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
    </div>
  );
}
