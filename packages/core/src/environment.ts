import type { IconMode, ResolvedIconMode } from "./types.js";

export function resolveMode(
  requested: IconMode = "auto",
  env: Readonly<Record<string, string | undefined>> = process.env,
): ResolvedIconMode {
  if (requested !== "auto") return requested;

  const configured = env.TUICONS_MODE;
  if (configured === "nerd-font" || configured === "unicode" || configured === "ascii") return configured;

  // A process cannot inspect the glyphs rendered by its terminal. Safe Unicode
  // avoids private-use glyphs unless the user explicitly opts into them.
  return "unicode";
}
