# AI-Created Design System

This file is the canonical design contract for the public AI-Created site.

If the live UI changes, update this file and the living specification in the same pass.

## Living Specification

The public design-system portal has three layers:

- `/` is the design-system entry hub and visual foundations overview.
- `/components` is the searchable component workbench and implementation reference.
- `/guidelines` is the principal-level operating specification for foundations, construction, patterns, content, accessibility, governance, and reusable assets.

Component documentation is canonical only when the live production specimen, public API, implementation examples, Figma-equivalent construction contract, accessibility contract, and tests describe the same behavior. System guidance is canonical only when it names an owner, maturity, review cadence, source of truth, and required outcomes.

`styles/tokens.css` remains the token source of truth. The downloadable `playground/public/design-system/tokens.json` artifact is generated from it and must pass `npm run tokens:check`. Do not edit generated token JSON by hand.

## Purpose

AI-Created is not a generic portfolio and not a services funnel.

The design system exists to support:

- shipped products
- authored thinking
- proof of execution
- a clear, disciplined product-lab identity

The system should feel:

- editorial, not corporate
- restrained, not sterile
- premium, not flashy
- dark-native, not dark-only

## Non-Negotiables

1. Product-first beats spectacle.
2. Shared rules beat route-level improvisation.
3. Serif is for tone, not for most UI.
4. Red is an accent, not a second color system.
5. Light mode must feel intentionally designed, not inverted.
6. Accessibility is part of the visual system, not a post-pass.
7. Motion must explain hierarchy or state. If it does not, remove it.
8. Legacy routes should redirect. They should not stay alive as alternate design systems.
9. Promote the primary metric, action, or object before adding more helper chrome.
10. Workflow navigation and support utilities are different systems. Do not blur them for convenience.

## Information Architecture

Public navigation is:

- Home
- Products
- 0→1 Stories
- Lab Notes
- Media
- About
- Design System

Rules:

- Do not add a new top-level nav item without a strong IA reason.
- `0→1 Stories` stays top-level. It is part of the brand language.
- `Resume` lives under `About` as a context page, not as a primary pillar.
- Deprecated routes should redirect to the current IA rather than keep old layouts alive.
- Workflow steps belong in task navigation. Help, settings, and other support utilities should stay adjacent to the workflow instead of masquerading as peer tasks.

## Page Archetypes

Every new page must fit one of these patterns.

### 1. Home

Purpose:
- establish the thesis
- prove the work
- move people into products, stories, or contact

Expected structure:
- immersive hero
- proof sections before opinion-heavy sections
- featured work modules
- contact section at the bottom

### 2. Browse

Routes:
- `/products`
- `/stories`
- `/lab-notes`
- `/media`

Purpose:
- help people scan and choose

Expected structure:
- route-specific hero
- one clear browsing pattern
- filters only when they improve findability
- strong metadata hierarchy

### 3. Detail

Routes:
- `/products/[slug]`
- `/stories/[slug]`
- `/lab-notes/[slug]`

Purpose:
- keep one item in focus

Expected structure:
- route context or breadcrumb
- headline and metadata
- primary proof block
- related links back into the system

### 4. Context

Routes:
- `/about`
- `/resume`

Purpose:
- build credibility and explain the builder behind the work

Expected structure:
- direct framing
- structured credibility blocks
- clear tie-back to products and shipped work

### 5. Workspace

Routes:
- internal tools
- dashboards
- multi-step product flows

Purpose:
- help users do real work with clear hierarchy and low-noise control surfaces

Expected structure:
- task navigation for real workflow stages
- support utilities adjacent to the workflow, not inside it
- a compact summary or overview row before the active work area
- one focused workspace open at a time
- calm capacity and empty states with direct next actions

## Product Interface Patterns

These patterns came out of shipped product UX work and are now part of the canonical system contract.

### Workflow Navigation vs Utility Actions

- Workflow navigation should represent actual stages of work.
- Help, settings, audits, and other support utilities belong adjacent to the workflow, not inside the same tablist unless they are true peer destinations.
- Right-aligned utility links or buttons are preferred over fake workflow tabs.

### Calm Capacity States

- Avoid warning banners for expected product conditions like storage or case limits.
- Prefer a capacity component with a clear metric, a compact unavailable affordance, and the next two useful recovery actions.
- Auto-delete or background cleanup rules are secondary helper copy, not the headline.

### Overview + Workspace

