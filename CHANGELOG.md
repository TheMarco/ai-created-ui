# Changelog

Notable changes to `@ai-created/ui` are recorded here. Entries are written and reviewed by people when the change is made. Versions are not inferred from commit messages.

## [Unreleased]

## [1.4.0] - 2026-09-03

### Added

- The specification portal has a top-level `/agents` route that explains how coding agents query the machine-readable contract, which validation rejects design-system drift, and how a departure becomes an explicit, owned, expiring exception. Primary navigation now points `Agents` at that page; the canonical agent contract stays in `/guidelines/assets#agent-contract`.
- `npm run docs:check` verifies the version, component, export, guideline, template, policy-rule, and agent-check counts published by the `/agents` page against their owning sources.
- `/foundations` is a top-level route carrying the canonical foundation reference: design tokens, color, typography, spacing and layout, motion, and themes. Primary navigation points `Foundations` at it, and anchors that used to live on the overview route redirect to their new home.
- A global footer and a header version link expose the current release, GitHub source, releases, changelog, license, and the machine-readable context files. Every value derives from `package.json`.
- Browser coverage for the route map, active navigation state, internal-link resolution, the footer release facts, and 200% text zoom on the overview and foundations routes.

### Changed

- `/` is a product-level overview rather than a second reference manual. The foundation sections moved to `/foundations`, the live component specimens moved to `/components`, and the duplicated component API reference was removed in favor of the per-component specifications.
- The Button icon-only contract states one size. Construction guidance said a fixed 36px square while the visual specification and `src/components/Button.tsx` both use 44px; `npm run api:check` now derives square control geometry from the component source and rejects any documented size that disagrees.
- Product-specific AI-Created navigation and routes no longer appear as universal system rules. `DESIGN-SYSTEM.md` and the `approvedArchetypes` route examples in `ai-created-ui.config.json` use generic notation, and the reusable page archetypes remain canonical.
- The portal derives its countable facts, version, and license from `package.json`, `design-system.manifest.json`, `consumers.json`, `templates/agent/manifest.json`, and the design-policy schema instead of restating them.
- `DSCodeBlock` code regions are keyboard focusable and carry an accessible name, so a horizontally scrolling sample can be reached and scrolled without a pointer.

### Fixed

- The portal header, the foundation section rail, the type-scale specimen, and the theme token reference no longer push the page sideways at 200% text zoom.
- The Principal Specification now identifies elevation as a canonical token family, matching `styles/tokens.css`, the Tailwind preset, and the top-level Foundations reference. `npm run docs:check` rejects the stale non-canonical description if it returns.
- The overview describes consumer-owned blocking validation accurately instead of implying every consumer runs an identical check suite, and its page and Open Graph titles now match the overview proposition.

## [1.3.5] - 2026-09-02

### Changed

- The shared Dialog, Modal, and ConfirmDialog close glyph is now 24px within its unchanged 44px interaction target.

## [1.3.4] - 2026-09-02

### Changed

- Dialog, Modal, and ConfirmDialog now use one compact shared header pattern with 12px vertical padding, a fixed 44px close target, and a fixed 16px close glyph positioned 20px from the top and logical end.

### Fixed

- Modal and ConfirmDialog close controls no longer draw a border on hover; all overlay close controls use the same color-only hover treatment and visible keyboard-focus outline.

## [1.3.3] - 2026-09-02

### Fixed

- Dialog, Modal, and ConfirmDialog close glyphs now align with the header content inset while preserving their 44px target and logical positioning in right-to-left layouts.

## [1.3.2] - 2026-08-30

### Fixed

- Space Grotesk visual regression coverage now tolerates the measured Linux/macOS antialiasing variance while retaining fixed capture geometry.

## [1.3.1] - 2026-08-30

### Fixed

- Visual regression coverage now records the intentional control-boundary and semantic-feedback contrast changes and stabilizes typography specimen height across macOS and Linux Chromium.

## [1.3.0] - 2026-08-30

### Added

- Nine persisted, theme-aware accent schemes: red, green, blue, orange, yellow, purple, teal, pink, and magenta.
- `ThemeProvider` now supports controlled accents (`accent`/`onAccentChange`) and uncontrolled defaults (`defaultAccent`), with documented storage precedence and fixed-accent setup.
- Consumer-visible accessibility tuning: light red and light status colors are darker for tinted-surface contrast, and legacy `red*` semantic aliases now follow the active accent family.
- Browser-enforced dark and light contrast contracts for focus rings, status text, control boundaries, accent text, and filled actions.
- Semantic destructive-action, on-action, control-boundary, elevation, and overlay-layer tokens.

