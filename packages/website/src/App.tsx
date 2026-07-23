import { useState, useMemo, useCallback, useRef, useEffect, type ReactNode } from "react";
import { semanticIcons, type SemanticIconDefinition } from "./icons";

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                    */
/* ------------------------------------------------------------------ */

const allCategories = [
  "media",
  "actions",
  "navigation",
  "status",
  "files",
  "development",
  "devices",
  "system",
  "brands",
  "music",
] as const;

function matchesQuery(icon: SemanticIconDefinition, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    icon.name.includes(q) ||
    icon.label.includes(q) ||
    icon.aliases.some((a) => a.includes(q)) ||
    icon.categories.some((c) => c.includes(q))
  );
}

function iconImportSnippet(name: string): string {
  return `import { icon } from "@tuicons/core";\nicon("${name}")`;
}

/* ------------------------------------------------------------------ */
/*  Toast hook                                                         */
/* ------------------------------------------------------------------ */

function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2000);
  }, []);

  return { toast, show };
}

/* ------------------------------------------------------------------ */
/*  Category color mapping                                             */
/* ------------------------------------------------------------------ */

const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  media:       { bg: "bg-blue-500/10",  text: "text-blue-400",  dot: "bg-blue-400" },
  actions:     { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  navigation:  { bg: "bg-violet-500/10",text: "text-violet-400",dot: "bg-violet-400" },
  status:      { bg: "bg-emerald-500/10",text: "text-emerald-400",dot: "bg-emerald-400" },
  files:       { bg: "bg-sky-500/10",   text: "text-sky-400",   dot: "bg-sky-400" },
  development: { bg: "bg-rose-500/10",  text: "text-rose-400",  dot: "bg-rose-400" },
  devices:     { bg: "bg-cyan-500/10",  text: "text-cyan-400",  dot: "bg-cyan-400" },
  system:      { bg: "bg-stone-500/10", text: "text-stone-400", dot: "bg-stone-400" },
  brands:      { bg: "bg-orange-500/10",text: "text-orange-400",dot: "bg-orange-400" },
  music:       { bg: "bg-pink-500/10",  text: "text-pink-400",  dot: "bg-pink-400" },
};

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Code block                                                         */
/* ------------------------------------------------------------------ */

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#1e1e32] bg-[#0d0d1a]">
      <pre className="overflow-x-auto p-4 sm:p-5">
        <code className="font-mono text-sm leading-relaxed text-gray-300">{code}</code>
      </pre>
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.04]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main app                                                           */
/* ------------------------------------------------------------------ */