- If a page contains multiple tools or outputs, users should scan first and work second.
- Start with a compact overview row, summary cards, or status band.
- Open one focused workspace beneath it instead of stacking several mini-products in one long vertical document.

### Toolbars and Dense Controls

- Controls that share a row should share height, alignment, and family resemblance.
- One trailing control may flex to fill remaining width, but it should still read as part of the same toolbar.
- Avoid mixed-height dropdowns or lone controls dropping to their own row while horizontal space still exists.

### Settings as Control Center

- Settings should feel like a control center, not a form dump.
- Prefer status-first cards for reusable defaults, connected sources, and providers.
- Keep destructive actions demoted into a danger zone rather than making them peer destinations.

### Honest Empty States

- If an action has nowhere useful to go yet, disable it or replace it with explanatory copy.
- Do not force users to click into emptiness just to learn that nothing is there yet.
- Empty states should clearly explain what will appear there and how to unlock it.

## Color System

### Token Architecture

The token flow is `reference value -> semantic contract -> Tailwind utility or component CSS`.

- Reference tokens such as `--ref-neutral-950` and `--ref-red-500` name only opaque values that the system actually uses. They are not exposed as Tailwind palette utilities and are not a license to add speculative scales.
- Semantic tokens such as `--color-bg`, `--color-text2`, `--color-accent`, and `--color-action-primary` express UI intent. Components should consume this layer.
- Layout and motion tokens cover the small set of shared values that already repeat. Component geometry and behavior-specific timing remain local.
- Component-specific tokens are reserved for a real theme-aware contract that cannot be expressed by the shared semantic layer. The hero media system is the current exception.

Alpha colors remain semantic literals where introducing RGB-channel primitives would add complexity without reuse. This keeps the palette small and the browser output stable.

### Public Semantic Tokens

- Foundations: `--color-bg`, `--color-surface`, `--color-surface2`, `--color-border`, `--color-border-strong`
- Text: `--color-text`, `--color-text2`, `--color-text3`
- Accent: `--color-accent`, `--color-accent-muted`, `--color-accent-hover`, `--color-accent-border`
- Actions: `--color-action-primary`, `--color-action-primary-hover`
- Interaction: `--color-focus`, `--color-overlay`, `--color-highlight`, `--color-selection`
- Feedback: `--color-success`, `--color-warning`, `--color-info`, `--color-error`, plus each token's `-surface` and `-border` variants

The established `--color-red`, `--color-red2`, `--color-red-hover`, `--color-red-border`, `--color-red-solid`, and `--color-red-solid-hover` names remain supported public aliases. They are not deprecated. New shared code may use the intent names when the role is known, while existing consumers can migrate only when convenient.

### Layout, Radius, and Motion Tokens

- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`
- Layout: `--layout-container-max`, `--layout-gutter`, `--layout-gutter-mobile`
- Motion: `--motion-fast`, `--motion-base`, `--motion-slow`

### Usage Rules

- `bg` is page background.
- `surface` is the primary module and card shell.
- `surface2` is for nested controls or quieter inner layers.
- `text` is primary content.
- `text2` is supporting copy.
- `text3` is metadata only.
- `accent` is the brighter, warmer red for text, rules, indicators, and selective emphasis. `red` is its established compatibility name.
- `red-hover` and `red-solid-hover` are state tokens. They support interaction feedback and should not be presented as equal palette roles.
- `action-primary` is the filled action red for buttons, pills, and other surfaces that carry white text. `red-solid` is its established compatibility name.
- `red2` and `red-border` are supporting tokens for overlays, glows, and borders. They are not primary brand colors.
- `success`, `warning`, `info`, and `error` are semantic feedback tokens for system states. They should not be replaced with brand red unless the UI is actually a primary action.
- Avoid raw `white` and `black` utilities unless there is a documented exception.

### Token Addition Rules

1. Reuse an existing semantic token when its meaning matches.
2. Add a semantic token only for a role that is shared or genuinely theme-aware. Define both themes when its value changes.
3. Add a reference value only when an opaque palette value is used by the semantic layer. Do not build a complete scale in advance.
4. Add a component-specific token only after a shared semantic token would be misleading.
5. Preserve existing public token names. Use aliases for compatibility instead of broad renames.
6. Keep one-off spacing, geometry, shadows, and behavior-specific motion local to the component.

### Light Mode Rule

Light mode uses warm neutrals. It should feel calm, not washed out.

Because the palette is softer:

- do not rely on `text3` for important copy
- test hover and border states in both themes
- make sure primary actions still carry enough contrast
- use `red-solid` for any filled red surface that carries white text

## Typography

### Families

- `Instrument Serif` for display moments only
- `Space Grotesk` for almost all UI and body copy
- system monospace for metadata, code, and structural labels

### Typography Rules

- Use serif for heroes, section titles, and selective editorial emphasis.
- Do not use serif for dense UI, navigation, filters, or forms.
- Most cards, buttons, labels, and body copy should stay in `Space Grotesk`.
- Metadata should use monospace sparingly and consistently.

### Role Recipes

- Hero title: `font-display text-4xl md:text-7xl tracking-wide`
- Section title: `font-display text-3xl md:text-5xl tracking-wide`
- Card title: `font-heading text-lg or text-xl font-medium`
- Body copy: `font-heading text-sm to text-base`
- Metadata: `font-mono text-xs uppercase tracking-wider`

### Scale Note

The root font size is 20px. This makes the site feel slightly larger and more editorial by default.

Do not respond by inventing smaller ad hoc text sizes. Use the system deliberately.

## Spacing and Layout

### Rhythm

- Standard section spacing is `py-20`.
- Standard grid gap is `gap-6`.
- Primary module shell is `bg-surface border rounded-md p-8 md:p-12`.
- Hero framing typically uses `pt-32 pb-20` with centered copy.
- Container max width and transition timing come from shared root variables rather than one-off values.
- Multi-tool product surfaces should prefer an overview row above one active workspace instead of a long stack of unrelated sections.
- Dense action rows should use same-height controls, with one trailing flexible item when needed.

### Radius

- small corners for badges and utility chips
- medium corners for most cards and buttons
- large radii only when there is a strong reason

### Layout Rules

- Prefer a small number of repeated layout recipes over bespoke spacing.
- If a page feels special only because it uses unrelated spacing values, it is probably off-system.
- New templates should inherit from an existing archetype before getting custom layout treatment.

### Responsive Strategy

- Mobile-first with Tailwind breakpoints (`sm`: 640px, `md`: 768px, `lg`: 1024px, `xl`: 1280px)
- Container: `.container-custom` with max-width 1400px, padding 2vw desktop, 6vw mobile
- Content wrappers: `max-w-3xl` for articles, `max-w-4xl` for hero copy, `max-w-6xl` for grids

### Image Patterns

- `aspect-video` for video embeds and thumbnails
- Responsive video embed: `padding-bottom: 56.25%` trick for 16:9
- `next/image` with `fill` + `sizes` prop for responsive images
- `object-cover` default, `object-contain` when full image visibility matters
- Lazy loading default, `priority` for above-fold heroes

## Accessibility

### Baseline Rules

- Every page must support the shared skip link target: `#main-content`.
- Keyboard navigation must work across primary nav, filters, cards, forms, and inline actions.
- Focus must remain clearly visible in both themes.
- Reduced-motion preferences must be respected.
- Decorative images and icons should be hidden from assistive tech.
- Success, error, and async states should be announced when they matter.
- Focus rings use the shared global outline contract. Do not replace it with route-specific `focus:ring-*` styling.
- Disable or replace dead-end actions when there is no meaningful destination yet.
- Workflow tabs and support utilities should remain semantically distinct.

### Selection

`::selection` uses `rgba(255, 75, 43, 0.22)` (red accent at 22%).

### Focus Strategy

- All interactive elements use `focus-visible` (not `focus`)
- 2px solid `var(--color-focus)` with 3px `outline-offset`
- Applies to `a`, `button`, `input`, `textarea`, `select`, `summary`, `[tabindex]`

### ARIA Patterns Used

