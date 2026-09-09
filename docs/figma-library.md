# Figma library

[Open AI-Created UI in Figma](https://www.figma.com/design/JArZlZoEHCZh5SdZ9FFOMA/AI-Created-UI)

[Get the public Community kit](https://www.figma.com/community/file/1677871391096215128) · [Designer guide](https://ui.ai-created.com/designers)

The source library is published in Marco Design. On 2026-09-09, all 48 public component assets reported `CURRENT` through Figma's publication API against the accepted v1.5.0 source. The existing Community resource was updated with the v1.5.0 cover and governance labels and verified live the same day. Source-file access is restricted to invited people and the Design System folder. Visitors can duplicate the public snapshot into their own Figma account.

## Start designing

1. Open **01 · Getting started** for authoring instructions.
2. Enable **AI-Created UI** in **Assets → Libraries** in a working file that has access to the source library.
3. Insert connected components. Use native variants for mutually exclusive states, text and boolean properties for content, instance swaps for replaceable icons, and slots for composed content.
4. Set the parent frame's **AI-Created UI / Semantic** mode to **dark** or **light**. Select an accent independently in **AI-Created UI / Accent**. Theme selection is inherited; it does not require duplicated component masters.
5. Start composed pages from the Directory, Detail, Form, Settings, Dashboard or Onboarding template. Keep component instances connected.

## Coverage

- 21 component pages and 48 public component assets, with related private building blocks.
- 390 variables in eight collections; 100 text styles; three preferred theme-aware elevation styles plus six retained legacy styles.
- All 154 source CSS tokens represented; nine accents and both themes.
- Six approved page archetypes with 148 desktop/mobile examples, including applicable loading, empty, error, permission, saving, validation and success states.
- Native auto layout, state variants, editable properties, component descriptions, foundations, pattern guidance, accessibility guidance, governance and a QA record.

The 148 examples are page scenarios across two themes and two viewport compositions, not 148 unrelated page designs. Figma does not execute CSS breakpoints or application logic.

## Reference size and sources

Figma matches the reviewed playground's **20px root**. The package does not set `html` font size. Rem-based dimensions scale with the host root: `h-11 w-11` is `2.75rem`, or 44px at a 16px root and 55px at the reference root. Literal pixel values remain fixed. Match the host root before comparing rendered geometry.

Canonical precedence remains public React source (`src/index.ts`, `src/components/`), `styles/tokens.css`, shared Tailwind preset, reviewed component and principal specifications, then human documentation. Figma is a projection of those contracts. The six compositions follow `templates/agent/manifest.json` and its source templates.

The Button contract reserves a 1px border in every variant, transparent where no visible boundary is needed. With identical content, changing Variant or State preserves outer dimensions: inline 27px, sm/md 47px, lg/xl 57px, and icon 55px square at the reference root. Focus outlines keep their 3px offset when instances resize.

Reference-palette documentation groups the existing values by family and separates core/feedback colors from the nine accent families. Each swatch shows a shade name and hex value; its layer name and variable binding preserve the exact source token. Swatches use a semantic boundary so near-black and white remain visible in either theme. These sparse source families are for system maintainers; semantic colors remain the product-design entry point. Do not invent intermediate shades or rename tokens to make a continuous scale.

The [September 9 feedback review](../figma/reviews/2026-09-09-feedback.md) records these repairs. The [v1.5.0 publication audit](../figma/audits/2026-09-09-v1.5.0.json) carries forward that affected review and the unchanged baseline evidence, records fresh version-label review in both themes, and verifies the library and existing Community resource against accepted source commit `e2bfa46`.

## Verification

The final Figma scan covered hidden layers as well as visible component and template content. It found no unbound visible solid fills/strokes, generic numbered layer names, missing main-component links or duplicate variant names. Public assets have descriptions. Alias and web code-syntax checks passed. The color comparison audit passed 846 values across both themes and all nine accents.

Ready and error template layouts were checked at 320px in addition to the authored desktop and 390px mobile compositions. Form and onboarding layouts use compact mobile padding, preserve action order, and wrap Checkbox labels.

On 2026-09-04, `npm run agent:check` and `npm run validate` passed, including 129 tests, type checks, lint, template compilation, the production build and package checks. `npm run test:browser` passed 92 tests with 18 configured skips. No visual baselines were changed. Figma appearance does not establish runtime keyboard, screen-reader, persistence or focus-trap behavior; those remain code contracts.

## Remaining integration items

- **Code Connect:** Figma returned an account prerequisite error requiring a Dev or Full seat on an Organization or Enterprise plan. No live Code Connect mappings were published.
- **Notice authoring:** a tested isolated prototype exposes content controls more directly. Automatic approval review blocked applying that structural migration to shared masters without explicit approval. Existing Notice masters and instances remain usable. [Review the prototype](https://www.figma.com/design/JArZlZoEHCZh5SdZ9FFOMA/AI-Created-UI?node-id=140-6870). Re-inventory all Notice instances before any approved migration; templates and documentation added more instances after the initial snapshot.
- **Legacy shadows:** six fixed-theme styles are retained. Prefer the three theme-aware elevation styles for new work.
- **Community:** the free resource is published under CC BY 4.0. Community duplicates do not receive library updates automatically; connected library consumers can review published updates. Publish a new Community version when distributing an updated snapshot.

## Website integration

The library is updated when declaring a design-system version. The [Figma release workflow](figma-consumer.md) covers changes since the last audited snapshot, light/dark review and verified library/Community publication. Ordinary development does not require a Figma sync or a background updater.

The `/designers` page links to the public resource, documents the first-mockup workflow, and explains fonts, root sizing, updates and attribution. Published Figma facts are recorded in `playground/src/lib/figma-library.ts`; update them after auditing a new snapshot. The dashboard previews in `playground/public/images/figma/` were exported from source nodes `158:9` (dark) and `158:30` (light). Their example data is illustrative. The preview controls switch between static exports, independently of the website's own theme and accent.

The designer page is live at https://ui.ai-created.com/designers. The v1.5.0 source acceptance passed 137 unit tests and 108 production browser tests (20 configured skips). The browser gate builds and starts the production app, and the designer navigation requires exactly one correct canonical link. Version metadata, the designer workflow and publication receipts are included in v1.5.0; no visual baselines changed during release preparation.