### Changed

- Dialog and Modal now share one size scale, icon-only actions use 44px targets, and Tooltip portals with viewport flip/clamp positioning.
- Consumer setup now documents the required type root, fonts, pre-hydration theme initialization, and native color-scheme behavior.

### Fixed

- Design-policy validation now catches bare stock palettes and unapproved named radii/shadows and fails accidental zero-file scans.
- Light-mode focus and semantic status colors now meet their applicable contrast contracts, and interactive boundaries no longer reuse passive card borders.
- Primary and destructive actions use distinct treatments, ordinary confirmations regain a primary affordance, Tooltip supports hover travel and Escape dismissal, and theme transition overrides are removed after completion.

## [1.2.2] - 2026-08-30

### Added

- A complete human and machine consumer-adoption contract covering Renovate scheduling and manual recovery, manifest-to-lockfile release verification, required compatibility checks, manual merge, deployment verification, and visible currency monitoring.

## [1.2.1] - 2026-08-30

### Changed

- The specification homepage now identifies `@ai-created/ui` as the open-source React design system behind AI-Created and Human, Actually before introducing its documentation paths.

### Fixed

- `FieldGroup` now solely owns the Field family’s 8px vertical rhythm, preventing labels and hints from accumulating child margins, aligning text controls with adjacent Dropdown triggers, and allowing both families to reflow without intrinsic-width overflow at narrow widths and 200% text zoom.

## [1.2.0] - 2026-08-29

### Added

- Optional attribution guidance and a ready-to-copy credit linking to `ui.ai-created.com`.
- A searchable living specification site with dedicated pages for all 22 documented component, provider, utility, and motion-helper entries.
- A Storybook-style workbench with interactive production specimens, URL-shareable control states, synchronized copy-ready JSX, setup instructions, and reviewed anatomy, visual, token, state, accessibility, implementation, usage, API, and testing contracts.
- A principal-level specification portal covering foundations, Figma-equivalent construction, product patterns, content design, accessibility standards, governance, and reusable asset distribution.
- Complete construction and governance metadata for all 22 documented entries, including design properties, resizing, slots, localization, RTL, responsive behavior, ownership, maturity, and change policy.
- A generated DTCG-shaped design-token JSON download with dark and light mode metadata and validation that prevents drift from canonical CSS.
- A universal AI-agent contract with a generated machine manifest, concise and exhaustive context files, and a versioned JSON query CLI.
- Blocking token, Tailwind, public API, package-import, style-policy, template, and generated-context parity checks through `npm run agent:check`.
- Six production page templates and a clean consumer fixture covering every public runtime export and the complete exceptional-state model.
- A structured, owner-accountable, expiring exception ledger for justified product-local departures from the system.
- A task-oriented specification homepage with direct paths for components, principal guidance, and agent resources, including complete mobile navigation.
- A blocking documentation-contract check plus contributor, release, and propagation guidance that keeps human and machine workflows aligned.
- A canonical consumer registry, release-currency CLI, and reusable scheduled workflow that turns downstream staleness into a failing check.

### Fixed

- Consumer compile fixtures no longer use a deployable `package.json`, preventing hosting integrations from misidentifying test scaffolding as a new application.

## [1.1.1] - 2026-08-27

### Fixed

- `ThemeToggle` now has a visible surface, border, and 40px target at rest so the dark/light control does not disappear into surrounding navigation.

### Added

- MIT licensing, contribution guidance, and a private vulnerability-reporting policy for the public source repository.

### Changed

- Consumer installation and CI guidance now use credential-free public HTTPS Git tags while npm registry publication remains disabled.

## [1.1.0] - 2026-08-27

### Added

- Root quality gates for typechecking, linting, component behavior, accessibility, production builds, package contents, browser smoke tests, and visual regression.
- A minimal reference and semantic token architecture with documented token-creation rules.
- Audited component contracts, keyboard coverage, accessibility behavior, and exported public types.
- A complete playground component reference with reviewed API, state, composition, and accessibility guidance.
- GitHub-only SemVer release governance, tag validation, and consumer update guidance.
- Consumer-local compatibility contracts, CI templates, and onboarding guidance for current and future applications.

### Changed

- The package remains raw TypeScript source, but its public package boundary is now verified before release.
- Dialog and modal families share a tested Headless UI behavior foundation without changing their public composition APIs.

## [1.0.0] - 2026-04-10

### Added

- Initial private GitHub-distributed design-system package.