- `aria-current="page"` on active nav links
- `aria-expanded` on hamburger menu toggle
- `aria-controls` linking buttons to controlled panels
- `aria-pressed` on toggle filter buttons
- `aria-busy` on forms during submission
- `aria-live="polite"` with `role="status"` for non-error updates
- `role="alert"` for error messages
- `aria-labelledby` connecting sections to their headings
- `role="switch"` with `aria-checked` on toggle components
- `role="tooltip"` with `aria-describedby` on tooltip triggers
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` on sliders
- `role="radiogroup"` with `fieldset`/`legend` for radio groups

## Shared UI Primitives

These are the preferred starting points before building route-specific markup:

- `Badge` for inline status labels, category markers, counters, and semantic color indicators. Six variants: default, muted, success, warning, error, info
- `Button` for primary, destructive, secondary, ghost, filter, and icon actions
- `Surface` for cards, panels, callouts, and semantic status containers
- `Notice` for semantic inline feedback, confirmations, warnings, and errors
- `Skeleton` for quiet loading placeholders that preserve layout without inventing new chrome
- `TextInput` and `TextArea` for form fields and browse search
- `Tabs` for switching between related views with full keyboard navigation
- `Checkbox` for binary toggles with native input semantics and styled indicator
- `Dropdown` for single-select option lists with Headless UI Listbox, full keyboard nav, and type-ahead
- `RadioGroup` for single-select groups using native radio inputs in a fieldset with legend
- `Slider` for range input with styled track, red-solid fill, and formatted output
- `Toggle` for on/off switches using role="switch", visually distinct from checkboxes
- `Dialog` for modal dialogs with Headless UI, focus trap, Escape/backdrop close, and size variants
- `Tooltip` for contextual hints on hover, focus, and touch with configurable position and delay
- `ThemedHeroImage` for route-level hero media

Rules:

- Reach for these primitives before copying utility strings between routes.
- If a primitive needs a new variant, add it there instead of inventing a local exception.
- The design-system page should demo the real primitives whenever possible so it doubles as regression coverage.
- Product patterns such as capacity states, overview-plus-workspace layouts, and status-first settings cards should be documented here once they prove out in shipped work.
- `aria-hidden="true"` on decorative SVGs and images
- `sr-only` class for screen-reader-only text

### Keyboard Patterns

- Escape: closes modals (exits fullscreen first), closes mobile menu
- F: toggles fullscreen in video modal
- Tab: focus trap in modals, natural flow elsewhere
- Enter: form submission, button activation
- Arrow Left/Right: navigate between tabs (roving tabindex)
- Home/End: jump to first/last tab
- Space: toggle checkbox state, activate toggle switch
- Arrow Up/Down: navigate dropdown options, move radio group selection
- Enter/Space: select dropdown option
- Type-ahead: jump to matching dropdown option

### Touch Targets

- All interactive controls must have a minimum 44x44px touch target (WCAG 2.5.5).
- For small visual elements (radio dots, toggle tracks, checkboxes), the tappable label row provides the full target via `min-h-[44px]`.
- Dialog close buttons use explicit `h-11 w-11` (44x44px) with a centered icon.
- Dropdown options use `py-3` to ensure adequate height.
- Slider thumbs are 22px with `touch-action: none` to prevent scroll hijacking during drag. The track wrapper uses `min-h-[44px]`.
- Tooltips support touch via tap-to-toggle and outside-tap-to-dismiss.

### Contrast Rules

- `text3` is metadata only.
- Do not use `text3` for navigation, form labels, helper text, or primary calls to action.
- Filled red controls with white text must use `red-solid` and `red-solid-hover`, not the brighter accent red.
- Check dark and light theme contrast before shipping subtle states like borders, placeholders, and hover treatments.

### Naming and Semantics

- Interactive elements need explicit accessible names.
- Breadcrumbs, search, footer nav, and other repeated structures should use the appropriate landmark or ARIA label.
- If a control opens a new tab, communicate that to assistive tech.
- Prefer real lists, fieldsets, legends, headings, and buttons over div-only structures.

## Design Elements and Accessibility

### Color

- `text` and `text2` carry real reading work.
- `text3` is metadata only.
- Focus uses `--color-focus`; do not invent ad hoc focus colors.
- The brighter accent red does not carry white body text on dark UI. Filled red controls use `--color-red-solid`.
- Red supports emphasis and action, but should never be the only signal for meaning.

### Typography

- The 20px root size is intentional and should keep default reading sizes comfortable.
- Dense UI stays in `Space Grotesk`.
- Serif is expressive, not structural.
- Heading levels must remain semantically correct regardless of how they are styled.

### Spacing and Layout

- Every page must expose `#main-content` for the shared skip link.
- Visual layout changes cannot break source order or keyboard order.
- Landmarks, section headings, and clear grouping are part of layout quality.

### Page Archetypes

- Home needs one clear H1, an obvious CTA path, and proof early in the flow.
- Browse pages need labeled filters, result feedback, and empty states.
- Detail pages need route context, readable hero copy, and clear related navigation.
- Context pages need structured credibility content rather than decorative information dumps.
- Workspace pages need scan-first summaries, one active work area at a time, and support utilities separated from task navigation.

### Components

