# @ai-created/ui

The shared design system behind [ai-created.com](https://ai-created.com) and every app that ships from the lab.

One repo. One source of truth. Every component, token, and motion pattern lives here. Consumer apps install it as a dependency and get the full system without copying a single file.

## What's in the box

**19 production components** -- buttons, surfaces, badges, tooltips, modals, form controls, and more. All built with React 19, TypeScript, Tailwind CSS 3, Headless UI, and Framer Motion.

**Design tokens** -- a complete dark-first color system with intentional light mode, semantic status colors, spacing rhythm, radius scale, and motion timing. All delivered as CSS custom properties.

**Tailwind preset** -- the full theme (colors, fonts, letter-spacing, animations, keyframes) as a single preset. Drop it into any Tailwind config and the entire visual language is available.

**Motion helpers** -- shared Framer Motion utilities for fade-in, scroll reveal, hover lift, and border emphasis. Consistent timing across every app.

## Architecture

This package ships **raw TypeScript source**. There is no build step, no compiled output. Consumer apps use Next.js `transpilePackages` to compile it alongside their own code. This means:

- No version mismatch between the package's React and the consumer's React
- Full tree-shaking -- unused components don't ship
- TypeScript types come for free -- no separate `@types` package
- Changes are just code changes, not a publish/build/release cycle

## Components

| Component | What it does |
|-----------|-------------|
| `Badge` | Pill-shaped semantic label. 6 variants: default, muted, success, warning, error, info |
| `Button` | Primary, secondary, destructive, ghost, filter, filter-active, icon. Exports `buttonStyles()` for anchors |
| `Checkbox` | Styled binary toggle with native input semantics |
| `ConfirmDialog` | Destructive action confirmation built on Modal |
| `Dialog` | Headless UI modal with focus trap, Escape/backdrop close, size variants |
| `Dropdown` | Single-select listbox with keyboard nav and type-ahead |
| `EmptyState` | Empty content placeholder with optional icon and action |
| `ErrorReport` | Error display with expandable debug info and copy-to-clipboard |
| `Field` | FieldGroup, FieldLabel, FieldLegend, FieldHint, TextInput, TextArea |
| `Modal` | Composable portal system: Overlay, Panel, Header, Body, Footer |
| `Notice` | Semantic feedback messages. Variants: info, success, warning, error |
| `RadioGroup` | Single-select group with native radio inputs, horizontal/vertical |
| `Skeleton` | Loading placeholder that preserves layout |
| `Slider` | Range input with styled track, red-solid fill, formatted output |
| `Surface` | Card/panel shell with semantic variants and interaction states |
| `Tabs` | Horizontal tab bar with roving tabindex and arrow-key navigation |
| `ThemedHeroImage` | Dark/light theme-aware hero images with overlay and fade controls |
| `Toggle` | On/off switch with role="switch" and sliding track |
| `Tooltip` | Hover/focus/touch hint with position control and ARIA support |

**Utilities:** `cn()` (Tailwind class merging), `fadeUpMotion`, `inViewFadeUpMotion`, `subtleHoverMotion`, `borderHoverMotion`, timing/offset/easing constants.

---

## Setup (new consumer app)

### 1. Install

```bash
npm install --install-links github:TheMarco/ai-created-ui
```

The `--install-links` flag copies the package instead of symlinking, which avoids TypeScript resolution issues with duplicate `@types/react`.

### 2. Tell Next.js to compile it

```js
// next.config.js
const nextConfig = {
  transpilePackages: ['@ai-created/ui'],
  // ... your other config
};
```

### 3. Use the Tailwind preset

```js
// tailwind.config.js
module.exports = {
  presets: [require('@ai-created/ui/tailwind-preset')],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@ai-created/ui/src/**/*.{js,ts,jsx,tsx}',  // scan package classes
  ],
};
```

The content path for `node_modules/@ai-created/ui` is critical. Without it, Tailwind purges the classes used inside package components.

### 4. Import the design tokens

In your `globals.css`, **before** the `@tailwind` directives:

```css
@import '@ai-created/ui/styles/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/* your site-specific styles below */
```

The `@import` must come first -- CSS requires `@import` rules before other rules.

### 5. Use components

```tsx
import { Badge, Button, Surface, Tooltip, cn, fadeUpMotion } from '@ai-created/ui';
```

Everything comes from one import path. Components, types, utilities, motion helpers -- all from `@ai-created/ui`.

---

## Development workflow

### Live playground

Every component has a demo at **[ui.ai-created.com](https://ui.ai-created.com)**, rendered by the Next.js app in `playground/`. The playground depends on this library via `file:..`, so edits hot-reload when running `npm run dev` inside `playground/`. Most iteration should happen there rather than in a consumer app.

Any component change should be reflected in the playground in the same pass. That is the canonical reference both for future contributors and for anyone hitting the live site.

### Editing an existing shared component

1. Open the file in this repo (`src/components/Badge.tsx`, etc.)
2. Make your change
3. Update its playground demo if visible behavior changed
4. Commit and push
5. In each consumer app, bump the lockfile:

   ```bash
   npm install @ai-created/ui@github:TheMarco/ai-created-ui
   ```

   Plain `npm install` (or `npm update`) will not reliably refetch a `github:` dep when the lockfile is already satisfied. Explicit reinstall with the full spec is the dependable form. Commit the updated `package-lock.json`, otherwise Vercel's cached install runs against the old commit and fails with "export not found" errors.

### Live development with npm link

If you want changes to appear instantly in a consumer app without reinstalling:

```bash
# One-time setup:
cd /path/to/ai-created-ui
npm link

cd /path/to/your-app
npm link @ai-created/ui
```

Now edits to files in this repo are immediately reflected in the consumer. When done, commit and push the package, then unlink and reinstall from GitHub:

```bash
cd /path/to/your-app
npm unlink @ai-created/ui
npm install --install-links github:TheMarco/ai-created-ui
```

### Promoting a new component from a consumer app

When you build something in an app (like applyanator) and realize it should be shared:

1. **Copy the component** from your app into this repo's `src/components/`
2. **Fix imports** -- change any `@/lib/utils` to `../lib/utils`. The component should only import from `../lib/utils`, `../lib/motion`, or peer dependencies (react, next, headlessui, lucide, framer-motion). No `@/` path aliases.
3. **Export it** -- add the export to `src/index.ts`
4. **Commit and push** this repo
5. **Add a playground demo** -- extend `playground/src/components/design-system/sections/ComponentsSection.tsx` (or add a new section) so the new component is documented live
6. **Update consumers** -- in each app, run `npm install @ai-created/ui@github:TheMarco/ai-created-ui` to bump the lockfile, then replace the local import with `import { NewComponent } from '@ai-created/ui'` and delete the local copy

### Adding a new design token

1. Add the CSS custom property to `styles/tokens.css` (in both `:root` and `html.light` if it's a color)
2. If it needs a Tailwind utility class, add the mapping to `tailwind-preset.js`
3. Commit and push

### Site-specific overrides

Consumer apps can override any token by redeclaring it in their own `globals.css` after the import:

```css
@import '@ai-created/ui/styles/tokens.css';

:root {
  --layout-gutter: 4vw;  /* wider than the default 2vw */
}
```

---

## What belongs here vs. in a consumer app

**Put it here** if it's generic, reusable, and used (or likely to be used) across multiple apps. Buttons, form controls, layout primitives, color tokens, motion helpers.

**Keep it in the consumer** if it's domain-specific. Product cards, provenance cards, URL inputs with GitHub-specific stripping logic, markdown renderers that depend on `react-markdown`. These use the shared primitives but aren't shared themselves.

Rule of thumb: if you'd copy-paste it into the next app, it belongs here.

---

## Current consumers

- **[ai-created.com](https://ai-created.com)** -- product lab portfolio and content platform
- **[Human, Actually](https://human-actually.com)** -- applicant analysis platform (applyanator)

