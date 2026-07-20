# TUIcons

TUIcons is a typed, searchable icon library for terminal interfaces. It turns
opaque private-use glyphs into stable names, exposes the complete Nerd Fonts
registry, and keeps applications usable when a Nerd Font is unavailable.

```ts
import { icon } from "@tuicons/core";

icon("play");                       // ▶ (safe default)
icon("play", { mode: "nerd-font" }); // Nerd Font play glyph
icon("folder", { mode: "ascii" });   // [D]
```

OpenTUI imperative API:

```ts
import { createCliRenderer } from "@opentui/core";
import { Icon } from "@tuicons/opentui";

const renderer = await createCliRenderer();
renderer.root.add(Icon(renderer, { name: "play", fg: "#7dd3fc" }));
```

## Why the default is safe Unicode

The terminal emulator renders text, and a process running inside it cannot
reliably inspect the active font or see a missing-glyph box. `auto` therefore
uses safe Unicode unless `TUICONS_MODE` is explicitly configured. This is the
only honest way to guarantee that the library does not intentionally produce
broken boxes on a fresh installation.

After configuring a Nerd Font, verify it and opt in:

```powershell
pnpm tuicons doctor
$env:TUICONS_MODE = "nerd-font"
```

Applications can also pass `{ mode: "nerd-font" }` in their own configuration.

## Packages

- `@tuicons/nerd-fonts`: generated typed metadata for every Nerd Fonts 3.4.0 glyph
- `@tuicons/core`: semantic names, fallback resolution, aliases, and search
- `@tuicons/opentui`: a thin OpenTUI `TextRenderable` adapter
- `@tuicons/cli`: search, preview, diagnostics, and guided setup

## Development

```sh
pnpm install
pnpm generate
pnpm check
pnpm build
node packages/cli/dist/cli.js search music
```

The generator is pinned to one Nerd Fonts release. Registry changes are
reviewable and cannot silently follow upstream code-point changes.

## Roadmap

The next adapters are OpenTUI React, Ink, and JSON bindings for Rust, Go,
and Python. All adapters consume the framework-agnostic resolver; none owns a
separate icon catalog.

See [docs/PRD.md](docs/PRD.md) for product requirements and
[docs/CODEX_PROMPT.md](docs/CODEX_PROMPT.md) for the implementation handoff.
