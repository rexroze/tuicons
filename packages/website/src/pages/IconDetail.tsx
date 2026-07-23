import { useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { semanticIcons } from "../icons";

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

const MODE_PALETTE = ["bg-rose-500/10", "bg-amber-500/10", "bg-emerald-500/10",
  "bg-sky-500/10", "bg-violet-500/10", "bg-cyan-500/10",
  "bg-fuchsia-500/10", "bg-lime-500/10", "bg-orange-500/10", "bg-indigo-500/10"];

export default function IconDetail() {
  const { name } = useParams<{ name: string }>();
  const { toast, show } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const icon = semanticIcons.find((i) => i.name === name);

  const handleCopy = useCallback(async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(label);
    show(`Copied: ${label}`);
    setTimeout(() => setCopied(null), 1200);
  }, [show]);

  if (!icon) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <span className="font-mono text-5xl text-muted/40">?</span>
        <p className="mt-4 text-sm text-muted">Icon "{name}" not found.</p>
        <Link to="/icons" className="mt-4 text-sm text-accent transition-colors hover:text-accent/80">Browse all icons</Link>
      </div>
    );
  }

  const importSnippet = `import { icon } from "@tuicons/core";\nicon("${icon.name}")`;
  const resolverSnippet = `import { resolveIcon } from "@tuicons/core";\nresolveIcon("${icon.name}")`;
  const nerdFontSnippet = `icon("${icon.name}", { mode: "nerd-font" })`;
  const asciiSnippet = `icon("${icon.name}", { mode: "ascii" })`;

  // Find related icons (same categories)
  const related = semanticIcons
    .filter((i) => i.name !== icon.name && i.categories.some((c) => icon.categories.includes(c)))
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-muted">
        <Link to="/icons" className="transition-colors hover:text-body">Icons</Link>
        <span className="text-muted/40">/</span>
        <span className="text-body font-medium">{icon.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Large glyph preview */}
        <div className="flex shrink-0 items-center justify-center rounded-xl border border-edge bg-surface p-8 lg:p-12">
          <span className="font-mono text-7xl leading-none text-body sm:text-8xl lg:text-9xl">{icon.unicode}</span>
        </div>

        {/* Metadata */}
        <div className="flex-1">
          <h1 className="font-mono text-2xl font-bold text-body sm:text-3xl">{icon.name}</h1>

          {/* Categories */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {icon.categories.map((cat, i) => (
              <span key={cat} className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium capitalize ${MODE_PALETTE[i % MODE_PALETTE.length]} text-body/70`}>
                <span className={`h-1 w-1 rounded-full bg-current opacity-60`} />
                {cat}
              </span>
            ))}
          </div>

          {/* Aliases */}
          {icon.aliases.length > 0 && (
            <p className="mt-2 text-xs text-muted">
              Also known as: <span className="text-body/60">{icon.aliases.join(", ")}</span>
            </p>
          )}

          {/* Nerd Font key */}
          <p className="mt-1 font-mono text-[10px] text-muted/50">{icon.nerdFont}</p>

          {/* Copy buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: "Copy import", text: importSnippet, key: "import" },
              { label: "Copy Nerd Font", text: nerdFontSnippet, key: "nerd" },
              { label: "Copy ASCII", text: asciiSnippet, key: "ascii" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => handleCopy(btn.text, btn.label)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  copied === btn.label
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-edge text-muted hover:text-body hover:border-muted/40"
                }`}
              >
                {copied === btn.label ? (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                )}
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mode comparison */}
      <section className="mt-12 border-t border-edge pt-10">
        <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase">Modes</h2>
        <p className="mt-1 text-xs text-muted">How this icon renders in each fallback mode.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { mode: "nerd-font", glyph: icon.unicode, label: "The glyph rendered by a Nerd Font", code: nerdFontSnippet },
            { mode: "unicode", glyph: icon.unicode, label: "Safe Unicode fallback (default)", code: importSnippet },
            { mode: "ascii", glyph: icon.ascii, label: "Maximum compatibility ASCII fallback", code: asciiSnippet },
          ].map((m) => (
            <div key={m.mode} className="flex flex-col items-center gap-2 rounded-lg border border-edge bg-surface p-5 text-center">
              <span className="font-mono text-4xl leading-none text-body">{m.glyph}</span>
              <span className="text-[10px] font-medium text-body/60">{m.mode}</span>
              <span className="text-[9px] leading-tight text-muted/50">{m.label}</span>
              <button
                onClick={() => handleCopy(m.code, `Copy ${m.mode}`)}
                className="mt-1 rounded border border-edge px-2 py-0.5 font-mono text-[9px] text-muted transition-colors hover:text-body"
              >
                Copy code
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Code snippets */}
      <section className="mt-10">
        <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase">Usage</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-edge bg-surface">
          <div className="border-b border-edge px-4 py-2 font-mono text-[10px] tracking-wider text-muted/60">Basic import</div>
          <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-body">
            <code>{importSnippet}</code>
          </pre>
        </div>
        <div className="mt-3 overflow-hidden rounded-lg border border-edge bg-surface">
          <div className="border-b border-edge px-4 py-2 font-mono text-[10px] tracking-wider text-muted/60">Resolver (with metadata)</div>
          <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-body">
            <code>{resolverSnippet}</code>
          </pre>
        </div>
      </section>

      {/* Related icons */}
      {related.length > 0 && (
        <section className="mt-12 border-t border-edge pt-10">
          <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase">Related icons</h2>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {related.map((ic) => (
              <Link
                key={ic.name}
                to={`/icons/${ic.name}`}
                className="group flex flex-col items-center gap-1 rounded-lg border border-edge bg-surface p-3 text-center transition-all hover:border-accent/30 hover:shadow-sm"
              >
                <span className="font-mono text-2xl leading-none text-body transition-colors group-hover:text-accent">{ic.unicode}</span>
                <span className="w-full truncate text-[10px] font-medium text-muted transition-colors group-hover:text-body/80">{ic.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

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
