#!/usr/bin/env node
import { icon, nerdFontsVersion, searchIcons, semanticIcons } from "@tuicons/core";
import type { IconMode } from "@tuicons/core";
import { detectTerminal, setupAdvice } from "./index.js";

const [, , command = "help", ...args] = process.argv;

function option(name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function mode(): IconMode {
  const value = option("--mode");
  return value === "nerd-font" || value === "unicode" || value === "ascii" || value === "auto" ? value : "auto";
}

switch (command) {
  case "search": {
    const query = args.find((arg) => !arg.startsWith("--") && arg !== option("--limit") && arg !== option("--mode"));
    if (!query) fail("Usage: tuicons search <query> [--mode nerd-font|unicode|ascii] [--limit 20]");
    const limit = Number.parseInt(option("--limit") ?? "20", 10);
    for (const result of searchIcons(query!, Number.isFinite(limit) ? limit : 20)) {
      console.log(`${icon(result.name, { mode: mode() })}  ${result.name}${result.kind === "raw" ? "  [raw]" : ""}`);
    }
    break;
  }
  case "show": {
    const name = args.find((arg) => !arg.startsWith("--") && arg !== option("--mode"));
    if (!name) fail("Usage: tuicons show <name> [--mode nerd-font|unicode|ascii]");
    console.log(icon(name!, { mode: mode() }));
    break;
  }
  case "list": {
    for (const entry of semanticIcons) console.log(`${icon(entry.name, { mode: mode() })}  ${entry.name}`);
    break;
  }
  case "doctor":
  case "setup": {
    const info = detectTerminal();
    console.log("TUIcons compatibility check\n");
    console.log(`Terminal: ${info.terminal}`);
    console.log(`SSH session: ${info.isSsh ? "yes" : "no"}`);
    console.log(`Nerd Fonts registry: ${nerdFontsVersion}`);
    console.log(`Configured mode: ${info.configuredMode ?? "auto (safe Unicode)"}`);
    console.log("\nVisual test (these should be icons, not boxes):");
    console.log(["folder", "play", "settings", "github", "terminal"].map((name) => icon(name, { mode: "nerd-font" })).join("  "));
    console.log("\nSetup guidance:");
    for (const line of setupAdvice(info)) console.log(`- ${line}`);
    console.log("\nTUIcons intentionally stays in safe Unicode mode until support is confirmed.");
    break;
  }
  case "help":
  case "--help":
  case "-h":
    console.log(`TUIcons — typed terminal icons\n\nCommands:\n  search <query>  Search semantic and raw Nerd Font icons\n  show <name>     Print one icon\n  list            List curated semantic icons\n  doctor          Inspect the terminal and show a visual test\n  setup           Show terminal-specific setup guidance\n\nOptions:\n  --mode <mode>   auto, nerd-font, unicode, or ascii\n  --limit <n>     Maximum search results`);
    break;
  default:
    fail(`Unknown command: ${command}. Run tuicons --help.`);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
