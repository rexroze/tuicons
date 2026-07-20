import type { SemanticIconDefinition } from "./types.js";

const define = (
  name: string,
  nerdFont: string,
  unicode: string,
  ascii: string,
  categories: readonly string[],
  aliases: readonly string[] = [],
): SemanticIconDefinition => ({ name, nerdFont, unicode, ascii, categories, aliases, label: name.replaceAll("-", " ") });

export const semanticIcons = [
  define("play", "nf-md-play", "▶", ">", ["media", "actions"], ["start", "resume"]),
  define("pause", "nf-md-pause", "Ⅱ", "||", ["media", "actions"]),
  define("stop", "nf-md-stop", "■", "[]", ["media", "actions"]),
  define("skip-forward", "nf-md-skip-next", "≫", ">|", ["media"], ["next"]),
  define("skip-back", "nf-md-skip-previous", "≪", "|<", ["media"], ["previous"]),
  define("shuffle", "nf-md-shuffle", "⇄", "~>", ["media"]),
  define("repeat", "nf-md-repeat", "↻", "@", ["media", "actions"]),
  define("volume-high", "nf-md-volume-high", "◖", "))", ["media", "devices"], ["sound"]),
  define("volume-off", "nf-md-volume-off", "×", "x", ["media", "devices"], ["mute", "muted"]),
  define("music", "nf-md-music", "♪", "*", ["media", "music"], ["song"]),
  define("playlist", "nf-md-playlist-music", "≋", "=", ["media", "music"], ["queue"]),
  define("heart", "nf-md-heart-outline", "♡", "<3", ["status"], ["like", "favorite"]),
  define("heart-filled", "nf-md-heart", "♥", "<3", ["status"], ["liked", "favorite-filled"]),
  define("home", "nf-md-home", "⌂", "H", ["navigation"]),
  define("search", "nf-md-magnify", "⌕", "?", ["actions", "navigation"], ["find"]),
  define("settings", "nf-md-cog", "⚙", "*", ["actions", "system"], ["preferences", "config"]),
  define("menu", "nf-md-menu", "≡", "=", ["navigation"]),
  define("close", "nf-md-close", "×", "x", ["actions", "status"], ["cancel"]),
  define("check", "nf-md-check", "✓", "+", ["actions", "status"], ["success", "done"]),
  define("warning", "nf-md-alert", "▲", "!", ["status"], ["alert"]),
  define("info", "nf-md-information", "ⓘ", "i", ["status"]),
  define("help", "nf-md-help-circle", "?", "?", ["status"], ["question"]),
  define("plus", "nf-md-plus", "+", "+", ["actions"], ["add", "create"]),
  define("minus", "nf-md-minus", "−", "-", ["actions"], ["remove"]),
  define("edit", "nf-md-pencil", "✎", "~", ["actions"], ["pencil"]),
  define("trash", "nf-md-trash-can", "⌫", "x", ["actions"], ["delete", "bin"]),
  define("download", "nf-md-download", "↓", "v", ["actions"]),
  define("upload", "nf-md-upload", "↑", "^", ["actions"]),
  define("refresh", "nf-md-refresh", "↻", "@", ["actions"]),
  define("folder", "nf-md-folder", "▣", "[D]", ["files"]),
  define("folder-open", "nf-md-folder-open", "▤", "[D]", ["files"]),
  define("file", "nf-md-file", "□", "[F]", ["files"]),
  define("file-code", "nf-md-file-code", "◇", "</>", ["files", "development"]),
  define("terminal", "nf-md-console", ">_", ">_", ["development", "system"], ["console", "shell"]),
  define("github", "nf-dev-github", "GH", "GH", ["brands", "development"]),
  define("git", "nf-dev-git", "G", "git", ["development"]),
  define("docker", "nf-dev-docker", "D", "docker", ["brands", "development"]),
  define("database", "nf-md-database", "▦", "DB", ["development", "system"]),
  define("wifi", "nf-md-wifi", "⌁", "wifi", ["devices", "system"]),
  define("battery", "nf-md-battery", "▰", "bat", ["devices", "system"]),
] as const satisfies readonly SemanticIconDefinition[];

export type SemanticIconName = (typeof semanticIcons)[number]["name"];

export const semanticIconMap = new Map<string, SemanticIconDefinition>();
for (const definition of semanticIcons) {
  semanticIconMap.set(definition.name, definition);
  for (const alias of definition.aliases) semanticIconMap.set(alias, definition);
}
