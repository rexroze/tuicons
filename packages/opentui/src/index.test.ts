import { describe, expect, it } from "vitest";
import { iconText } from "./index.js";

describe("OpenTUI adapter", () => {
  it("uses the core safe default", () => expect(iconText("play")).toBe("▶"));
  it("allows ASCII rendering", () => expect(iconText("folder", { mode: "ascii" })).toBe("[D]"));
});
