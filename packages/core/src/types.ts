export type IconMode = "auto" | "nerd-font" | "unicode" | "ascii";
export type ResolvedIconMode = Exclude<IconMode, "auto">;

export interface SemanticIconDefinition {
  readonly name: string;
  readonly aliases: readonly string[];
  readonly categories: readonly string[];
  readonly nerdFont: string;
  readonly unicode: string;
  readonly ascii: string;
  readonly label: string;
}

export interface ResolveIconOptions {
  readonly mode?: IconMode;
  readonly unknown?: string;
  readonly env?: Readonly<Record<string, string | undefined>>;
}

export interface ResolvedIcon {
  readonly name: string;
  readonly glyph: string;
  readonly mode: ResolvedIconMode;
  readonly label: string;
}
