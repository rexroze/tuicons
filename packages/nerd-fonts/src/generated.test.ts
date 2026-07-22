import { describe, expect, it } from "vitest";
import { nerdFontIconMap, nerdFontIcons, nerdFontSourceSha256, nerdFontsVersion } from "./index.js";

describe("generated registry", () => {
  it("records its pinned upstream release and digest", () => {
    expect(nerdFontsVersion).toBe("3.4.0");
    expect(nerdFontSourceSha256).toBe("e2d10d23f5bff0bd6f0676e9b01d9789fcdc656de7b498a2955c27716ea4439c");
  });

  it("contains the expected number of unique, sorted icons", () => {
    expect(nerdFontIcons).toHaveLength(10_764);
    const names = nerdFontIcons.map((entry) => entry.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual([...names].sort((left, right) => left.localeCompare(right)));
  });

  it("keeps glyphs and map entries consistent", () => {
    for (const entry of nerdFontIcons) {
      expect(entry.glyph.codePointAt(0)).toBe(entry.codepoint);
      expect(nerdFontIconMap[entry.name]).toBe(entry);
    }
  });
});
