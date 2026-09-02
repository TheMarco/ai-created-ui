# Changelog

Notable changes to `@ai-created/ui` are recorded here. Entries are written and reviewed by people when the change is made. Versions are not inferred from commit messages.

## [Unreleased]

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
