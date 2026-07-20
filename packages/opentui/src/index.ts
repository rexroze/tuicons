import { TextRenderable, type RenderContext, type TextOptions } from "@opentui/core";
import { icon, type IconMode } from "@tuicons/core";

export interface IconOptions extends Omit<TextOptions, "content"> {
  /** Semantic name (for example `play`) or raw `nf-*` name. */
  readonly name: string;
  /** Defaults to TUIcons' safe `auto` mode. */
  readonly mode?: IconMode;
  readonly unknown?: string;
}

/** Resolve an icon without constructing a renderable. Useful for composed text. */
export function iconText(name: string, options: { readonly mode?: IconMode; readonly unknown?: string } = {}): string {
  return icon(name, options);
}

/** Create an OpenTUI TextRenderable containing a resolved icon. */
export function Icon(ctx: RenderContext, options: IconOptions): TextRenderable {
  const { name, mode, unknown, ...textOptions } = options;
  return new TextRenderable(ctx, {
    ...textOptions,
    content: icon(name, {
      ...(mode ? { mode } : {}),
      ...(unknown !== undefined ? { unknown } : {}),
    }),
  });
}
