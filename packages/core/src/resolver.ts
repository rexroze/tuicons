import { nerdFontIconMap } from "@tuicons/nerd-fonts";
import { resolveMode } from "./environment.js";
import { semanticIconMap } from "./semantic-icons.js";
import type { ResolveIconOptions, ResolvedIcon } from "./types.js";

export function resolveIcon(name: string, options: ResolveIconOptions = {}): ResolvedIcon {
  const mode = resolveMode(options.mode, options.env);
  const normalized = name.trim().toLowerCase().replaceAll("_", "-");
  const semantic = semanticIconMap.get(normalized);

  if (semantic) {
    if (mode === "nerd-font") {
      const raw = nerdFontIconMap[semantic.nerdFont as keyof typeof nerdFontIconMap];
      return { name: semantic.name, glyph: raw?.glyph ?? semantic.unicode, mode: raw ? mode : "unicode", label: semantic.label };
    }
    return { name: semantic.name, glyph: semantic[mode], mode, label: semantic.label };
  }

  const rawName = normalized.startsWith("nf-") ? normalized : `nf-${normalized}`;
  const raw = nerdFontIconMap[rawName as keyof typeof nerdFontIconMap];
  if (raw && mode === "nerd-font") return { name: raw.name, glyph: raw.glyph, mode, label: raw.providerName.replaceAll("-", " ") };

  return { name: normalized, glyph: options.unknown ?? "?", mode: mode === "nerd-font" ? "unicode" : mode, label: normalized.replaceAll("-", " ") };
}

export function icon(name: string, options?: ResolveIconOptions): string {
  return resolveIcon(name, options).glyph;
}
