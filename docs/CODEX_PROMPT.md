# Codex implementation prompt

Continue building TUIcons in this repository. Read `docs/PRD.md`, `README.md`,
and the existing package tests before editing. Preserve these invariants:

- Nerd Font metadata is generated from an explicit pinned release.
- `auto` output remains safe and never guesses that a font is installed.
- Raw PUA glyphs are emitted only in explicit Nerd Font mode.
- Font installation/configuration is opt-in, checksum-verified, and never a package postinstall.
- Framework adapters remain thin wrappers over `@tuicons/core`.
- Upstream provenance and third-party licenses remain visible.

Implement the next incomplete vertical slice from the PRD. Prefer adding a
failing behavior test before a logic change. Run `pnpm check`, `pnpm build`,
and relevant CLI smoke tests. Report the files changed, validation performed,
and any remaining licensing or terminal-compatibility risks.
