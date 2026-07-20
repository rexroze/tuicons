# TUIcons product requirements

## Product statement

TUIcons is the Lucide-like developer interface for terminal icons: typed,
searchable, framework-agnostic, powered by Nerd Fonts, and safe when the user's
terminal does not support private-use glyphs.

## Problem

TUI developers currently paste characters such as `󰐊` into source code. These
characters are hard to search, review, remember, and replace. They also render
as missing-glyph boxes unless the terminal emulator—not merely the application
or remote host—uses a compatible font.

## Goals

1. Let developers address icons by stable semantic names.
2. Expose every supported Nerd Fonts glyph through a generated raw registry.
3. Prevent broken default output with Unicode and ASCII fallbacks.
4. Make the registry searchable and versioned.
5. Supply small adapters for popular TUI frameworks.
6. Preserve upstream identity, version, and licensing provenance.
7. Give users a guided, opt-in path to full Nerd Font rendering.

## Non-goals for v0.1

- Shipping a new font or claiming ownership of upstream glyph artwork.
- Silently installing fonts or editing terminal configuration from install scripts.
- Reliably detecting what the user visually sees; terminal processes cannot do this.
- Supporting every language and TUI framework in the first release.

## Users and use cases

- TUI authors importing a play, folder, status, file-type, or brand icon.
- Dynamic interfaces resolving icons from names at runtime.
- Coding agents generating readable icon usage rather than opaque glyphs.
- Users searching the full catalog or diagnosing missing glyphs.

## Required APIs

```ts
icon("play")
icon("play", { mode: "nerd-font" })
resolveIcon("delete", { mode: "unicode" })
searchIcons("folder")
```

Modes are `auto`, `nerd-font`, `unicode`, and `ascii`. `auto` must never assume
that a terminal has the correct font. An explicit application option or
`TUICONS_MODE` may opt into Nerd Font output.

## Data architecture

The raw registry is generated from a pinned `glyphnames.json` release and
records the stable prefixed name, provider, provider name, code point, and
glyph. The semantic layer selects one raw icon and adds aliases, categories,
labels, and fallbacks. Missing raw glyphs degrade to the semantic Unicode form.

## CLI

- `tuicons search <query>` searches semantic aliases and the raw catalog.
- `tuicons show <name>` prints a selected icon.
- `tuicons list` previews the curated layer.
- `tuicons doctor` identifies terminal context and runs a visual test.
- `tuicons setup` gives local/client-side configuration guidance.

## Setup and security

Font installation must be explicit, checksum-verified, current-user scoped,
and implemented per OS/terminal. During SSH, setup must target the client that
renders the session. Package installation must never run a system-changing
postinstall hook. Until support is confirmed, the UI uses a safe fallback.

## Licensing

Every generated entry retains its provider. The project records the exact Nerd
Fonts source and release and distributes third-party license guidance. Before
publishing, maintainers must audit each included upstream icon set and ship the
complete required notices.

## Acceptance criteria for v0.1

- The pinned generator deterministically emits the full Nerd Fonts registry.
- Core builds with strict TypeScript and resolves semantic names and aliases.
- Default output uses Unicode; ASCII and Nerd Font modes are selectable.
- Unknown or raw icons cannot leak PUA glyphs in safe modes.
- Search covers both semantic and raw layers.
- CLI diagnostics explain the local-vs-SSH font boundary.
- The OpenTUI adapter returns a standard `TextRenderable` and preserves styling options.
- Unit tests, generated-file check, typecheck, build, and CLI smoke tests pass.

## Follow-up releases

1. Expand semantic curation and generated per-icon entry points.
2. Publish OpenTUI core and React adapters with accessibility labels.
3. Add opt-in, checksum-pinned font setup providers.
4. Add Ink, Solid, Rust, Go, and Python bindings.
5. Build an interactive terminal browser and documentation website.
