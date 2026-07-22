# @tuicons/nerd-fonts

Generated, typed metadata for all 10,764 glyphs in the Nerd Fonts 3.4.0
`glyphnames.json` registry.

```sh
npm install @tuicons/nerd-fonts
```

```ts
import {
  nerdFontIconMap,
  nerdFontIcons,
  nerdFontsVersion,
} from "@tuicons/nerd-fonts";

nerdFontsVersion; // "3.4.0"
nerdFontIconMap["nf-md-play"]?.glyph;
nerdFontIcons.length; // 10764
```

These glyphs use private-use code points and require a compatible Nerd Font in
the terminal that renders them. Use `@tuicons/core` when you need semantic
names and portable fallbacks.

The generated source records its tagged upstream URL and verified SHA-256
digest. See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) and
[LICENSE-NERD-FONTS](LICENSE-NERD-FONTS) for provenance and notices.

TUIcons code is [MIT licensed](LICENSE).
