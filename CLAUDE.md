# CLAUDE.md

Repo guidance for AI-assisted changes. Pair with `README.md` (full setup + component list) and `DESIGN-SYSTEM.md` (design contract).

## Mental model

Three repos, one contract:

- **`ai-created-ui`** (this repo, private) owns the library. Primitives, tokens, motion helpers, `DESIGN-SYSTEM.md`.
- **`ai-created-ui/playground/`** is a private Next.js app that deploys to `ui.ai-created.com`. It is the integration test and the public reference for every component. Any library change should land with a corresponding playground demo update.
- **Consumers**: `ai-created-nextjs` (ai-created.com), `applyanator` (human-actually.com). Both currently install `@ai-created/ui` as a `github:TheMarco/ai-created-ui` dependency and pin a commit via `package-lock.json`. Governed releases move them to explicit `#vX.Y.Z` tags.

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

## Token architecture guardrails

The token hierarchy is `reference -> semantic -> component`.

- Reference tokens live in `styles/tokens.css` as `--ref-*`. Add only opaque values already needed by a semantic token. Do not generate complete color, spacing, radius, shadow, or motion scales speculatively.
- Semantic tokens are the public component contract. Search for a matching role before creating one, and map theme-aware colors in both dark and light modes.
- Components consume semantic tokens through `tailwind-preset.js` or `var(...)`. Do not consume `--ref-*` directly in shared component code.
- Existing public custom properties and Tailwind names are compatibility contracts. Preserve them, or introduce an alias when an intent name is clearer. Do not broadly rename or remove them without a dedicated migration plan.
- Component-specific tokens require a real shared contract inside that component, usually theme-aware behavior. The hero media tokens are the current justified example. Runtime properties such as Slider progress remain component-local.
- Keep one-off geometry, spacing, standard Tailwind shadows, invariant control marks, and behavior-specific timing local. A literal is not automatically a missing global token.
- When changing tokens, compare the complete playground in dark and light modes before and after. Treat any unplanned visual delta as a regression.

The intent aliases `--color-accent*` and `--color-action-primary*` sit above the established `--color-red*` compatibility API. Both remain public. New shared code can prefer the intent name when the role is unambiguous, but consumer migration is not required.

## Component contract guardrails

Before changing a public component API, search `src/index.ts`, the playground, `ai-created-nextjs`, and `applyanator` for current usage. Record whether the proposal is additive or breaking. Preserve existing callback names, controlled state models, variants, exports, and DOM semantics unless the change has consumer evidence and a migration path.

- Prefer native controls and native attributes. Do not replace them with div-based replicas.
- Forward refs to the meaningful native root and export every public prop or style-option type from `@ai-created/ui`.
- Treat controlled versus uncontrolled behavior as an explicit contract. Do not silently add internal state to a controlled component.
- Keep icon-only controls named, decorative icons hidden, focus treatment visible, and keyboard behavior covered by tests.
- Use `className` for styling escape hatches. Do not add one-off styling props when composition or the existing variant system is sufficient.
- Add behavior, keyboard, disabled-state, callback, native-semantics, and axe coverage when an interactive contract changes.
- Update `DESIGN-SYSTEM.md` for contract changes and the playground for visible changes.

The current component inventory, decisions, and deferred API questions live in `docs/COMPONENT-CONTRACT-AUDIT.md`. Resolve a deferred question there before broadening a primitive's API.

## Required quality checks

Before finishing any design-system change, run this command from the repository root:

```bash
npm run validate
```

It must pass package and playground typechecking, lint, component behavior tests, axe accessibility tests, and the playground production build. Use `npm run test:watch` while iterating and `npm run test:a11y` for a focused accessibility pass.

For changes that affect playground behavior, integration, tokens, layout, typography, or rendered component states, also run `npm run test:browser`. Use `npm run test:e2e` or `npm run test:visual` for focused iteration. If a visual change is intentional, run `npm run test:visual:update`, inspect every changed PNG under `e2e/__screenshots__/`, and commit only reviewed baselines. Never update a baseline to conceal an unexplained difference.

Keep `playground/src/components/design-system/componentDocs.ts` aligned with the public source API. Every public component family needs purpose, use and avoid guidance, important defaults, states, accessibility and composition contracts, and a realistic example.

When changing an interactive component, add or update behavior, keyboard, disabled-state, callback, native-semantics, and axe coverage as applicable. Tests should assert user-visible behavior, not implementation details or snapshots. Automated axe checks do not replace manual browser checks for contrast, focus visibility, screen reader output, touch behavior, and motion quality.

Before finishing, verify internally that the change reused existing primitives and semantic tokens, preserved native semantics and keyboard behavior, added applicable tests, updated the contract or playground when needed, checked consumer compatibility, and passed `npm run validate`. Fix any failed check or state why it does not apply.

Release-worthy changes also need a concise entry under `Unreleased` in `CHANGELOG.md`. Do not change package versions or create tags as a side effect of ordinary implementation work. Releases are deliberate and follow `RELEASING.md`.

## Common workflows

### Edit an existing library component

1. Edit in `src/components/`.
2. Update the playground demo if visible behavior changed.
3. Update `DESIGN-SYSTEM.md` if a rule changed.
4. Add a release-worthy note to `CHANGELOG.md` when applicable.
5. Commit and push. Consumers update only after a reviewed GitHub Release.

### Promote a component from a consumer

Do this only after the pattern has shipped in a real product and repeated. Not on speculation.

1. Move the component into `src/components/Foo.tsx`. Strip `@/` path aliases; imports should be `../lib/utils`, `../lib/motion`, or peer deps only.
2. Add the export to `src/index.ts`.
3. Add a demo to the playground (new section or extend `ComponentsSection`).
4. Update `DESIGN-SYSTEM.md` if it teaches a new rule.
5. Add the MINOR release note, commit, and push.
6. Release the package, then update the consumer through its Renovate PR. Rewrite imports to `@ai-created/ui` and delete the local copy in that PR.

### Consumer release update

Consumers depend on explicit immutable release tags, not `main`:

```
npm install "@ai-created/ui@github:TheMarco/ai-created-ui#vX.Y.Z"
```

Renovate should update the manifest and resolved commit in `package-lock.json` together after a GitHub Release. Review its release notes and consumer checks before merging. Never auto-merge a major update. The activation contract and configuration template live in `docs/consumer-update-automation.md`.

The consumer pull request is the compatibility test. Both known consumers must run their documented `validate:ui-update` command before adopting a release. New consumers must satisfy `docs/consumer-compatibility.md`; do not add cross-repository secrets or consumer production credentials to this repository.

## Local dev loop

The `github:` dep is slow to iterate against (commit, push, bump, reinstall). Two shortcuts:

- **Prefer the playground.** It depends on the library via `file:..`, so edits hot-reload. 90% of design-system iteration should happen there, not in a consumer.
- **If a change must be verified in a real consumer**, temporarily switch that consumer's dep to `"@ai-created/ui": "file:../../ai-created-ui"`. Revert to the current `github:TheMarco/ai-created-ui#vX.Y.Z` release before committing, or Vercel installs will fail.

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