- Cards that act like links need one clear accessible name and visible focus.
- Forms need labels, helper copy when useful, status announcements, and appropriate autocomplete.
- Browse controls need real fieldsets, legends, and pressed/selected states.
- Media controls and dialogs must be keyboard-usable and correctly labeled.
- Disabled actions should explain why they are unavailable when users need more context.
- Mixed toolbars should preserve consistent hit targets and control height.

### Motion

- `prefers-reduced-motion` is non-negotiable.
- Motion may reinforce hierarchy or state, but must never be required for comprehension.
- Continuous motion belongs only to genuine state communication, not atmosphere on core routes.

### Theme

- Dark and light themes must both preserve contrast, focus visibility, and affordance clarity.
- Theme-specific exceptions should be rare and documented.
- A theme toggle must remain keyboard-usable and clearly labeled.

## Components

### Canonical Shared Components

- Header
- Footer
- buttons and text links
- `Badge`
- `StatusPill`
- `PlatformBadge`
- `StackChip`
- `ProductCard`
- `ArtifactCard`
- `ArticleLayout`
- `ThemedHeroImage`
- editorial cards
- form fields (`FieldGroup`, `TextInput`, `TextArea`, `FieldLabel`, `FieldLegend`, `FieldHint`)
- `Checkbox`, `RadioGroup`, `Toggle`, `Dropdown`, `Slider`
- `Tabs`
- `Modal` (composable), `Dialog` (Headless UI), `ConfirmDialog`
- `Tooltip`
- `Notice`, `Skeleton`
- `EmptyState`, `ErrorReport`
- browse controls

### Component Rules

- Reuse an existing shell before inventing a new card style.
- Do not add generic components for completeness.
- Keep metadata compact and mono-driven.
- Use semantic border tokens such as `border-border` and `border-border-strong`, not raw `border-white/*` utilities, for production components.
- For multi-tool product pages, prefer overview cards plus one active workspace over long stacked interfaces.
- If an action cannot do anything useful yet, disable it or reframe it instead of shipping a dead-end click.
- Buttons are not fully documented until default, hover, focus-visible, loading, and disabled states are shown.
- Forms should look quiet and trustworthy, not overdesigned.
- If a component appears on one route only, question whether it belongs in the system.

### Component API Conventions

- Preserve the existing controlled contracts. `Checkbox` and `Toggle` use `checked` plus `onChange(boolean)`. `RadioGroup`, `Dropdown`, `Slider`, and `Tabs` use `value` or `active` plus `onChange(value)`. These callback names are public API and should not be renamed for stylistic uniformity.
- Controlled components remain controlled-only until a real consumer needs an uncontrolled mode. Do not add `defaultValue` or `defaultChecked` speculatively, and never mix controlled and uncontrolled state internally.
- Components rooted in a native element should pass through that element's attributes when the public API already supports them. Add native escape hatches to narrower controls only when a consumer need establishes the shape and collision policy.
- Forward refs to the component's meaningful native root. Form inputs expose their input or textarea, `RadioGroup` exposes its fieldset, button controls expose their button, and content/layout primitives expose their rendered root.
- Export public prop and style-option types from `@ai-created/ui`, not only from internal module paths.
- Keep `className` as the styling escape hatch. Defaults remain authoritative, and overrides must not remove semantics, accessible names, focus visibility, disabled behavior, or required hit targets.
- Icon-only controls require an explicit accessible name, normally `aria-label`. Decorative icons inside named controls use `aria-hidden="true"`.
- Field associations are explicit: `FieldLabel.htmlFor` matches the control `id`; `FieldHint.id` is referenced from the control's `aria-describedby`. `FieldLegend` is styled supporting text, not a semantic `<legend>`.
- Tabs that render panels should pass one stable `id` to `Tabs` and the same value as `tabsId` to `useTabPanelProps`. Omitting the shared id intentionally omits ARIA relationships rather than emitting mismatched ids.
- Variant names and visual meanings are compatibility contracts. Add aliases and a migration path before renaming or removing one.

### When to Add a Component

- First use: solve the product problem with existing primitives and route-level composition.
- Second similar use: identify the repeated pattern and define the shared interaction and accessibility contract.
- Promote a new shared component only when the pattern repeats, clearly spans routes, or would otherwise create local drift.
- Badges, dropdowns, radio groups, sliders, toggles, dialogs, modals, tooltips, empty states, confirm dialogs, and error reports are now shared primitives. Tooltip + Badge is the standard composition for interactive status pills. Do not add remaining patterns (tables, etc.) until the live site needs them.
- Promote repeated product UX patterns too: calm capacity states, honest empty states, right-aligned utilities, overview-plus-workspace, and status-first settings cards.
- When a component is promoted, update the production usage, `/design-system`, and this file in the same pass.

