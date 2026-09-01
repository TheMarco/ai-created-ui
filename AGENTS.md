# AI-Created UI Agent Contract

This file is the universal operating contract for any AI agent that designs, builds, reviews, or modifies interfaces using `@ai-created/ui`.

## Objective

Use the public package, semantic tokens, documented component contracts, and approved page archetypes without creating a parallel design system. Drift must be either mechanically rejected or recorded as an explicit, owned, time-bounded exception.

## Canonical sources

Read sources in this order. A lower source cannot override a higher source.

1. `src/index.ts` and `src/components/` define the actual public React API and runtime behavior.
2. `styles/tokens.css` defines token names and values.
3. `tailwind-preset.js` maps canonical semantic tokens into supported utilities.
4. `playground/src/components/design-system/specs/` defines reviewed component intent, construction, usage, accessibility, content, and governance contracts.
5. `playground/src/components/design-system/principal-spec/` defines cross-system foundations, patterns, content, accessibility, governance, and asset rules.
6. `DESIGN-SYSTEM.md` and the live playground explain the system to humans. They must remain aligned with the sources above.

`design-system.manifest.json` is the generated machine-readable projection of this precedence. Consume it, but never edit it directly or treat it as a competing authoring source.

When two canonical sources disagree, stop and fix the inconsistency in the owning source. Do not choose the convenient interpretation.

## Required context before implementation

Before creating or changing product UI:

1. Read `design-system.manifest.json` or query it through the repository agent command.
2. Select an approved archetype from `templates/agent/manifest.json` when the work is page-level.
3. Read the complete contracts for every component and pattern you plan to use.
4. Inspect existing product composition before adding a new local abstraction.
5. Identify loading, empty, error, offline, permission, disabled, focus, and responsive states that apply.

Do not infer props, variants, token names, or component behavior from model memory.

## Building product UI

- Import public primitives only from `@ai-created/ui`.
- Import token CSS once and use the shared Tailwind preset.
- Use semantic utilities and CSS variables. Never consume `--ref-*` tokens in product or component styling.
- Never copy a shared primitive into a consumer repository.
- Compose existing primitives before proposing a new shared component.
- Use native HTML semantics and the documented keyboard model.
- Preserve DOM order when responsive layout changes.
- Implement the complete applicable state model, not only the successful state.
- Keep product-specific data, routing, and business behavior in the consumer.
- Treat `className` as a constrained composition hook, not permission to invent a second visual language.

## Prohibited drift

The following require a failing check or an explicit exception:

- raw color values in product UI;
- direct reference-token use;
- unapproved fonts, radii, shadows, or arbitrary color utilities;
- internal package imports;
- local replicas of public primitives;
- undocumented variants or prop assumptions;
- detached design instances or one-off component geometry presented as shared behavior;
- new page structures that ignore approved archetypes without explaining the unmet need;
- accessibility behavior that differs from the component contract;
- generated artifacts edited by hand.

## Missing capability

When the system does not cover a real requirement:

1. Confirm that composition and an approved template cannot satisfy it.
2. Keep the first implementation product-local.
3. Add a structured exception to `ai-created-ui.config.json` only when validation would otherwise block justified work.
4. Give the exception a rule, exact scope, rationale, owner, and review date.
5. Promote the capability only after repeated product evidence and the contribution workflow in `/guidelines/governance`.

Never weaken a global rule to make one screen pass.

## Generated files

Do not edit these directly:

- `design-system.manifest.json`
- `playground/public/design-system/manifest.json`
- `playground/public/design-system/tokens.json`
- `llms.txt`
- `llms-full.txt`
- `playground/public/llms.txt`
- `playground/public/llms-full.txt`

Regenerate them through the package scripts and commit the owning-source change with the resulting artifact.

## Validation

Run from the repository root before finishing any design-system change:

```bash
npm run agent:check
npm run validate
npm run test:browser
```

Consumer implementations must run the design-policy validator over their source and their normal typecheck, accessibility, build, and browser checks. Generated examples and approved templates must compile against the public package API.

Do not update visual baselines to hide an unexplained difference.

## Release and compatibility

- The repository is public and MIT licensed.
- Stable distribution uses immutable GitHub SemVer tags.
- Consumers install reviewed releases, never a moving `main` branch.
- Publishing a release does not edit, merge, deploy, or require central registration from a consumer.
- Consumers may opt into Renovate with the generic rule in `docs/examples/consumer-renovate.json`; schedules and dashboards remain consumer-owned.
- A consumer update is adoptable only when its manifest and lockfile agree on the immutable tag and commit, its own compatibility checks pass, release impact is reviewed, and the pull request is merged manually.
- After merge, verify the consumer's configured deployment signals and deployed product before reporting adoption complete.
- Consumers may run `npx ai-created-ui-agent consumer-status` on a schedule to make staleness visible.
- Public exports, token names, defaults, semantics, and controlled-state models are compatibility contracts.
- Breaking changes require a migration path, release notes, design and engineering approval, and a major release.

## Scope-specific instructions

Nested `AGENTS.md` files may add framework or directory-specific rules. They cannot override this root contract. The playground instruction file includes version-specific Next.js rules that must be read before changing the playground.

## Communication standard

State which canonical contract and archetype you used, which exceptional states you implemented, and which validations passed. If a rule cannot be satisfied, report the exact constraint and proposed exception instead of silently deviating.
