#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { icon, nerdFontsVersion, searchIcons, semanticIcons } from "@tuicons/core";
import type { IconMode } from "@tuicons/core";
import { detectTerminal, setupAdvice } from "./index.js";

const [, , command = "help", ...args] = process.argv;
const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { version: string };

interface ParsedArguments {
  readonly positionals: readonly string[];
  readonly mode: IconMode;
  readonly limit: number;
}

function parseArguments(allowMode: boolean, allowLimit: boolean): ParsedArguments {
  const positionals: string[] = [];
  let selectedMode: IconMode = "auto";
  let limit = 20;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    const separator = argument.indexOf("=");
    const optionName = separator >= 0 ? argument.slice(0, separator) : argument;
    const inlineValue = separator >= 0 ? argument.slice(separator + 1) : undefined;
    if (optionName === "--mode") {
      if (!allowMode) fail(`Unknown option for ${command}: --mode`);
      const value = inlineValue ?? args[++index];
      if (value !== "auto" && value !== "nerd-font" && value !== "unicode" && value !== "ascii") {
        fail("--mode must be auto, nerd-font, unicode, or ascii");
      }
      selectedMode = value;
    } else if (optionName === "--limit") {
      if (!allowLimit) fail(`Unknown option for ${command}: --limit`);
      const value = inlineValue ?? args[++index];
      if (!value || !/^\d+$/.test(value)) fail("--limit must be a non-negative integer");
      limit = Number.parseInt(value, 10);
      if (!Number.isSafeInteger(limit)) fail("--limit is too large");
    } else if (argument.startsWith("-")) {
      fail(`Unknown option: ${argument}`);
    } else {
      positionals.push(argument);
    }
  }

  return { positionals, mode: selectedMode, limit };
}

switch (command) {
  case "search": {
    const parsed = parseArguments(true, true);
    if (parsed.positionals.length !== 1) fail("Usage: tuicons search <query> [--mode auto|nerd-font|unicode|ascii] [--limit 20]");
    for (const result of searchIcons(parsed.positionals[0]!, parsed.limit)) {
      console.log(`${icon(result.name, { mode: parsed.mode })}  ${result.name}${result.kind === "raw" ? "  [raw]" : ""}`);
    }
    break;
  }
  case "show": {
    const parsed = parseArguments(true, false);
    if (parsed.positionals.length !== 1) fail("Usage: tuicons show <name> [--mode auto|nerd-font|unicode|ascii]");
    console.log(icon(parsed.positionals[0]!, { mode: parsed.mode }));
    break;
  }
  case "list": {
    const parsed = parseArguments(true, false);
    if (parsed.positionals.length !== 0) fail("Usage: tuicons list [--mode auto|nerd-font|unicode|ascii]");
    for (const entry of semanticIcons) console.log(`${icon(entry.name, { mode: parsed.mode })}  ${entry.name}`);
    break;
  }
  case "doctor":
  case "setup": {
    if (args.length > 0) fail(`Usage: tuicons ${command}`);
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
    if (args.length > 0) fail("Usage: tuicons --help");
    console.log(`TUIcons — typed terminal icons\n\nCommands:\n  search <query>  Search semantic and raw Nerd Font icons\n  show <name>     Print one icon\n  list            List curated semantic icons\n  doctor          Inspect the terminal and show a visual test\n  setup           Show terminal-specific setup guidance\n\nOptions:\n  --mode <mode>   auto, nerd-font, unicode, or ascii\n  --limit <n>     Maximum search results\n  --version       Print the installed version`);
    break;
  case "--version":
  case "-v":
    if (args.length > 0) fail("Usage: tuicons --version");
    console.log(version);
    break;
  default:
    fail(`Unknown command: ${command}. Run tuicons --help.`);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
