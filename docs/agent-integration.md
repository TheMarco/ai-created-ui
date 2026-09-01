# AI agent integration

`@ai-created/ui` gives coding and design agents a machine-readable contract, reviewed page templates, and blocking drift checks. The goal is zero undetected design-system drift: an agent either follows the system, fails validation, or records a narrow exception for human review.

No static rule can guarantee that every product decision is correct. Human review still owns information architecture, content quality, accessibility judgment, and whether a new capability belongs in the shared system. The tooling prevents silent invention around the decisions that are already canonical.

## Give an agent context

Use the smallest artifact that covers the task:

- `llms.txt` is the short operating brief and resource index.
- `llms-full.txt` is a complete readable component, guideline, template, and validation reference.
- `design-system.manifest.json` is the structured contract for tools and agents.
- `playground/public/design-system/tokens.json` is the generated DTCG-shaped token artifact.
- `templates/agent/manifest.json` describes the approved page templates.
- `AGENTS.md` is the repository operating contract.

The manifest and context files are generated projections. They never override the canonical runtime source, token CSS, Tailwind preset, registries, or principal guidelines.

## Query instead of scraping

The repository CLI returns stable JSON:

```bash
npm run agent:query -- context
npm run agent:query -- list-components
npm run agent:query -- component button
npm run agent:query -- guideline accessibility
npm run agent:query -- templates
npm run agent:query -- template dashboard
```

From an installed package, the same interface is available as `npx ai-created-ui-agent`. The query commands read the contract bundled with that exact package version.

In a consumer repository, run `npx ai-created-ui-agent consumer-status` to compare the installed immutable tag with the latest reviewed GitHub Release. The command emits JSON, exits 1 when the consumer is stale, and exits 2 when the dependency or release metadata is invalid.

The template command includes the complete TSX source. This makes the same contract usable from Codex, Claude Code, local scripts, CI, or an MCP server without coupling the integration to portal markup.

## Configure a consumer

Copy `ai-created-ui.config.json` and its schema into the consumer, then adjust only repository paths and the reviewed archetype list. Keep the canonical package name and primitive inventory aligned with the installed release.

Run policy validation against product source:

```bash
node node_modules/@ai-created/ui/scripts/validate-design-policy.mjs --config ai-created-ui.config.json src
```

The validator rejects direct reference-token use, raw colors, internal package imports, theme-specific palette utilities, arbitrary font/color/radius/shadow values, and detectable local primitive copies.

A target that resolves to zero files fails validation so a bad path or over-broad ignore cannot produce a false green check. Use `--allow-empty` only in tooling that intentionally probes an optional or fully ignored path.

## Preserve the appearance contract

Agents must keep accent selection at the application root and continue using semantic utilities inside product UI. The supported accents are `red`, `green`, `blue`, `orange`, `yellow`, `purple`, `teal`, `pink`, and `magenta`; destructive and feedback colors never follow that choice.

- Persisted user preference: use `<ThemeProvider defaultAccent="blue">`. The provider resolves a valid saved accent before an existing `html[data-accent]`, then `defaultAccent`, then red. `useTheme().setAccent()` updates the document and persists the choice.
- Fixed or externally controlled product accent: use matching `<html data-accent="blue">` and `<ThemeProvider accent="blue">`. A controlled accent wins over storage and changes only when the prop changes. `onAccentChange` reports requested changes without persisting them.
- First paint: preference mode must server-render the fallback `data-accent` matching `defaultAccent`, then let the validated README script replace it only with a valid stored accent. Fixed mode must set its controlled `data-accent` in server markup and use a theme-only initialization script so saved accent storage cannot cause a flash.

Agents must import `accentNames` rather than maintaining a second list, and must use `--color-accent*`, `--color-action-primary*`, `--color-focus`, and `--color-selection` through the shared preset rather than selecting named palette steps.

## Exceptions

If composition cannot satisfy a real requirement, keep the first implementation product-local. A validator exception must identify one rule, narrow file paths, a concrete reason, an accountable owner, and a future review date. Vague, broad, or expired exceptions are configuration errors and do not suppress findings.

## Required gates

Run the unified agent contract gate locally and in CI:

```bash
npm run agent:check
npm run validate
```

`agent:check` verifies generated tokens and manifests, Tailwind-to-token parity, documented component API parity, policy compliance, templates, and generated agent context. `validate` includes this gate plus typechecking, lint, all unit and accessibility tests, a production portal build, and package-boundary verification.

Browser smoke, accessibility interaction, semantic-token contrast, and visual regression checks remain a separate required CI job because they need a real browser. Contrast coverage includes both themes and the focus, status, control-boundary, accent, and filled-action contracts.

## Repository enforcement

The source repository workflow runs `npm run validate` and `npm run test:browser` for every pull request and every push to `main`. Branch protection must require the `Validate design system` check, require pull requests, resolve review conversations, and prohibit force pushes and branch deletion. A local pass is evidence for iteration; the protected GitHub check is the merge authority.

The release workflow repeats the same validation against the exact version tag before it creates a GitHub Release. Generated projections are checked without writing in CI, so a stale manifest, token export, or agent context fails instead of being silently repaired.

## Propagation to consumers

Consumers install immutable reviewed tags, never `main`. Publishing a release does not mutate an existing consumer. A consumer may opt into Renovate using `docs/examples/consumer-renovate.json`; Renovate then proposes a dependency pull request without requiring registration in this repository. That pull request must run the consumer's own typecheck, lint, tests, design-policy validation, accessibility checks, and production build before review and manual merge. The source repository proves the package contract; consumer CI proves the integration contract. Neither substitutes for the other.

Scheduled currency monitoring with `.github/workflows/consumer-currency.yml` is optional. It makes a delayed update visible but does not open, merge, deploy, or verify a change. Teams with many applications may maintain their own inventory or shared Renovate preset; that operational layer remains consumer-owned.

When a consumer finds a missing shared capability, keep the first implementation local, contribute the generalized capability here, release a new tag, and adopt it through the dependency pull request. Do not copy or patch package primitives in place.

## MCP and other adapters

An MCP integration should expose the manifest, query commands, templates, and validation command rather than defining a second schema. The JSON files and CLI are the stable protocol layer; an adapter is only transport. This keeps Codex, other coding agents, and future design-tool connections on the same versioned contract.
