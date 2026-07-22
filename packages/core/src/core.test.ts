import { describe, expect, it } from "vitest";
import { icon, resolveIcon, resolveMode, searchIcons } from "./index.js";

describe("icon resolution", () => {
  it("defaults to safe Unicode", () => expect(icon("play", { env: {} })).toBe("▶"));
  it("uses ASCII when requested", () => expect(icon("folder", { mode: "ascii" })).toBe("[D]"));
  it("resolves aliases", () => expect(icon("delete", { mode: "unicode" })).toBe("⌫"));
  it("uses generated Nerd Font glyphs", () => expect(resolveIcon("play", { mode: "nerd-font" }).mode).toBe("nerd-font"));
  it("does not print an unknown raw glyph in safe modes", () => expect(icon("nf-md-abacus", { mode: "unicode" })).toBe("?"));
  it("honors TUICONS_MODE", () => expect(resolveMode("auto", { TUICONS_MODE: "ascii" })).toBe("ascii"));
  it("lets an explicit mode override the environment", () => expect(resolveMode("unicode", { TUICONS_MODE: "ascii" })).toBe("unicode"));
  it("ignores an invalid configured mode", () => expect(resolveMode("auto", { TUICONS_MODE: "yes" })).toBe("unicode"));
  it("does not confuse NO_COLOR with Unicode support", () => expect(resolveMode("auto", { NO_COLOR: "1" })).toBe("unicode"));
  it("does not guess from TERM", () => expect(resolveMode("auto", { TERM: "linux" })).toBe("unicode"));
  it("normalizes case and underscores", () => expect(icon("  SKIP_FORWARD ", { mode: "ascii" })).toBe(">|"));
  it("supports a custom unknown fallback without leaking raw glyphs", () => {
    expect(resolveIcon("nf-md-abacus", { mode: "nerd-font" }).mode).toBe("nerd-font");
    expect(resolveIcon("nf-missing", { mode: "nerd-font", unknown: "[?]" })).toMatchObject({ glyph: "[?]", mode: "unicode" });
  });
});

describe("search", () => {
  it("prioritizes semantic aliases", () => expect(searchIcons("delete")[0]?.name).toBe("trash"));
  it("includes the complete raw registry", () => expect(searchIcons("abacus").some((result) => result.name.includes("abacus"))).toBe(true));
  it("returns no results for blank queries or a zero limit", () => {
    expect(searchIcons("  ")).toEqual([]);
    expect(searchIcons("folder", 0)).toEqual([]);
  });
});
