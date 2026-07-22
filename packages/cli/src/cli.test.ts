import { execFileSync, spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { detectTerminal, setupAdvice } from "./index.js";

const cli = resolve("packages/cli/dist/cli.js");

describe("terminal diagnostics", () => {
  it("detects Windows Terminal", () => expect(detectTerminal({ WT_SESSION: "id" }).terminal).toBe("Windows Terminal"));
  it("keeps SSH setup on the rendering machine", () => expect(setupAdvice(detectTerminal({ SSH_TTY: "1" }))[0]).toContain("local computer"));
});

describe("CLI", () => {
  it("prints the package version", () => {
    expect(execFileSync(process.execPath, [cli, "--version"], { encoding: "utf8" }).trim()).toBe("0.1.0");
  });

  it("supports inline options", () => {
    expect(execFileSync(process.execPath, [cli, "show", "folder", "--mode=ascii"], { encoding: "utf8" }).trim()).toBe("[D]");
  });

  it("rejects invalid modes", () => {
    const result = spawnSync(process.execPath, [cli, "show", "play", "--mode", "nerd_font"], { encoding: "utf8" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("--mode must be");
  });
});
