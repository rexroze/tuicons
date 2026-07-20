import type { IconMode, ResolvedIconMode } from "./types.js";

export function resolveMode(
  requested: IconMode = "auto",
  env: Readonly<Record<string, string | undefined>> = process.env,
): ResolvedIconMode {
  if (requested !== "auto") return requested;

  const configured = env.TUICONS_MODE;
  if (configured === "nerd-font" || configured === "unicode" || configured === "ascii") return configured;
  if (env.TERM === "linux" || env.NO_COLOR !== undefined) return "ascii";

  // A process cannot inspect the glyphs rendered by its terminal. Safe Unicode
  // is the only default that can uphold the no-missing-glyph-box guarantee.
  return "unicode";
}