export default function App() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const { toast, show: showToast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  /* Filter icons */
  const filtered = useMemo(() => {
    let result = semanticIcons;
    if (query) {
      result = result.filter((icon) => matchesQuery(icon, query));
    }
    if (activeCategory) {
      result = result.filter((icon) => icon.categories.includes(activeCategory));
    }
    return result;
  }, [query, activeCategory]);

  /* Copy handler */
  const handleCopy = useCallback(
    async (ic: SemanticIconDefinition) => {
      const snippet = iconImportSnippet(ic.name);
      try {
        await navigator.clipboard.writeText(snippet);
        setCopiedIcon(ic.name);
        showToast(`Copied import for "${ic.name}"`);
        setTimeout(() => setCopiedIcon(null), 1500);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = snippet;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopiedIcon(ic.name);
        showToast(`Copied import for "${ic.name}"`);
        setTimeout(() => setCopiedIcon(null), 1500);
      }
    },
    [showToast],
  );

  /* Keyboard shortcut: Cmd+K / Ctrl+K to focus search */
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
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {/* Background gradient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-500/3 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-500/3 blur-[120px]" />
      </div>

      <div className="relative">
        {/* ---- Hero ---- */}
        <Section className="pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="animate-fade-up text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-accent/20 bg-teal-accent/5 px-4 py-1.5 text-xs font-medium tracking-wide text-teal-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-accent" />
              v0.1.0 · 52 semantic icons
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-gray-100">Typed icons for </span>
              <span className="text-teal-accent">terminal interfaces</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#a0a0c0] sm:text-xl">
              Searchable, framework-agnostic terminal icons powered by Nerd Fonts,
              with safe Unicode and ASCII fallbacks. No more broken glyphs.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <a
                href="#browser"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2dd4bf] px-5 py-2.5 text-sm font-semibold text-[#0a0a0f] transition-all duration-200 hover:bg-[#14b8a6] hover:shadow-lg hover:shadow-[#2dd4bf]/20 active:scale-[0.97]"
              >
                Browse icons
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
              <a
                href="#install"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1e1e32] px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#2e2e4a] hover:bg-[#1a1a2e] active:scale-[0.97]"
              >
                Get started
              </a>
            </div>
          </div>
        </Section>

        {/* ---- Icon Browser ---- */}
        <Section id="browser" className="pb-24">
          <div className="animate-slide-up">
            {/* Search */}
            <div className="relative mb-6">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-[#7a7a9a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search icons by name, alias, or category…"
                className="w-full rounded-xl border border-[#1e1e32] bg-[#13131f] py-3.5 pl-11 pr-12 font-sans text-sm text-gray-100 placeholder-[#7a7a9a] outline-none transition-all duration-200 focus:border-[#2dd4bf]/40 focus:ring-1 focus:ring-[#2dd4bf]/20"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <kbd className="hidden rounded-md border border-[#1e1e32] bg-[#0a0a0f] px-1.5 py-0.5 font-mono text-[11px] text-[#7a7a9a] sm:inline-block">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Category chips */}
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  activeCategory === null
                    ? "bg-[#2dd4bf] text-[#0a0a0f]"
                    : "border border-[#1e1e32] bg-[#13131f] text-[#a0a0c0] hover:border-[#2e2e4a] hover:text-gray-200"
                }`}
              >
                All
              </button>
              {allCategories.map((cat) => {
                const col = categoryColors[cat];
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(isActive ? null : cat)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium capitalize transition-all duration-200 ${
                      isActive
                        ? `${col.bg} ${col.text} ring-1 ring-inset ring-current/30`
                        : "border border-[#1e1e32] bg-[#13131f] text-[#a0a0c0] hover:border-[#2e2e4a] hover:text-gray-200"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${col.dot}`} />
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Results count */}
            <div className="mb-4 text-sm text-[#7a7a9a]">
              {filtered.length} icon{filtered.length !== 1 ? "s" : ""}
              {activeCategory && (
                <span>
                  {" "}in <span className="font-medium capitalize text-[#a0a0c0]">{activeCategory}</span>
                </span>
              )}
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filtered.map((ic, idx) => (
                  <button
                    key={ic.name}
                    onClick={() => handleCopy(ic)}
                    className="group relative flex flex-col items-center gap-2 rounded-xl border border-[#1e1e32] bg-[#16162a] p-4 text-center transition-all duration-200 hover:border-[#2dd4bf]/30 hover:bg-[#1e1e36] hover:shadow-lg hover:shadow-[#2dd4bf]/5 active:scale-[0.97]"
                    style={{ animationDelay: `${(idx % 12) * 40}ms` }}
                  >
                    {/* Glyph — use unicode for browser rendering */}
                    <span className="font-mono text-2xl leading-none text-gray-100 transition-all duration-200 group-hover:text-[#2dd4bf] sm:text-3xl">
                      {ic.unicode}
                    </span>

                    {/* Name */}
                    <span className="w-full truncate text-xs font-medium text-gray-300">
                      {ic.name}
                    </span>

                    {/* ASCII fallback */}
                    <span className="font-mono text-[10px] text-[#7a7a9a]">
                      {ic.ascii}
                    </span>

                    {/* Copy indicator overlay */}
                    {copiedIcon === ic.name && (
                      <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#2dd4bf]/10 backdrop-blur-sm animate-fade-in">
                        <svg className="h-6 w-6 text-[#2dd4bf]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                    )}

                    {/* Category dots */}
                    <div className="flex flex-wrap justify-center gap-1">
                      {ic.categories.map((cat) => (
                        <span
                          key={cat}
                          className={`inline-block h-1.5 w-1.5 rounded-full ${categoryColors[cat]?.dot ?? "bg-gray-500"}`}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1e1e32] py-20 text-center">
                <svg className="mb-3 h-10 w-10 text-[#7a7a9a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-[#7a7a9a]">No icons match your search.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveCategory(null);
                    searchRef.current?.focus();
                  }}
                  className="mt-2 text-sm text-[#2dd4bf] transition-colors hover:text-[#14b8a6]"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </Section>

        {/* ---- How It Works ---- */}
        <Section className="border-t border-[#1e1e32] pb-24 pt-16">
          <div className="animate-fade-up">
            <h2 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl">
              Three rendering modes
            </h2>
            <p className="mt-3 max-w-xl text-[#a0a0c0]">
              TUIcons automatically selects the best rendering mode for the user's terminal,
              or you can explicitly choose one.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  mode: "Unicode",
                  badge: "Safe default",
                  badgeColor: "bg-emerald-500/10 text-emerald-400",
                  glyph: "▶",
                  desc: "Uses standard Unicode codepoints that render in virtually every terminal. The safest choice when you don't know the user's font setup.",
                  code: `icon("play", { mode: "unicode" })`,
                  result: '→ "▶"',
                },
                {
                  mode: "Nerd Font",
                  badge: "Full fidelity",
                  badgeColor: "bg-[#2dd4bf]/10 text-[#2dd4bf]",
                  glyph: "▶",
                  desc: "Renders the authentic Nerd Font glyph when the user has a compatible font installed. Provides the richest visual experience.",
                  code: `icon("play", { mode: "nerd-font" })`,
                  result: '→ "▶"',
                },
                {
                  mode: "ASCII",
                  badge: "Max compatibility",
                  badgeColor: "bg-amber-500/10 text-amber-400",
                  glyph: ">",
                  desc: "Pure ASCII fallback for the most constrained environments. Useful for logs, serial terminals, or accessibility scenarios.",
                  code: `icon("play", { mode: "ascii" })`,
                  result: '→ ">"',
                },
              ].map((item) => (
                <div
                  key={item.mode}
                  className="group rounded-xl border border-[#1e1e32] bg-[#16162a] p-6 transition-all duration-200 hover:border-[#2e2e4a] hover:bg-[#1e1e36]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <span className="font-mono text-2xl text-[#a0a0c0] transition-colors duration-200 group-hover:text-[#2dd4bf]">
                      {item.glyph}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-100">{item.mode}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-[#a0a0c0]">{item.desc}</p>
                  <CodeBlock code={item.code} />
                  <p className="mt-2 text-xs text-[#7a7a9a]">{item.result}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ---- Installation ---- */}
        <Section id="install" className="border-t border-[#1e1e32] pb-24 pt-16">
          <div className="animate-fade-up">
            <h2 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl">
              Installation
            </h2>
            <p className="mt-3 max-w-xl text-[#a0a0c0]">
              Add TUIcons to any project with a single command.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-300">npm</h3>
                <CodeBlock code="npm install @tuicons/core" />
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-300">pnpm</h3>
                <CodeBlock code="pnpm add @tuicons/core" />
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-300">yarn</h3>
                <CodeBlock code="yarn add @tuicons/core" />
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-300">bun</h3>
                <CodeBlock code="bun add @tuicons/core" />
              </div>
            </div>

            <div className="mt-10">
              <h3 className="mb-3 text-sm font-medium text-gray-300">Basic usage</h3>
              <CodeBlock
                code={`import { icon } from "@tuicons/core";\n\n// Auto mode (Unicode by default — safe)\nicon("play");          // → "▶"\nicon("folder");        // → "▣"\nicon("heart-filled");  // → "♥"\n\n// Explicit mode\nicon("play", { mode: "nerd-font" });  // → Nerd Font glyph\nicon("play", { mode: "ascii" });      // → ">"\nicon("play", { mode: "unicode" });    // → "▶"\n\n// Aliases work too\nicon("start");  // → "▶" (alias for "play")`}
              />
            </div>
          </div>
        </Section>

        {/* ---- Footer ---- */}
        <footer className="border-t border-[#1e1e32]">
          <Section className="py-10">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-[#7a7a9a]">
                Built with{" "}
                <span className="text-[#2dd4bf]">❤</span>{" "}
                for terminal developers
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/rexroze/tuicons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#7a7a9a] transition-colors hover:text-gray-200"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://www.npmjs.com/package/@tuicons/core"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#7a7a9a] transition-colors hover:text-gray-200"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.838h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
                  </svg>
                  npm
                </a>
              </div>
            </div>
          </Section>
        </footer>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-scale-in">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-[#2dd4bf]/20 bg-[#13131f] px-5 py-3 shadow-xl shadow-[#2dd4bf]/5 backdrop-blur-sm">
            <svg className="h-4 w-4 text-[#2dd4bf]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm text-gray-200">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
