import { useMemo, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { semanticIcons, type SemanticIconDefinition } from "../icons";

const allCategories = [...new Set(semanticIcons.flatMap((i) => i.categories))].sort();

function matchesQuery(icon: SemanticIconDefinition, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return icon.name.includes(q) || icon.label.includes(q) || icon.categories.some((c) => c.includes(q));
}

const CAT_DOT = [
  "bg-rose-400", "bg-amber-400", "bg-emerald-400", "bg-sky-400", "bg-violet-400",
  "bg-cyan-400", "bg-fuchsia-400", "bg-lime-400", "bg-orange-400", "bg-indigo-400",
];
const CAT_BG = [
  "bg-rose-500/10 text-rose-400", "bg-amber-500/10 text-amber-400",
  "bg-emerald-500/10 text-emerald-400", "bg-sky-500/10 text-sky-400",
  "bg-violet-500/10 text-violet-400", "bg-cyan-500/10 text-cyan-400",
  "bg-fuchsia-500/10 text-fuchsia-400", "bg-lime-500/10 text-lime-400",
  "bg-orange-500/10 text-orange-400", "bg-indigo-500/10 text-indigo-400",
];
function catDot(cat: string) { return CAT_DOT[allCategories.indexOf(cat) % CAT_DOT.length]!; }
function catBg(cat: string) { return CAT_BG[allCategories.indexOf(cat) % CAT_BG.length]!; }

export default function Icons() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const activeCat = searchParams.get("cat") ?? null;
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
      {/* Sidebar */}
      <aside className="hidden w-44 shrink-0 lg:block">
        <nav className="sticky top-[61px] space-y-0.5">
          <button
            onClick={() => setActiveCat(null)}
            className={`block w-full rounded-md px-3 py-1.5 text-left text-xs font-medium transition-colors ${
              activeCat === null ? "bg-accent/10 text-accent" : "text-muted hover:text-body"
            }`}
          >All icons</button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(activeCat === cat ? null : cat)}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-medium capitalize transition-colors ${
                activeCat === cat ? "bg-surface text-body ring-1 ring-edge" : "text-muted hover:text-body hover:bg-surface/50"
              }`}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${catDot(cat)}`} />{cat}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
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

        {/* Chips (mobile) */}
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveCat(null)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeCat === null ? "bg-accent text-bg" : "border border-edge text-muted hover:text-body"
            }`}
          >All</button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(activeCat === cat ? null : cat)}
              className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                activeCat === cat ? `${catBg(cat)} ring-1 ring-inset ring-current/20` : "border border-edge text-muted hover:text-body"
              }`}
            >
              <span className={`h-1 w-1 rounded-full ${catDot(cat)}`} />{cat}
            </button>
          ))}
        </div>

        <p className="mb-4 text-xs text-muted">
          {filtered.length} icon{filtered.length !== 1 ? "s" : ""}
          {activeCat && <span> in <span className="font-medium capitalize text-body/60">{activeCat}</span></span>}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((ic) => (
              <Link
                key={ic.name}
                to={`/icons/${ic.name}`}
                className="group flex flex-col items-center gap-1 rounded-lg border border-edge bg-surface p-3 text-center transition-all hover:border-accent/30 hover:shadow-sm active:scale-[0.97]"
              >
                <span className="font-mono text-3xl leading-none text-body transition-colors group-hover:text-accent sm:text-4xl md:text-5xl">{ic.unicode}</span>
                <span className="w-full truncate text-[11px] font-medium leading-tight text-body/60 transition-colors group-hover:text-body/90">{ic.name}</span>
                <span className="font-mono text-[9px] leading-tight text-muted/50">{ic.ascii}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-edge py-20 text-center">
            <p className="text-sm text-muted">No icons match.</p>
            <button onClick={() => { setQuery(""); setActiveCat(null); searchRef.current?.focus(); }} className="mt-2 text-sm text-accent transition-colors hover:text-accent/80">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
