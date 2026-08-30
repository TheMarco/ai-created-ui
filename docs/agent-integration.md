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
npm run agent:query -- consumers
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

## Exceptions

If composition cannot satisfy a real requirement, keep the first implementation product-local. A validator exception must identify one rule, narrow file paths, a concrete reason, an accountable owner, and a future review date. Vague, broad, or expired exceptions are configuration errors and do not suppress findings.

## Required gates

Run the unified agent contract gate locally and in CI:

```bash
npm run agent:check
npm run validate
```

`agent:check` verifies generated tokens and manifests, Tailwind-to-token parity, documented component API parity, policy compliance, templates, and generated agent context. `validate` includes this gate plus typechecking, lint, all unit and accessibility tests, a production portal build, and package-boundary verification.

Browser smoke, accessibility interaction, and visual regression checks remain a separate required CI job because they need a real browser.

## Repository enforcement

The source repository workflow runs `npm run validate` and `npm run test:browser` for every pull request and every push to `main`. Branch protection must require the `Validate design system` check, require pull requests, resolve review conversations, and prohibit force pushes and branch deletion. A local pass is evidence for iteration; the protected GitHub check is the merge authority.

The release workflow repeats the same validation against the exact version tag before it creates a GitHub Release. Generated projections are checked without writing in CI, so a stale manifest, token export, or agent context fails instead of being silently repaired.

## Propagation to consumers

Consumers install immutable reviewed tags, never `main`. A released tag should produce a Renovate dependency pull request in each consumer. That pull request must run the consumer's own typecheck, lint, tests, and production build before review and merge. The source repository proves the package contract; consumer CI proves the integration contract. Neither substitutes for the other.

`consumers.json` is the canonical downstream inventory. Every registered repository must also call `.github/workflows/consumer-currency.yml` on a schedule so a missing or delayed Renovate update becomes a visible failing check rather than silent staleness.

When a consumer finds a missing shared capability, keep the first implementation local, contribute the generalized capability here, release a new tag, and adopt it through the dependency pull request. Do not copy or patch package primitives in place.

## MCP and other adapters

An MCP integration should expose the manifest, query commands, templates, and validation command rather than defining a second schema. The JSON files and CLI are the stable protocol layer; an adapter is only transport. This keeps Codex, other coding agents, and future design-tool connections on the same versioned contract.
