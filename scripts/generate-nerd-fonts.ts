import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const NERD_FONTS_VERSION = "3.4.0";
const SOURCE = `https://raw.githubusercontent.com/ryanoasis/nerd-fonts/v${NERD_FONTS_VERSION}/glyphnames.json`;
const SOURCE_SHA256 = "e2d10d23f5bff0bd6f0676e9b01d9789fcdc656de7b498a2955c27716ea4439c";
const OUTPUT = resolve("packages/nerd-fonts/src/generated.ts");

type SourceIcon = { char: string; code: string };
type SourceRegistry = Record<string, SourceIcon | Record<string, string>>;

const response = await fetch(SOURCE);
if (!response.ok) throw new Error(`Could not download Nerd Fonts metadata: ${response.status}`);
const sourceBytes = Buffer.from(await response.arrayBuffer());
const sourceHash = createHash("sha256").update(sourceBytes).digest("hex");
if (sourceHash !== SOURCE_SHA256) {
  throw new Error(`Nerd Fonts metadata checksum mismatch: expected ${SOURCE_SHA256}, received ${sourceHash}`);
}
const source = JSON.parse(sourceBytes.toString("utf8")) as SourceRegistry;

const icons = Object.entries(source)
  .filter((entry): entry is [string, SourceIcon] => entry[0] !== "METADATA" && "char" in entry[1])
  .map(([name, value]) => ({
    name: `nf-${name.replaceAll("_", "-")}`,
    provider: name.slice(0, name.indexOf("-")),
    providerName: name.slice(name.indexOf("-") + 1).replaceAll("_", "-"),
    glyph: value.char,
    codepoint: Number.parseInt(value.code, 16),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const body = `// Generated from Nerd Fonts ${NERD_FONTS_VERSION}. Do not edit by hand.\n` +
  `import type { NerdFontIcon } from "./types.js";\n\n` +
  `export const nerdFontsVersion = ${JSON.stringify(NERD_FONTS_VERSION)};\n` +
  `export const nerdFontSource = ${JSON.stringify(SOURCE)};\n` +
  `export const nerdFontSourceSha256 = ${JSON.stringify(SOURCE_SHA256)};\n` +
  `export const nerdFontIcons: readonly NerdFontIcon[] = ${JSON.stringify(icons, null, 2)};\n\n` +
  `export type NerdFontIconName = string;\n` +
  `export const nerdFontIconMap: Readonly<Record<string, NerdFontIcon>> = Object.fromEntries(nerdFontIcons.map((entry) => [entry.name, entry]));\n`;

if (process.argv.includes("--check")) {
  const current = await readFile(OUTPUT, "utf8").catch(() => "");
  if (current !== body) {
    console.error("Generated Nerd Font registry is stale. Run: pnpm generate");
    process.exitCode = 1;
  }
} else {
  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, body);
  console.log(`Generated ${icons.length} icons from Nerd Fonts ${NERD_FONTS_VERSION}.`);
}
