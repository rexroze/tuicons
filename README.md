# TUIcons

[![CI](https://github.com/rexroze/tuicons/actions/workflows/ci.yml/badge.svg)](https://github.com/rexroze/tuicons/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Typed, searchable terminal icons with Unicode and ASCII fallbacks.

TUIcons gives private-use Nerd Font glyphs stable names, exposes the complete
Nerd Fonts registry, and keeps applications readable when a Nerd Font is not
configured.

```ts
import { icon } from "@tuicons/core";

icon("play"); // ▶
icon("play", { mode: "nerd-font" }); // Nerd Font play glyph
icon("folder", { mode: "ascii" }); // [D]
```

## Install

TUIcons is ESM-only and supports Node.js 20 and newer.

```sh
npm install @tuicons/core
```

Use the OpenTUI adapter or CLI only when needed:

```sh
npm install @tuicons/opentui @opentui/core
npm install --global @tuicons/cli
```

## Modes

| Mode | Output | Use it when |
| --- | --- | --- |
| `auto` | Unicode by default | You want a portable default and optional environment configuration |
| `unicode` | Standard Unicode | A Nerd Font is not required |
| `ascii` | ASCII fallbacks | The terminal or font has limited Unicode coverage |
| `nerd-font` | Private-use glyphs | The rendering terminal is configured with Nerd Fonts 3.4.0-compatible symbols |

`auto` never guesses that a Nerd Font is installed. Set `TUICONS_MODE` to
`nerd-font`, `unicode`, or `ascii`, or pass `mode` explicitly. Unicode avoids
Nerd Fonts' private-use code points, but no library can guarantee that every
font contains every Unicode symbol; use `ascii` for the most conservative
output.

## Core API

```ts
import {
  icon,
  resolveIcon,
  searchIcons,
  semanticIcons,
} from "@tuicons/core";

icon("delete", { mode: "unicode" }); // alias for "trash"

resolveIcon("play", { mode: "ascii" });
// { name: "play", glyph: ">", mode: "ascii", label: "play" }

searchIcons("folder", 10);
semanticIcons; // curated definitions and fallbacks
```

Semantic names and aliases work in every mode. Raw `nf-*` names only emit
private-use glyphs in explicit `nerd-font` mode; other modes return the
configured unknown fallback (`?` by default).

## OpenTUI

```ts
import { createCliRenderer } from "@opentui/core";
import { Icon } from "@tuicons/opentui";

const renderer = await createCliRenderer();
renderer.root.add(Icon(renderer, { name: "play", fg: "#7dd3fc" }));
```

`iconText()` is also available when a string is more convenient than a
`TextRenderable`.

## CLI

```sh
tuicons search music
tuicons show folder --mode ascii
tuicons list --mode unicode
tuicons doctor
tuicons setup
```

`doctor` shows a visual glyph test and explains an important boundary: during
SSH, the font must be installed on the local machine rendering the terminal,
not only on the remote host.

## Packages

- [`@tuicons/core`](packages/core): semantic icons, fallback resolution, aliases, and search
- [`@tuicons/nerd-fonts`](packages/nerd-fonts): generated metadata for all 10,764 Nerd Fonts 3.4.0 glyphs
- [`@tuicons/opentui`](packages/opentui): thin OpenTUI `TextRenderable` adapter
- [`@tuicons/cli`](packages/cli): search, preview, diagnostics, and setup guidance

## Development

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm pack:check
```

The generator downloads one tagged Nerd Fonts registry and verifies its pinned
SHA-256 checksum before producing source. `pack:check` builds the packages,
inspects their tarballs, installs them into a clean temporary consumer project,
and runs API and CLI smoke tests.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution and release process,
[SECURITY.md](SECURITY.md) for private vulnerability reporting, and
[docs/PRD.md](docs/PRD.md) for product requirements.

## License

TUIcons code is available under the [MIT License](LICENSE). The generated Nerd
Fonts registry retains upstream provenance and notices; see
[`packages/nerd-fonts/THIRD_PARTY_LICENSES.md`](packages/nerd-fonts/THIRD_PARTY_LICENSES.md).
