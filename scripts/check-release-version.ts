import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const tag = process.argv[2];
if (!tag || !/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(tag)) {
  throw new Error("Pass a release tag in the form vX.Y.Z");
}

const expectedVersion = tag.slice(1);
const manifests = [
  "package.json",
  "packages/nerd-fonts/package.json",
  "packages/core/package.json",
  "packages/opentui/package.json",
  "packages/cli/package.json",
];

for (const manifest of manifests) {
  const parsed = JSON.parse(await readFile(resolve(manifest), "utf8")) as { name: string; version: string };
  if (parsed.version !== expectedVersion) {
    throw new Error(`${parsed.name} is ${parsed.version}, but ${tag} requires ${expectedVersion}`);
  }
}

console.log(`All package versions match ${tag}.`);
