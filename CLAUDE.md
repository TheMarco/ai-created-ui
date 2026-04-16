# CLAUDE.md

Repo guidance for AI-assisted changes. Pair with `README.md` (full setup + component list) and `DESIGN-SYSTEM.md` (design contract).

## Mental model

Three repos, one contract:

- **`ai-created-ui`** (this repo, private) owns the library. Primitives, tokens, motion helpers, `DESIGN-SYSTEM.md`.
- **`ai-created-ui/playground/`** is a private Next.js app that deploys to `ui.ai-created.com`. It is the integration test and the public reference for every component. Any library change should land with a corresponding playground demo update.
- **Consumers**: `ai-created-nextjs` (ai-created.com), `applyanator` (human-actually.com). Both install `@ai-created/ui` as a `github:TheMarco/ai-created-ui` dependency. They pin to a specific commit via `package-lock.json`.

Library is upstream. Playground tests it live. Consumers read from it. Product-specific composition never lives in the library.

## What goes where

| Concern | Lives in |
|---|---|
| Tokens (color, typography, spacing, motion) | `styles/tokens.css`, `tailwind-preset.js` |
| Primitives (Button, Dialog, Surface, etc.) | `src/components/` |
| Motion helpers, `cn` | `src/lib/` |
| Contract document | `DESIGN-SYSTEM.md` |
| Live reference | `playground/` → `ui.ai-created.com` |
| Marketing landing for the public | `ai-created-nextjs/src/app/design-system/` |
| Product-specific cards, data-shape-coupled components | Consumer repo, never here |

Rule of thumb: if you would copy-paste it into the next app, it belongs in the library. If it is tied to one app's data or routes, keep it there.

## Common workflows

### Edit an existing library component

1. Edit in `src/components/`.
2. Update the playground demo if visible behavior changed.
3. Update `DESIGN-SYSTEM.md` if a rule changed.
4. Commit + push.
5. In each consumer that should pick up the change, run the dep bump (see below) and redeploy.

### Promote a component from a consumer

Do this only after the pattern has shipped in a real product and repeated. Not on speculation.

1. Move the component into `src/components/Foo.tsx`. Strip `@/` path aliases; imports should be `../lib/utils`, `../lib/motion`, or peer deps only.
2. Add the export to `src/index.ts`.
3. Add a demo to the playground (new section or extend `ComponentsSection`).
4. Update `DESIGN-SYSTEM.md` if it teaches a new rule.
5. Commit + push.
6. In the consumer: bump the dep (below), rewrite imports to `@ai-created/ui`, delete the local copy.

### Dep bump in a consumer (critical)

`npm install` in a consumer does **not** refetch a `github:` dep when the lockfile is already satisfied. After pushing a library change, run this in the consumer:

```
npm install @ai-created/ui@github:TheMarco/ai-created-ui
```

This rewrites the resolved commit hash in `package-lock.json`. Commit the lockfile. Otherwise Vercel's cached install silently runs against the old commit and fails with "export not found" errors for anything you added.

## Local dev loop

The `github:` dep is slow to iterate against (commit, push, bump, reinstall). Two shortcuts:

- **Prefer the playground.** It depends on the library via `file:..`, so edits hot-reload. 90% of design-system iteration should happen there, not in a consumer.
- **If a change must be verified in a real consumer**, temporarily switch that consumer's dep to `"@ai-created/ui": "file:../../ai-created-ui"`. Revert to `github:TheMarco/ai-created-ui` before committing, or Vercel installs will fail.

## Playground deployment

The playground deploys to Vercel with root directory `playground/`. It uses `playground/vercel.json`:

```json
{ "installCommand": "npm install --install-links" }
```

`--install-links` is required because the library's peer deps (framer-motion, lucide-react, headlessui, etc.) resolve through the symlink by default, and Node's symlink resolution breaks peer-dep lookup on the build server. `--install-links` packs the library into `playground/node_modules/@ai-created/ui/` as a real copy, so peer deps resolve from the playground's own node_modules.

Locally the playground still uses the default symlink for hot-reload.

## Privacy

This repo is private. No public GitHub links in the playground or any consumer. No OSS conventions (badges, contributor guides, npm publish) unless that changes.

## Style

- No em dashes anywhere. Commas, periods, or colons instead.
- Instrument Serif is for display type only (hero headings, section titles). Space Grotesk everywhere else.
- Red is accent, not a second brand color.
- Light mode is an intentional design, not an inverted dark mode.
- Accessibility contracts ship with the component, not with consumers.
