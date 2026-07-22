# @tuicons/core

Framework-agnostic terminal icon resolution, aliases, fallbacks, and search.

```sh
npm install @tuicons/core
```

```ts
import { icon, resolveIcon, searchIcons } from "@tuicons/core";

icon("play"); // ▶
icon("folder", { mode: "ascii" }); // [D]
resolveIcon("delete", { mode: "unicode" });
searchIcons("music");
```

The default `auto` mode emits Unicode and only uses private-use Nerd Font
glyphs after an explicit `nerd-font` option or `TUICONS_MODE=nerd-font`.

See the [main TUIcons documentation](https://github.com/rexroze/tuicons#readme)
for modes, the complete API, and terminal setup guidance.

[MIT](LICENSE)
