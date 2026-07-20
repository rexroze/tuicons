import { describe, expect, it } from "vitest";
import { icon, resolveIcon, resolveMode, searchIcons } from "./index.js";

describe("icon resolution", () => {
  it("defaults to safe Unicode", () => expect(icon("play", { env: {} })).toBe("▶"));
  it("uses ASCII when requested", () => expect(icon("folder", { mode: "ascii" })).toBe("[D]"));
  it("resolves aliases", () => expect(icon("delete", { mode: "unicode" })).toBe("⌫"));
  it("uses generated Nerd Font glyphs", () => expect(resolveIcon("play", { mode: "nerd-font" }).mode).toBe("nerd-font"));
  it("does not print an unknown raw glyph in safe modes", () => expect(icon("nf-md-abacus", { mode: "unicode" })).toBe("?"));
  it("honors TUICONS_MODE", () => expect(resolveMode("auto", { TUICONS_MODE: "ascii" })).toBe("ascii"));
});

describe("search", () => {
  it("prioritizes semantic aliases", () => expect(searchIcons("delete")[0]?.name).toBe("trash"));
  it("includes the complete raw registry", () => expect(searchIcons("abacus").some((result) => result.name.includes("abacus"))).toBe(true));
});
