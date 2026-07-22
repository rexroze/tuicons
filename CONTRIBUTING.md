# Contributing to TUIcons

Thanks for helping make terminal icons easier to use.

## Before opening a change

- Search existing issues and pull requests first.
- Open an issue before a large API, registry, or licensing change.
- Keep framework adapters thin; fallback behavior belongs in `@tuicons/core`.
- Never make font installation or terminal configuration an install-time side effect.

## Local development

TUIcons requires Node.js 20 or newer and pnpm 10.34.5.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm pack:check
```

Add or update tests for behavior changes. `pnpm check` verifies the pinned
generated registry, type-checks every package, and runs the test suite.
`pnpm pack:check` additionally exercises the exact package tarballs in a clean
consumer project.

## Generated registry changes

Do not edit `packages/nerd-fonts/src/generated.ts` by hand. When intentionally
updating Nerd Fonts:

1. Change the version, source URL, and SHA-256 digest together in
   `scripts/generate-nerd-fonts.ts`.
2. Review the upstream release and license changes.
3. Run `pnpm generate` and inspect the generated diff.
4. Update the version and provenance text in the documentation.
5. Run the full release checks.

## Pull requests

Keep pull requests focused and explain user-visible behavior, tests, and any
compatibility or licensing consequences. By contributing, you agree that your
contribution is licensed under this repository's MIT License.

## Maintainer release checklist

1. Confirm every package version matches the intended `vX.Y.Z` release tag.
2. Run `pnpm release:check` from a clean checkout.
3. Update `CHANGELOG.md` and commit the version changes.
4. Publish a GitHub release for the matching tag.
5. Verify all four npm packages and their provenance attestations.

The npm account or organization publishing the release must control the
`@tuicons` scope and configure the repository's npm publishing credentials or
trusted publisher.
