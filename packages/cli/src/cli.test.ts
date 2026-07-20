import { describe, expect, it } from "vitest";
import { detectTerminal, setupAdvice } from "./index.js";

describe("terminal diagnostics", () => {
  it("detects Windows Terminal", () => expect(detectTerminal({ WT_SESSION: "id" }).terminal).toBe("Windows Terminal"));
  it("keeps SSH setup on the rendering machine", () => expect(setupAdvice(detectTerminal({ SSH_TTY: "1" }))[0]).toContain("local computer"));
});