### Modal / Dialog

Two modal primitives are available:

**`Modal`** is a composable modal system with five sub-components: `ModalOverlay`, `ModalPanel`, `ModalHeader`, `ModalBody`, `ModalFooter`. It preserves that composition API while using Headless UI Dialog internally for portal mounting, focus trapping, Escape handling, scroll locking, nested-dialog stacking, and focus restoration. Use it when you need flexible layouts, custom body content, or multi-section modals. `ConfirmDialog` is a pre-composed alert dialog built on Modal.

**`Dialog`** is the Headless UI-based dialog with automatic focus trap, Escape/backdrop close, and focus restoration. Use it for simpler modals where Headless UI's built-in behavior is sufficient. `VideoModal` extends this pattern with video-specific controls.

Keyboard and focus behavior:

- Escape closes the dialog
- Tab focus trap cycles through focusable elements
- Backdrop click closes
- Focus restores to trigger element on close
- VideoModal adds: F key toggles fullscreen, Escape exits fullscreen before closing

Modal size variants: sm (max-w-md), md (max-w-xl), lg (max-w-3xl), xl (max-w-5xl)
Dialog size variants: sm (max-w-sm), md (max-w-lg), lg (max-w-2xl), xl (max-w-4xl)

Close button uses a 44x44px touch target with a centered icon.

Structural requirements:

- Body overflow is locked while either primitive is open.
- `ModalOverlay` owns `role="dialog"` and `aria-modal="true"`. `ModalHeader` registers its heading and optional description with the dialog. Use `role="alertdialog"` only for urgent confirmation flows.
- A custom modal header that does not use `ModalHeader` must give `ModalOverlay` an explicit `aria-label`.
- `closeOnBackdrop={false}` disables backdrop dismissal without disabling Escape. Omitting `onClose` creates a non-dismissible modal and should be reserved for genuinely blocking work.
- `ConfirmDialog` disables every dismissal path while `loading` and accepts `loadingLabel` for action-specific progress copy.

### Badge

Badge is the shared semantic pill primitive. It uses `rounded-full` with the semantic color triplets (border, surface, text) for each variant.

Variants:

- `default`: neutral counter or tag (border-border, bg-surface2, text-text)
- `muted`: secondary label (border-border, bg-surface, text-text2)
- `success`: completed, passed, strong fit
- `warning`: partial success, moderate signal, in-progress caution
- `error`: failed, no evidence, blocked
- `info`: extracting, running, informational

Usage patterns:

- **Status row**: a horizontal flex-wrap of Badges showing processing state
- **Audit counters**: default-variant Badges showing extracted counts ("12 pages captured", "3 roles extracted")
- **Metadata tags**: muted-variant Badges for secondary classification

Override `rounded-full` with `rounded` via className for compact assessment rows. Override text size with `text-[10px]` for dense metadata.

### Tooltip + Badge Composition

Wrapping a Badge in a Tooltip creates an interactive status pill with hover explanation. This is the standard pattern for audit metadata and fit assessments.

```tsx
<Tooltip content="Strong signal: direct match with concrete evidence.">
  <Badge variant="success" className="cursor-help">strong fit</Badge>
</Tooltip>
```

Rules:

- Always add `cursor-help` to the Badge so users know hover detail is available
- Tooltip provides `aria-describedby` on the Badge automatically
- Use for any label where a one-word status needs supporting context
- For compact assessment rows, override Badge shape: `className="rounded px-1.5 py-0.5 text-[10px] cursor-help"`

### Form States

- Loading: spinner with `aria-busy` on form, disabled submit
- Success: `role="status"` `aria-live="polite"`, auto-dismiss after 5s, green accent
- Error: `role="alert"`, auto-dismiss after 5s, red accent
- Honeypot field for spam prevention (hidden, `tabIndex={-1}`, `aria-hidden`)

### Card Hover System

- Border: `border-border` to `border-border-strong` on hover
- Text: `text-text2` to `text-text` on hover
- Image: `group-hover:scale-[1.02]` with `transition-transform duration-500`
- Lift: `whileHover={{ y: -2 }}` or `y: -4` via Framer Motion
- Use `group` selector for coordinated hover on card links
- Featured cards (ArtifactCard): `border-red-border` to `border-red2` on hover

