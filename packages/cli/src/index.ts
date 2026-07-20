export interface TerminalInfo {
  readonly terminal: string;
  readonly colorTerm?: string;
  readonly term?: string;
  readonly isSsh: boolean;
  readonly configuredMode?: string;
}

export function detectTerminal(env: Readonly<Record<string, string | undefined>> = process.env): TerminalInfo {
  let terminal = "unknown";
  if (env.WT_SESSION) terminal = "Windows Terminal";
  else if (env.TERM_PROGRAM === "vscode") terminal = "VS Code";
  else if (env.WEZTERM_EXECUTABLE || env.TERM_PROGRAM === "WezTerm") terminal = "WezTerm";
  else if (env.KITTY_WINDOW_ID) terminal = "Kitty";
  else if (env.GHOSTTY_RESOURCES_DIR || env.TERM_PROGRAM === "ghostty") terminal = "Ghostty";
  else if (env.TERM_PROGRAM) terminal = env.TERM_PROGRAM;

  return {
    terminal,
    ...(env.COLORTERM ? { colorTerm: env.COLORTERM } : {}),
    ...(env.TERM ? { term: env.TERM } : {}),
    isSsh: Boolean(env.SSH_CONNECTION || env.SSH_TTY),
    ...(env.TUICONS_MODE ? { configuredMode: env.TUICONS_MODE } : {}),
  };
}

export function setupAdvice(info: TerminalInfo): readonly string[] {
  if (info.isSsh) return [
    "Install and configure a Nerd Font on the local computer rendering this SSH session.",
    "Set TUICONS_MODE=nerd-font only after verifying the test glyphs.",
  ];
  if (info.terminal === "Windows Terminal") return [
    "Install a Nerd Font for your Windows user (CaskaydiaCove Nerd Font is a good default).",
    "Open Windows Terminal Settings → profile → Appearance → Font face.",
    "Select the installed Nerd Font, reopen the profile, then set TUICONS_MODE=nerd-font.",
  ];
  if (info.terminal === "VS Code") return [
    "Install a Nerd Font, then set terminal.integrated.fontFamily to its exact family name.",
    "Restart the terminal and set TUICONS_MODE=nerd-font after the visual test passes.",
  ];
  return [
    "Configure your terminal to use any Nerd Font or Symbols Nerd Font fallback.",
    "After the visual test passes, set TUICONS_MODE=nerd-font.",
  ];
}
