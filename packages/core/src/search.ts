import { nerdFontIcons } from "@tuicons/nerd-fonts";
import { semanticIcons } from "./semantic-icons.js";

export interface IconSearchResult {
  readonly name: string;
  readonly kind: "semantic" | "raw";
  readonly score: number;
  readonly aliases: readonly string[];
}

function score(value: string, query: string): number {
  if (value === query) return 100;
  if (value.startsWith(query)) return 75;
  if (value.includes(query)) return 50;
  const words = query.split(/[-\s]+/);
  return words.every((word) => value.includes(word)) ? 25 : 0;
}

export function searchIcons(query: string, limit = 20): readonly IconSearchResult[] {
  const normalized = query.trim().toLowerCase().replaceAll("_", "-");
  if (!normalized) return [];

  const semantic = semanticIcons.map((entry) => ({
    name: entry.name,
    kind: "semantic" as const,
    aliases: entry.aliases,
    score: Math.max(score(entry.name, normalized), ...entry.aliases.map((alias) => score(alias, normalized))) + 10,
  }));
  const raw = nerdFontIcons.map((entry) => ({
    name: entry.name,
    kind: "raw" as const,
    aliases: [] as readonly string[],
    score: Math.max(score(entry.name, normalized), score(entry.providerName, normalized)),
  }));

  return [...semantic, ...raw]
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, Math.max(0, limit));
}
