import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageManagerCli = process.env.npm_execpath;
if (!packageManagerCli) throw new Error("Could not locate the pnpm CLI from npm_execpath");

const npmCandidates = process.platform === "win32"
  ? [join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js")]
  : [
      resolve(dirname(process.execPath), "../lib/node_modules/npm/bin/npm-cli.js"),
      resolve(dirname(process.execPath), "../node_modules/npm/bin/npm-cli.js"),
    ];
let npmCli: string | undefined;
for (const candidate of npmCandidates) {
  if (await stat(candidate).then(() => true).catch(() => false)) {
    npmCli = candidate;
    break;
  }
}
if (!npmCli) throw new Error("Could not locate npm's npm-cli.js beside the Node.js installation");

const packages = [
  { directory: "packages/nerd-fonts", archivePrefix: "tuicons-nerd-fonts-", required: ["dist/index.js", "dist/index.d.ts", "LICENSE-NERD-FONTS", "THIRD_PARTY_LICENSES.md"] },
  { directory: "packages/core", archivePrefix: "tuicons-core-", required: ["dist/index.js", "dist/index.d.ts"] },
  { directory: "packages/opentui", archivePrefix: "tuicons-opentui-", required: ["dist/index.js", "dist/index.d.ts"] },
  { directory: "packages/cli", archivePrefix: "tuicons-cli-", required: ["dist/cli.js", "dist/index.d.ts"] },
] as const;

const temporaryRoot = await mkdtemp(join(tmpdir(), "tuicons-pack-check-"));

try {
  const rootLicense = await readFile(join(root, "LICENSE"), "utf8");

  for (const entry of packages) {
    const packageRoot = join(root, entry.directory);
    const packageLicense = await readFile(join(packageRoot, "LICENSE"), "utf8");
    if (packageLicense !== rootLicense) throw new Error(`${entry.directory}/LICENSE differs from the root license`);

    execFileSync(process.execPath, [packageManagerCli, "pack", "--pack-destination", temporaryRoot], {
      cwd: packageRoot,
      stdio: "inherit",
    });
  }

  const archiveNames = (await readdir(temporaryRoot)).filter((name) => name.endsWith(".tgz"));
  if (archiveNames.length !== packages.length) {
    throw new Error(`Expected ${packages.length} package archives, found ${archiveNames.length}`);
  }

  const archives: string[] = [];
  for (const entry of packages) {
    const archiveName = archiveNames.find((name) => name.startsWith(entry.archivePrefix));
    if (!archiveName) throw new Error(`Missing archive beginning with ${entry.archivePrefix}`);

    const archive = join(temporaryRoot, archiveName);
    archives.push(archive);
    const contents = execFileSync("tar", ["-tf", archive], { encoding: "utf8" })
      .split(/\r?\n/)
      .filter(Boolean)
      .map((path) => path.replace(/^package\//, ""));

    for (const required of ["package.json", "README.md", "LICENSE", ...entry.required]) {
      if (!contents.includes(required)) throw new Error(`${archiveName} is missing ${required}`);
    }
    const forbidden = contents.find((path) => path.includes(".test.") || path.endsWith(".tsbuildinfo"));
    if (forbidden) throw new Error(`${archiveName} unexpectedly contains ${forbidden}`);
  }

  const consumerRoot = join(temporaryRoot, "consumer");
  await mkdir(consumerRoot);
  await writeFile(
    join(consumerRoot, "package.json"),
    JSON.stringify({ name: "tuicons-package-smoke-test", private: true, type: "module" }, null, 2),
  );

  execFileSync(process.execPath, [npmCli, "install", "--ignore-scripts", "--no-audit", "--no-fund", "@types/node@22", ...archives], {
    cwd: consumerRoot,
    stdio: "inherit",
    env: { ...process.env, npm_config_cache: join(temporaryRoot, "npm-cache") },
  });

  const typeSmokeTest = `
import { icon, resolveIcon, searchIcons, type IconSearchResult, type ResolvedIcon } from "@tuicons/core";
import { nerdFontIcons, type NerdFontIcon } from "@tuicons/nerd-fonts";
import { iconText, type IconOptions } from "@tuicons/opentui";

const glyph: string = icon("play");
const resolved: ResolvedIcon = resolveIcon("folder", { mode: "ascii" });
const results: readonly IconSearchResult[] = searchIcons("music");
const raw: NerdFontIcon | undefined = nerdFontIcons[0];
const options: IconOptions = { name: "play", fg: "#7dd3fc" };
const text: string = iconText(options.name);
void [glyph, resolved, results, raw, options, text];
`;
  await writeFile(join(consumerRoot, "smoke.ts"), typeSmokeTest);
  await writeFile(
    join(consumerRoot, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          types: ["node"],
        },
        files: ["smoke.ts"],
      },
      null,
      2,
    ),
  );
  execFileSync(
    process.execPath,
    [join(root, "node_modules", "typescript", "bin", "tsc"), "-p", join(consumerRoot, "tsconfig.json"), "--pretty", "false"],
    { cwd: consumerRoot, stdio: "inherit" },
  );

  const smokeTest = `
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { icon, resolveIcon, searchIcons } from "@tuicons/core";
import { nerdFontIcons, nerdFontsVersion } from "@tuicons/nerd-fonts";
import { iconText } from "@tuicons/opentui";

assert.equal(icon("play", { env: {} }), "▶");
assert.equal(resolveIcon("folder", { mode: "ascii" }).glyph, "[D]");
assert.equal(searchIcons("delete")[0]?.name, "trash");
assert.equal(nerdFontsVersion, "3.4.0");
assert.equal(nerdFontIcons.length, 10764);
assert.equal(iconText("folder", { mode: "ascii" }), "[D]");

const cli = join(process.cwd(), "node_modules", "@tuicons", "cli", "dist", "cli.js");
const output = execFileSync(process.execPath, [cli, "show", "folder", "--mode", "ascii"], { encoding: "utf8" });
assert.equal(output.trim(), "[D]");
`;
  const smokeTestPath = join(consumerRoot, "smoke.mjs");
  await writeFile(smokeTestPath, smokeTest);
  execFileSync(process.execPath, [smokeTestPath], { cwd: consumerRoot, stdio: "inherit" });

  console.log("Package tarballs and clean-consumer smoke tests passed.");
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