### Dividers

- Structural: `border-t border-border` (between list items, sections)
- Decorative: `h-px bg-highlight` (subtle full-width)
- Accent: `h-px w-20 bg-red` (under section headers, partial width)

### Breadcrumbs

- `nav` with `aria-label="Breadcrumb"`
- `font-mono text-sm text-text3`
- Slash separator between items
- Current page is plain text (not a link)

### Empty States

The `EmptyState` component is the shared primitive for empty content. It accepts an optional Lucide icon, title, description, and children for action buttons. Uses `Surface` with `muted` variant and `responsive` padding.

- Must always appear when filters or search return no results
- Keep messaging direct: "No articles found." not "Oops, nothing here!"

### Navigation

- Header: fixed top, `z-50`, transparent by default, `bg-bg` with `border-border` on scroll (50px threshold)
- Active link: `text-text` (inactive: `text-text2`)
- Mobile: hamburger with animated 3-line to X transition
- Mobile menu: `bg-surface` with `border-border rounded-md`, closes on navigation
- Nav items use `matchPrefixes` for active state detection across sub-routes

### Icon Sizing

- Small (inline): `w-4 h-4` (form icons, metadata)
- Medium (buttons): `w-5 h-5` (mobile menu, toggles)
- Large (decorative): `w-8 h-8` or larger

### Future Components

These are not in the system yet. When the site needs them, here is how they should be built:

- **Accordion**: Use Headless UI Disclosure. Each item needs a `<button>` trigger with `aria-expanded` and `aria-controls` pointing to the panel. Animate height with CSS grid `grid-template-rows: 0fr`/`1fr` for smooth open/close without JS height measurement. Group multiple items in a section with a shared heading. Consider whether only one item should be open at a time (accordion mode) or multiple (disclosure mode).
- **Toast**: Ephemeral notifications that auto-dismiss. Use a portal to render outside the page flow at a fixed viewport position (bottom-right on desktop, bottom-center on mobile). Each toast needs `role="status"` and `aria-live="polite"` (or `role="alert"` for errors). Stack multiple toasts vertically. Include a close button with a 44x44px touch target. Auto-dismiss after 5s with a pause-on-hover behavior. Animate in/out with opacity and translateY.
- **Popover**: Use Headless UI Popover. Similar trigger and positioning to Dropdown but renders arbitrary content instead of a listbox. Needs focus trap when open, Escape to close, and click-outside to dismiss. Useful for info panels, mini forms, or rich previews.
- **Progress**: A determinate progress bar. Thin horizontal bar with red-solid fill on surface2 track, matching the slider visual language. Needs `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and an accessible label. Consider an indeterminate variant with a repeating animation for unknown durations.
- **Command Palette**: A Cmd+K search overlay. Use Headless UI Combobox inside a Dialog. Needs type-ahead filtering, keyboard navigation, grouped results, and recent/suggested sections. Only worth building when the content library is large enough to justify it.

### Deprecated by Default

These may exist in experiments, but they are not core public-system primitives:

- neon glass cards
- glitch text
- decorative shimmer treatments
- continuous decorative particle systems on core pages

## Motion

### Allowed

- fade and slide reveals
- subtle hover lift
- border emphasis on hover
- state-driven motion for menus, theme toggle, and media

### Avoid by Default

- perpetual ambient motion on core pages
- flashy text effects on public browse/detail routes
- large hover transforms
- animation that competes with reading

### Timing

- entrance motion should usually live in the 0.45s to 0.6s range
- hover motion should feel immediate and small
- stronger motion should be reserved for real state change

### Framer Motion Patterns

- Entry: `initial={{ opacity: 0, y: 20 }}`, `whileInView={{ opacity: 1, y: 0 }}`
- `viewport={{ once: true }}`: animate once on scroll, do not repeat
- Stagger: `transition={{ delay: index * 0.1 }}` for sequential items
- Exit: `AnimatePresence` for mobile menu, theme toggle icon swap
- Hover: `whileHover={{ y: -2 }}` for card lift, `whileHover={{ scale: 1.1 }}` for icon buttons
- Tap: `whileTap={{ scale: 0.85 }}` for toggle buttons

### Motion Implementation

- Shared durations, offsets, easings, and stagger helpers live in `src/lib/motion.ts`
- Prefer imported helpers like `fadeUpMotion`, `subtleHoverMotion`, and `borderHoverMotion` over ad hoc inline timing values
- If a motion pattern repeats twice, it should probably become a shared helper instead of another local exception

### CSS Animation Classes

- `.fade-in`: opacity 0 to 1, 0.6s ease-out
- `.slide-up`: translateY(20px) + opacity, 0.5s ease-out

## Theme Rules

- Dark mode is the atmospheric default.
- Light mode is a first-class adaptation.
- A component is not done until it works in both themes.
- If a component needs a theme-specific exception, document it.
- Hero media should use the shared `ThemedHeroImage` pattern and the token-backed hero overlay/text variables.

### Hero CSS Tokens

- `--hero-overlay-default`: page-aware overlay (60% dark, 80% light beige)
- `--hero-overlay-strong`: heavier overlay (80% dark, 70% light beige)
- `--hero-overlay-soft`: quieter overlay (60% dark background color, 50% light beige)
- `.hero-fade-top` / `.hero-fade-bottom`: gradient from `var(--color-bg)` to transparent
- `.hero-blend`: `mix-blend-multiply` on images in light mode only (for transparent PNGs)
- `--hero-text-primary` / `--hero-text-muted` / `--hero-text-dim`: theme-aware text colors for content over heroes
- `--hero-image-light-opacity` / `--hero-image-dark-opacity`: theme-aware image crossfade values

### ThemedHeroImage Props

- `darkSrc` / `lightSrc`: theme-aware image swap
- `overlay`: default | strong | soft | none
- `fadeTop` / `fadeBottom`: edge gradients using page bg color
- `blendLight`: multiply blend for transparent PNGs in light mode
- `objectPosition`: image focal point
- `priority`: above-fold loading optimization

Current documented exceptions include:

- a few light-mode utility overrides where semantic token coverage is incomplete
- invariant white labels and control marks on filled action surfaces
- fixed-dark code samples in the playground
- component geometry, standardized Tailwind shadows, and behavior-specific motion values

The goal is always to reduce exceptions, not normalize them.

## Content Tone

Copy should feel:

- direct
- authored
- specific
- confident without startup hype

Avoid:

- agency language
- vague innovation jargon
- filler microcopy
- generic motivational framing

### Special Characters

- Use HTML entities for arrows and special chars (`&#8594;` for →, `&#8596;` for ↔)
- "0→1 Stories" is brand language, always written with the arrow

