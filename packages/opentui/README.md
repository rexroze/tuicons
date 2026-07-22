# @tuicons/opentui

A thin OpenTUI adapter for TUIcons.

```sh
npm install @tuicons/opentui @opentui/core
```

```ts
import { createCliRenderer } from "@opentui/core";
import { Icon } from "@tuicons/opentui";

const renderer = await createCliRenderer();
renderer.root.add(Icon(renderer, { name: "play", fg: "#7dd3fc" }));
```

Use `iconText(name, options)` when composed text needs a string rather than a
`TextRenderable`. Resolution and fallback behavior come from `@tuicons/core`.

See the [main TUIcons documentation](https://github.com/rexroze/tuicons#readme)
for modes and terminal setup guidance.

[MIT](LICENSE)