### data-speakable

- `data-speakable="headline"` on article titles
- `data-speakable="summary"` on article summaries
- Used for enhanced semantic markup for AI and screen readers

## Change Workflow

Whenever you make a design or UI change:

1. Decide which page archetype it belongs to.
2. Reuse existing components first. Only promote a new shared component when the pattern is repeated or clearly cross-route.
3. Verify both dark and light themes.
4. Verify keyboard access, focus visibility, contrast, and reduced-motion behavior.
5. Update the applicable `/guidelines` chapter if the change affects shared rules or patterns.
6. Update this file if the change affects the design contract.
7. Remove or redirect obsolete route surfaces instead of leaving them alive.

## AI Agent Contract

Agents use `AGENTS.md` as the universal operating contract and `design-system.manifest.json` as its generated machine-readable projection. Before building a page, an agent must query the complete contracts for its components, select an approved template when one matches, and implement every applicable exceptional state.

The package ships `llms.txt` for discovery, `llms-full.txt` for exhaustive readable context, a JSON query CLI, six complete page templates, and `ai-created-ui.config.json` with a blocking drift policy. Run `npm run agent:check` before handoff. This verifies token artifacts, manifest freshness, Tailwind-to-token parity, public API documentation parity, policy compliance, template compilation, public export coverage, and generated agent context.

The target is zero undetected drift, not automatic approval of every design decision. If the system cannot meet a real requirement through composition, the first implementation stays product-local and any policy exception must be scoped, justified, owned, and assigned a future review date. Repeated exceptions are evidence for a shared-system contribution.

## Review Checklist

Before shipping, confirm:

- navigation still matches the public IA
- the page fits a known archetype
- typography usage follows the display/UI split
- red is used as accent, not as decoration
- metadata is still compact and secondary
- focus states are visible and keyboard flow still works
- decorative media is not being announced as meaningful content
- status changes are announced when needed
- motion is restrained
- reduced-motion behavior still works
- light mode still works
- new shared components were added because of a real product need, not checklist completeness
- the living specification and `DESIGN-SYSTEM.md` still match the live system
- `npm run agent:check` passes with no undocumented exception
