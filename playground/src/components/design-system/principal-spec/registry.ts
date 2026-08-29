import type { GuidelineSpec, GuidelineSlug } from './types';

export const guidelineSpecs: GuidelineSpec[] = [
  {
    slug: 'foundations',
    index: '01',
    title: 'Foundations',
    shortTitle: 'Foundations',
    summary: 'The visual, spatial, typographic, motion, and media decisions that every AI-Created interface inherits.',
    status: 'canonical',
    owner: 'Design Systems',
    lastReviewed: 'August 2026',
    reviewCycle: 'Quarterly and before any token release',
    sourceOfTruth: 'styles/tokens.css and tailwind-preset.js',
    outcomes: [
      'A product can switch themes without local color overrides.',
      'Design decisions map to named semantic tokens before component styling.',
      'Layouts remain readable from 320px through the 1400px container maximum.',
    ],
    sections: [
      {
        id: 'token-architecture',
        title: 'Token architecture',
        summary: 'Use a three-level naming model so raw values can change without altering product intent.',
        blocks: [
          {
            type: 'table',
            title: 'Decision hierarchy',
            columns: ['Level', 'Example', 'Who uses it', 'Rule'],
            rows: [
              ['Reference', '--ref-red-500', 'System maintainers', 'Stores a raw value. Never use directly in product UI.'],
              ['Semantic', '--color-action-primary', 'Designers and engineers', 'Names intent and owns light and dark mode behavior.'],
              ['Component', 'Button / Primary / Background', 'Component authors', 'Maps a component decision to a semantic token.'],
            ],
          },
          {
            type: 'rules',
            title: 'Token rules',
            items: [
              { title: 'Name the purpose', description: 'A token should explain why the value exists, not what its current hex value resembles.' },
              { title: 'Change both modes together', description: 'Every semantic color change is reviewed in light and dark mode, including focus, selection, and feedback surfaces.' },
              { title: 'Avoid product aliases', description: 'Do not create a new token for one screen. Promote a value only after a repeated semantic need is demonstrated.' },
              { title: 'Keep compatibility aliases secondary', description: 'Existing red aliases remain supported public contracts. New work can prefer accent and action names when intent is unambiguous.' },
            ],
          },
        ],
      },
      {
        id: 'color',
        title: 'Color and contrast',
        summary: 'One red accent establishes action hierarchy. Neutral surfaces and semantic feedback colors carry the rest of the system.',
        blocks: [
          {
            type: 'tokens',
            title: 'Core semantic palette',
            description: 'Samples resolve live through the current theme.',
            items: [
              { name: 'Background', value: 'Canvas', purpose: 'Page background and highest-level negative space.', cssVariable: '--color-bg' },
              { name: 'Surface', value: 'Primary surface', purpose: 'Cards, panels, fields, and floating regions.', cssVariable: '--color-surface' },
              { name: 'Surface 2', value: 'Nested surface', purpose: 'Controls, inset regions, and subtle grouping.', cssVariable: '--color-surface2' },
              { name: 'Text', value: 'Primary content', purpose: 'Headings, labels, and critical information.', cssVariable: '--color-text' },
              { name: 'Accent', value: 'Identity', purpose: 'Links, emphasis, and non-destructive branded actions.', cssVariable: '--color-accent' },
              { name: 'Action primary', value: 'Committed action', purpose: 'High-emphasis action fill.', cssVariable: '--color-action-primary' },
              { name: 'Success', value: 'Positive state', purpose: 'Completed or healthy outcomes only.', cssVariable: '--color-success' },
              { name: 'Warning', value: 'Attention state', purpose: 'Recoverable risk or pending attention.', cssVariable: '--color-warning' },
              { name: 'Info', value: 'Neutral state', purpose: 'Contextual or process information.', cssVariable: '--color-info' },
              { name: 'Error', value: 'Failure state', purpose: 'Invalid input, failed operations, and destructive risk.', cssVariable: '--color-error' },
            ],
          },
          {
            type: 'checklist',
            title: 'Color acceptance',
            groups: [
              { title: 'Required', items: ['Body text meets 4.5:1 contrast.', 'Large text and icons conveying meaning meet 3:1 contrast.', 'Focus indicators meet 3:1 against adjacent colors.', 'Meaning never relies on color alone.'] },
              { title: 'Avoid', items: ['Raw reference colors in product code.', 'Red decoration competing with primary actions.', 'Tinted text on tinted surfaces without contrast validation.', 'Theme-specific assets without a paired alternative.'] },
            ],
          },
        ],
      },
      {
        id: 'type-layout',
        title: 'Typography, spacing, and grid',
        summary: 'Instrument Serif creates editorial moments. Space Grotesk carries every functional reading task.',
        blocks: [
          {
            type: 'table',
            title: 'Type roles',
            columns: ['Role', 'Family', 'Typical size', 'Use'],
            rows: [
              ['Display / Hero', 'Instrument Serif', '60 to 96px', 'One primary narrative statement per page.'],
              ['Display / Section', 'Instrument Serif', '40 to 60px', 'Major chapter introductions.'],
              ['Heading', 'Space Grotesk 500', '20 to 32px', 'Functional page and card hierarchy.'],
              ['Body', 'Space Grotesk 400', '14 to 20px', 'Instructions, descriptions, and long-form content.'],
              ['Metadata', 'System mono', '10 to 12px', 'Tokens, statuses, keyboard keys, and code-adjacent labels.'],
            ],
          },
          {
            type: 'table',
            title: 'Responsive layout contract',
            columns: ['Range', 'Gutter', 'Columns', 'Behavior'],
            rows: [
              ['320 to 767px', '6vw', '4', 'Stack content, preserve source order, use full-width controls when needed.'],
              ['768 to 1023px', '2vw', '8', 'Introduce split regions only when each column remains readable.'],
              ['1024 to 1399px', '2vw', '12', 'Enable persistent secondary navigation and dense matrices.'],
              ['1400px and above', '2vw', '12', 'Cap primary content at 1400px and grow outer whitespace.'],
            ],
          },
          {
            type: 'rules',
            title: 'Composition rules',
            items: [
              { title: 'Use a 4px base unit', description: 'Tokenized radii and intentional optical adjustments may differ, but layout spacing should resolve to the base unit.' },
              { title: 'Prefer gap over margins', description: 'Parent layout owns relationships between siblings. Components own only their internal spacing.' },
              { title: 'Keep reading measures controlled', description: 'Body copy should usually remain between 45 and 75 characters per line.' },
              { title: 'Preserve hierarchy when stacking', description: 'Responsive changes may alter layout, never the semantic or focus order.' },
            ],
          },
        ],
      },
      {
        id: 'shape-motion-media',
        title: 'Shape, elevation, motion, icons, and media',
        summary: 'Secondary visual systems remain restrained so content and interaction state stay primary.',
        blocks: [
          {
            type: 'table',
            title: 'System inventory',
            columns: ['Area', 'Contract', 'Current support'],
            rows: [
              ['Radius', '4px small, 6px default, 10px large, full for pills', 'Canonical tokens'],
              ['Elevation', 'Border first; shadow only when depth changes interaction meaning', 'Local Tailwind effects, not yet canonical tokens'],
              ['Motion', '200ms feedback, 300ms transitions, 500ms entrances', 'Canonical duration tokens and shared helpers'],
              ['Icons', 'Lucide, 16px inline, 20px controls, 32px empty states', 'Code dependency; no separate icon package'],
              ['Imagery', 'Theme-paired, art-directed, useful at crop extremes', 'ThemedHeroImage plus product-owned assets'],
              ['Data visualization', 'Text, shape, and pattern reinforce color', 'Guidance only; no chart primitive yet'],
            ],
          },
          {
            type: 'checklist',
            title: 'Media and motion acceptance',
            groups: [
              { title: 'Motion', items: ['Animate opacity and transforms when possible.', 'Respect prefers-reduced-motion.', 'Keep focus and reading order stable during transitions.', 'Use motion to explain state or hierarchy, never as idle decoration.'] },
              { title: 'Media', items: ['Provide useful alt text or mark decorative media as empty alt.', 'Test both theme sources and missing-image fallbacks.', 'Preserve the subject at mobile and wide crops.', 'Include captions or transcripts for time-based media.'] },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'construction',
    index: '02',
    title: 'Component construction',
    shortTitle: 'Construction',
    summary: 'Figma-equivalent component anatomy, sizing, properties, slots, overrides, and design-to-code parity rules.',
    status: 'operational',
    owner: 'Design Systems and Frontend Platform',
    lastReviewed: 'August 2026',
    reviewCycle: 'With every component API change',
    sourceOfTruth: 'playground component specs and src/components',
    outcomes: [
      'A designer can create a supported instance without detaching it.',
      'Each design property maps to a public prop, slot, or documented composition.',
      'Resize, localization, and exceptional-state behavior is decided before release.',
    ],
    sections: [
      {
        id: 'asset-model',
        title: 'Asset model and naming',
        summary: 'One component set represents one public concept. Names encode hierarchy, not visual styling.',
        blocks: [
          {
            type: 'table',
            title: 'Layer naming model',
            columns: ['Layer', 'Pattern', 'Example', 'Rule'],
            rows: [
              ['Library asset', 'Component / Name', 'Component / Button', 'Matches the public export name.'],
              ['Variant property', 'Sentence case', 'Variant = Primary', 'Maps to a finite prop union.'],
              ['Boolean property', 'Show + noun', 'Show icon = True', 'Controls optional visibility, not layout hacks.'],
              ['Text property', 'Content role', 'Label = Save', 'Exposes only content intended for instance editing.'],
              ['Nested layer', 'Semantic role', 'Leading icon', 'Names responsibility rather than shape or position.'],
            ],
          },
          {
            type: 'rules',
            title: 'Construction principles',
            items: [
              { title: 'Mirror the public API', description: 'Variant and boolean properties use the same concepts and defaults as code.' },
              { title: 'Prefer nested components', description: 'Icons, field messages, and surfaces remain replaceable nested assets where supported.' },
              { title: 'Protect structural layers', description: 'Consumers may edit content and approved swaps, but should not need to unlock layout layers.' },
              { title: 'Document intentional gaps', description: 'Utility and provider exports are marked as code-only instead of receiving fictional canvas assets.' },
            ],
          },
        ],
      },
      {
        id: 'layout-sizing',
        title: 'Auto layout and resizing',
        summary: 'Each axis has an explicit contract: hug, fill, fixed, or content-controlled.',
        blocks: [
          {
            type: 'table',
            title: 'Sizing decisions',
            columns: ['Mode', 'Use when', 'Avoid when', 'Code equivalent'],
            rows: [
              ['Hug', 'Content defines the useful dimension.', 'Peer alignment requires equal widths.', 'inline-flex, w-fit, intrinsic sizing'],
              ['Fill', 'The parent owns available space.', 'The control should remain content-sized.', 'w-full, flex-1, min-w-0'],
              ['Fixed', 'The dimension is a tokenized target.', 'Localized text or user content is present.', 'size-* or explicit component token'],
              ['Content-controlled', 'Media or a consumer slot owns proportion.', 'The component can define a safe default.', 'aspect-ratio, min/max constraints'],
            ],
          },
          {
            type: 'checklist',
            title: 'Resize stress test',
            groups: [
              { title: 'Canvas', items: ['Test minimum supported width.', 'Test fill-container behavior.', 'Test 200 percent text scaling.', 'Test a three-line translated label.', 'Test optional slots removed and replaced.'] },
              { title: 'Code', items: ['Verify flex children use min-width: 0 where truncation is intended.', 'Verify hit targets do not shrink below 44 by 44px on touch.', 'Verify overflow is documented as wrap, clip, scroll, or expand.', 'Verify DOM and focus order match the visual layout.'] },
            ],
          },
        ],
      },
      {
        id: 'properties-slots',
        title: 'Properties, slots, and overrides',
        summary: 'Editable surfaces are intentional and finite. They should produce supported code, not arbitrary new component states.',
        blocks: [
          {
            type: 'rules',
            title: 'Property strategy',
            items: [
              { title: 'Variants represent meaningful choice', description: 'Use a variant only when appearance and behavior form a named, supported option.', requirements: ['No boolean explosion', 'No duplicated state variants', 'No theme property on components'] },
              { title: 'State is demonstrated, not configured', description: 'Hover, focus, pressed, loading, invalid, and disabled are prototype or specimen states unless the API directly owns them.' },
              { title: 'Slots describe composition boundaries', description: 'A slot declares acceptable content, size, alignment, and fallback behavior.' },
              { title: 'Instance swaps stay type-safe', description: 'Limit swaps to assets that satisfy the same semantic and dimensional contract.' },
            ],
          },
          {
            type: 'table',
            title: 'Override policy',
            columns: ['Change', 'Allowed', 'Condition'],
            rows: [
              ['Text content', 'Yes', 'Within documented content limits and accessible naming rules.'],
              ['Nested icon swap', 'Yes', 'Same icon size and semantic role.'],
              ['Semantic color token', 'By variant only', 'No local fills or raw values.'],
              ['Internal spacing', 'No', 'Request a supported size or composition instead.'],
              ['Layer deletion', 'Boolean property only', 'Do not delete locked structural layers.'],
              ['Detach instance', 'Exception only', 'Requires a documented system gap and follow-up issue.'],
            ],
          },
        ],
      },
      {
        id: 'parity',
        title: 'Design-to-code parity',
        summary: 'Parity means equivalent decisions, defaults, states, and behavior. Pixel similarity alone is insufficient.',
        blocks: [
          {
            type: 'process',
            title: 'Parity review',
            steps: [
              { title: 'Inventory', owner: 'Designer', output: 'Anatomy, variants, content bounds, resize rules', gate: 'All supported decisions are represented.' },
              { title: 'Map', owner: 'Engineer', output: 'Property-to-prop and slot-to-composition mapping', gate: 'No design property requires an undocumented override.' },
              { title: 'Stress', owner: 'Design and QA', output: 'Theme, locale, zoom, keyboard, state evidence', gate: 'Both implementations pass the same acceptance cases.' },
              { title: 'Publish', owner: 'Design Systems', output: 'Versioned design asset, package release, migration note', gate: 'Sources publish together or the change remains unreleased.' },
            ],
          },
          {
            type: 'checklist',
            title: 'Definition of parity',
            groups: [
              { title: 'Design', items: ['Names and defaults match code.', 'All public variants and states are demonstrated.', 'Auto layout reproduces responsive intent.', 'Tokens are semantic aliases, not copied values.'] },
              { title: 'Code', items: ['Public props match documented properties.', 'Native semantics and keyboard behavior are preserved.', 'Visual regression covers both themes.', 'Release notes identify additions, changes, and deprecations.'] },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'patterns',
    index: '03',
    title: 'Product patterns',
    shortTitle: 'Patterns',
    summary: 'Reusable interaction and page-level decisions for common product flows, including their loading, empty, error, and permission states.',
    status: 'operational',
    owner: 'Product Design',
    lastReviewed: 'August 2026',
    reviewCycle: 'Quarterly and after major product launches',
    sourceOfTruth: 'DESIGN-SYSTEM.md and live pattern specimens',
    outcomes: [
      'Common workflows behave consistently across products.',
      'Teams design the complete state model before the happy path ships.',
      'Patterns compose public primitives without creating hidden component APIs.',
    ],
    sections: [
      {
        id: 'state-model',
        title: 'Complete state model',
        summary: 'Every data-backed surface declares what the user sees before, during, and after work.',
        blocks: [
          {
            type: 'table',
            title: 'Required product states',
            columns: ['State', 'Communicate', 'Primary action', 'Preferred primitive'],
            rows: [
              ['Initial', 'Purpose and first useful action', 'Start or create', 'EmptyState'],
              ['Loading', 'Structure and progress without layout shift', 'Usually none', 'Skeleton or inline pending state'],
              ['Success', 'Result and next step', 'Continue or inspect', 'Notice or refreshed content'],
              ['Empty result', 'Why no match exists', 'Clear filters or change query', 'EmptyState'],
              ['Recoverable error', 'What failed and how to retry', 'Retry', 'Notice or inline field message'],
              ['Diagnostic error', 'Summary plus inspectable details', 'Copy report or retry', 'ErrorReport'],
              ['Offline', 'Connection dependency and preserved work', 'Retry when online', 'Notice with local state'],
              ['Permission denied', 'Missing access and request path', 'Request access', 'EmptyState or dedicated page'],
            ],
          },
        ],
      },
      {
        id: 'forms-actions',
        title: 'Forms and committed actions',
        summary: 'Validation stays close to the field while submission status remains clear at the form level.',
        blocks: [
          {
            type: 'rules',
            title: 'Form behavior',
            items: [
              { title: 'Validate at a useful moment', description: 'Validate on blur or submit. Avoid interrupting the user before a value can be complete.' },
              { title: 'Keep errors persistent', description: 'Field errors remain visible until the condition is resolved and are associated through description semantics.' },
              { title: 'Preserve input on failure', description: 'A failed submission must not erase work. Focus the first actionable error when useful.' },
              { title: 'Make submission singular', description: 'Disable or guard repeated submissions and communicate pending state in the action label.' },
            ],
          },
          {
            type: 'table',
            title: 'Destructive action ladder',
            columns: ['Risk', 'Pattern', 'Confirmation'],
            rows: [
              ['Low and reversible', 'Immediate action plus undo', 'No blocking dialog'],
              ['Material but recoverable', 'ConfirmDialog with consequence', 'Explicit action label'],
              ['Permanent or high impact', 'ConfirmDialog plus typed or secondary verification', 'Name the object and outcome'],
            ],
          },
        ],
      },
      {
        id: 'navigation-discovery',
        title: 'Navigation, search, and data discovery',
        summary: 'Location, scope, query, filters, and result count remain observable and shareable.',
        blocks: [
          {
            type: 'checklist',
            title: 'Discovery contract',
            groups: [
              { title: 'Navigation', items: ['One page has one primary landmark and heading.', 'Current location is visually and programmatically identifiable.', 'Back behavior returns to a meaningful prior context.', 'Deep links restore the same useful state.'] },
              { title: 'Search and filters', items: ['Search results appear next to the query, not only as a count.', 'Filters expose active values and a clear-all action.', 'No-results states explain how to recover.', 'Query and filters use URL state when sharing matters.'] },
              { title: 'Pagination and tables', items: ['Announce result range and total.', 'Preserve sort and selection across pagination deliberately.', 'Keep row actions keyboard reachable.', 'Offer a narrow-screen alternative to horizontal data loss.'] },
            ],
          },
        ],
      },
      {
        id: 'page-archetypes',
        title: 'Page archetypes',
        summary: 'Stable page skeletons reduce navigation and density decisions while leaving room for product content.',
        blocks: [
          {
            type: 'table',
            title: 'Archetype inventory',
            columns: ['Archetype', 'Required regions', 'Responsive priority'],
            rows: [
              ['Directory', 'Title, search/filter, result summary, list, empty/error states', 'Keep search and first results above the fold.'],
              ['Detail', 'Breadcrumb/back, identity, status, primary actions, grouped details', 'Keep identity before actions and secondary metadata.'],
              ['Editor', 'Title/status, workspace, controls, validation, save state', 'Preserve the work area and collapse secondary controls.'],
              ['Settings', 'Local navigation, grouped fields, save feedback', 'Stack navigation before fields without losing location.'],
              ['Dashboard', 'Time/scope controls, summary, trends, exceptions', 'Prioritize exceptions and readable comparisons.'],
              ['Onboarding', 'Progress, one decision, help, safe exit', 'One column and one primary action.'],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'content',
    index: '04',
    title: 'Content design',
    shortTitle: 'Content',
    summary: 'Voice, interface language, formatting, localization, and accessible naming rules for product content.',
    status: 'operational',
    owner: 'Product Design and Content',
    lastReviewed: 'August 2026',
    reviewCycle: 'Twice yearly and with locale expansion',
    sourceOfTruth: 'DESIGN-SYSTEM.md content guidelines',
    outcomes: [
      'People understand the next action without interpreting system jargon.',
      'Errors explain the problem, consequence, and recovery.',
      'Layouts survive translation, bidirectional text, and user-generated content.',
    ],
    sections: [
      {
        id: 'voice',
        title: 'Voice and tone',
        summary: 'The voice is direct, calm, specific, and human. Tone adjusts to consequence without changing personality.',
        blocks: [
          {
            type: 'table',
            title: 'Voice dimensions',
            columns: ['Prefer', 'Avoid', 'Example'],
            rows: [
              ['Specific', 'Vague', '“Export failed because the file is read-only.”'],
              ['Direct', 'Ceremonial', '“Save changes” instead of “Proceed with saving.”'],
              ['Calm', 'Alarmist', '“Connection lost. Your draft is saved locally.”'],
              ['Human', 'Cute or robotic', '“We could not verify that address.”'],
            ],
          },
          {
            type: 'rules',
            title: 'Tone by moment',
            items: [
              { title: 'Routine', description: 'Be compact. Labels and actions should feel almost invisible.' },
              { title: 'Learning', description: 'Explain the concept and next step without front-loading every exception.' },
              { title: 'Blocked', description: 'State what happened, whether work is safe, and the most useful recovery.' },
              { title: 'High risk', description: 'Slow the interaction down. Name the affected object, consequence, and permanence.' },
            ],
          },
        ],
      },
      {
        id: 'interface-copy',
        title: 'Interface copy',
        summary: 'Labels describe objects. Actions begin with verbs. Supporting text earns its space.',
        blocks: [
          {
            type: 'table',
            title: 'Copy patterns',
            columns: ['Element', 'Pattern', 'Example'],
            rows: [
              ['Button', 'Verb + object when context is not obvious', 'Create project'],
              ['Field label', 'Stable noun phrase', 'Billing address'],
              ['Helper text', 'Format, consequence, or reason', 'Used only for account recovery.'],
              ['Validation', 'Problem + correction', 'Enter an email address in name@example.com format.'],
              ['Dialog title', 'Decision or consequence', 'Delete “Quarterly plan”?'],
              ['Empty state', 'Situation + value + next action', 'No saved views yet. Save this filter to reuse it.'],
              ['Success', 'Completed result', 'Project created'],
            ],
          },
          {
            type: 'checklist',
            title: 'Copy acceptance',
            groups: [
              { title: 'Every string', items: ['Uses sentence case.', 'Avoids unnecessary punctuation.', 'Does not repeat adjacent headings or labels.', 'Makes sense when read by a screen reader out of visual context.'] },
              { title: 'Errors', items: ['Names the failed object or action.', 'Avoids blame.', 'Preserves useful technical detail behind disclosure.', 'Offers a recovery when one exists.'] },
            ],
          },
        ],
      },
      {
        id: 'formatting',
        title: 'Numbers, dates, names, and truncation',
        summary: 'Locale-aware formatting is part of the content contract, not post-production cleanup.',
        blocks: [
          {
            type: 'table',
            title: 'Formatting rules',
            columns: ['Content', 'Display rule', 'Implementation'],
            rows: [
              ['Dates', 'Use unambiguous localized forms. Include year when context can cross years.', 'Intl.DateTimeFormat'],
              ['Times', 'Use the user locale and show the time zone when participants differ.', 'Intl.DateTimeFormat with timeZoneName'],
              ['Numbers', 'Respect grouping and decimal conventions. Keep raw precision only where meaningful.', 'Intl.NumberFormat'],
              ['Currency', 'Always bind amount to ISO currency. Never infer from symbol alone.', 'Intl.NumberFormat with currency'],
              ['Names', 'Store and display as entered. Do not require first/last assumptions.', 'One full-name field unless domain needs parts'],
              ['File size', 'Use consistent decimal or binary units within a product.', 'Shared formatter'],
              ['Truncation', 'Preserve distinguishing start and end where useful. Reveal the full value.', 'CSS ellipsis plus accessible full text'],
            ],
          },
        ],
      },
      {
        id: 'localization',
        title: 'Localization and bidirectionality',
        summary: 'Components expand, mirror, and reflow without asking translators to fit English-shaped boxes.',
        blocks: [
          {
            type: 'checklist',
            title: 'Localization stress cases',
            groups: [
              { title: 'Translation', items: ['Test 30 to 50 percent text expansion.', 'Do not concatenate sentence fragments.', 'Keep variables contextually named for translators.', 'Use plural rules rather than count-based string branches.'] },
              { title: 'RTL', items: ['Use logical start and end properties.', 'Mirror directional icons, not universal symbols.', 'Keep numbers, code, and media direction intentional.', 'Verify focus and reading order independently of visual mirroring.'] },
              { title: 'User content', items: ['Support mixed scripts and bidirectional isolation.', 'Define wrapping for long unbroken strings.', 'Do not communicate status through capitalization.', 'Keep accessible names in the user language.'] },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'accessibility',
    index: '05',
    title: 'Accessibility standards',
    shortTitle: 'Accessibility',
    summary: 'The release contract for inclusive semantics, input, perception, reflow, motion, and assistive technology behavior.',
    status: 'canonical',
    owner: 'Design Systems and Engineering',
    lastReviewed: 'August 2026',
    reviewCycle: 'Every release and quarterly manual audit',
    sourceOfTruth: 'WCAG 2.2 AA target and component accessibility specs',
    outcomes: [
      'Core workflows operate with keyboard and screen reader alone.',
      'Content remains usable at 200 percent zoom and 320 CSS pixels.',
      'Component releases include automated and manual accessibility evidence.',
    ],
    sections: [
      {
        id: 'standard',
        title: 'Conformance target',
        summary: 'WCAG 2.2 Level AA is the minimum. Native semantics and platform conventions are the starting point.',
        blocks: [
          {
            type: 'table',
            title: 'Acceptance matrix',
            columns: ['Area', 'Minimum', 'Evidence'],
            rows: [
              ['Contrast', '4.5:1 text, 3:1 large text and meaningful UI graphics', 'Theme-paired contrast audit'],
              ['Keyboard', 'All actions reachable, operable, and escapable', 'Interaction tests plus manual pass'],
              ['Focus', 'Visible, ordered, not obscured, restored after overlays', 'Both themes at desktop and mobile viewport'],
              ['Touch', '44 by 44 CSS pixel target where practical', 'Rendered target inspection'],
              ['Zoom and reflow', '200 percent zoom and 320 CSS pixel width without lost content', 'Manual browser matrix'],
              ['Motion', 'Reduced-motion alternative and no unsafe flashing', 'Media query and behavior review'],
              ['Names and roles', 'Programmatic name, role, value, state', 'Accessibility tree and screen reader'],
            ],
          },
        ],
      },
      {
        id: 'interaction',
        title: 'Keyboard, focus, and announcements',
        summary: 'Keyboard behavior follows the native element or established ARIA pattern, never a visual imitation.',
        blocks: [
          {
            type: 'rules',
            title: 'Interaction requirements',
            items: [
              { title: 'Use native controls first', description: 'Buttons, links, inputs, selects, and dialogs provide behavior that custom roles must otherwise reproduce.' },
              { title: 'Do not trap focus outside a modal', description: 'Only active modal dialogs contain focus. Escape closes when cancellation is supported.' },
              { title: 'Return focus intentionally', description: 'Closing transient UI restores focus to the trigger or the next logical workflow target.' },
              { title: 'Announce outcomes, not activity noise', description: 'Use live regions for asynchronous results that are not otherwise focused. Avoid repeated progress chatter.' },
            ],
          },
          {
            type: 'table',
            title: 'Common keyboard contracts',
            columns: ['Pattern', 'Keys'],
            rows: [
              ['Button and toggle', 'Enter and Space activate'],
              ['Tabs', 'Arrow keys move; Home and End jump; focus and selection policy is documented'],
              ['Menu', 'Arrow keys move; Enter selects; Escape closes and restores focus'],
              ['Dialog', 'Tab cycles inside; Escape cancels when allowed'],
              ['Slider', 'Arrow keys step; Page keys make larger changes; Home and End set bounds'],
              ['Radio group', 'Arrow keys move and select within the group'],
            ],
          },
        ],
      },
      {
        id: 'perception-reflow',
        title: 'Perception, reflow, and user preferences',
        summary: 'Information survives theme, forced colors, text spacing, zoom, and reduced motion.',
        blocks: [
          {
            type: 'checklist',
            title: 'Resilience checks',
            groups: [
              { title: 'Visual', items: ['Light and dark themes retain hierarchy.', 'Forced-colors mode preserves controls and focus.', 'Status includes text or shape in addition to color.', 'Browser text-spacing overrides do not clip content.'] },
              { title: 'Responsive', items: ['No two-dimensional scrolling for ordinary content at 320 CSS pixels.', 'Sticky regions do not obscure focus.', 'Landscape mobile retains primary actions.', 'Tables provide a deliberate narrow-screen strategy.'] },
              { title: 'Preferences', items: ['Reduced motion removes nonessential movement.', 'Autoplay is absent or user-controlled.', 'Animation does not block interaction.', 'Theme choice persists without flash.'] },
            ],
          },
        ],
      },
      {
        id: 'testing',
        title: 'Accessibility test responsibilities',
        summary: 'Automation catches regressions. Manual evaluation confirms that the workflow is actually understandable.',
        blocks: [
          {
            type: 'process',
            title: 'Release evidence',
            steps: [
              { title: 'Author', owner: 'Component author', output: 'Semantic markup, keyboard tests, labels, state announcements', gate: 'No known serious automated violations.' },
              { title: 'Review', owner: 'Design Systems', output: 'Focus, contrast, zoom, reflow, reduced-motion evidence', gate: 'Both themes and exceptional states pass.' },
              { title: 'Assistive technology', owner: 'QA or trained reviewer', output: 'VoiceOver/Safari plus NVDA/Firefox or equivalent workflow notes', gate: 'Name, role, state, reading order, and recovery are usable.' },
              { title: 'Monitor', owner: 'Product team', output: 'Reported issue triage and regression coverage', gate: 'Critical issues block release; fixes add lasting tests.' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'governance',
    index: '06',
    title: 'Governance and contribution',
    shortTitle: 'Governance',
    summary: 'Ownership, maturity, contribution, release, adoption, exception, and deprecation rules for keeping the system trustworthy.',
    status: 'canonical',
    owner: 'Design Systems',
    lastReviewed: 'August 2026',
    reviewCycle: 'Monthly operating review',
    sourceOfTruth: 'Repository, package releases, and this portal',
    outcomes: [
      'Teams know what is safe to adopt and who decides changes.',
      'Design and code publish as one reviewed release.',
      'Exceptions and deprecations include an owner and an exit path.',
    ],
    sections: [
      {
        id: 'maturity',
        title: 'Maturity and ownership',
        summary: 'Every shared asset has a status, accountable owner, review date, and canonical implementation.',
        blocks: [
          {
            type: 'table',
            title: 'Maturity model',
            columns: ['Status', 'Use', 'Promise'],
            rows: [
              ['Draft', 'Evaluation only', 'Shape and API may change without migration.'],
              ['Beta', 'Opt-in product use', 'Known gaps are documented; breaking changes include direct outreach.'],
              ['Stable', 'Default for production', 'Semantic versioning, migration guidance, and regression coverage.'],
              ['Deprecated', 'Existing use while migrating', 'Replacement, deadline, and removal version are published.'],
              ['Retired', 'Do not use', 'Removed from active libraries and retained only in history.'],
            ],
          },
          {
            type: 'table',
            title: 'Decision rights',
            columns: ['Role', 'Accountability'],
            rows: [
              ['Design Systems', 'System coherence, asset model, tokens, docs, final acceptance'],
              ['Frontend Platform', 'Public API, semantics, performance, package quality'],
              ['Product designer', 'Use case evidence, workflow fit, content and responsive validation'],
              ['Product engineer', 'Integration evidence, edge cases, adoption and migration feedback'],
              ['Accessibility reviewer', 'Manual behavior and conformance risk'],
            ],
          },
        ],
      },
      {
        id: 'contribution',
        title: 'Contribution workflow',
        summary: 'New system surface area begins with repeated product need, not a polished component proposal.',
        blocks: [
          {
            type: 'process',
            title: 'From need to release',
            steps: [
              { title: 'Frame', owner: 'Contributor', output: 'Problem, affected workflows, evidence from at least two contexts', gate: 'A shared need exists and composition cannot solve it cleanly.' },
              { title: 'Explore', owner: 'Design and engineering', output: 'API, anatomy, states, tokens, accessibility, content and responsive model', gate: 'The smallest coherent contract is selected.' },
              { title: 'Build', owner: 'Contributor', output: 'Code, design asset, docs, tests, examples and migration notes', gate: 'Parity and quality checklist passes.' },
              { title: 'Review', owner: 'System owners', output: 'Design, API, accessibility and visual approval', gate: 'No unresolved release blocker remains.' },
              { title: 'Adopt', owner: 'Product team', output: 'Pilot evidence and follow-up issues', gate: 'Beta graduates after real workflow validation.' },
            ],
          },
          {
            type: 'checklist',
            title: 'Proposal evidence',
            groups: [
              { title: 'Problem', items: ['Two or more concrete product contexts.', 'Why existing primitives and patterns are insufficient.', 'User and accessibility consequences.', 'Expected adoption and maintenance owner.'] },
              { title: 'Solution', items: ['Public API and design properties.', 'Complete state, content, responsive, locale, and theme model.', 'Token impact and visual rationale.', 'Testing, rollout, and migration plan.'] },
            ],
          },
        ],
      },
      {
        id: 'change-management',
        title: 'Release and change management',
        summary: 'Documentation, package behavior, design assets, and migration guidance move together.',
        blocks: [
          {
            type: 'table',
            title: 'Change classes',
            columns: ['Class', 'Examples', 'Requirement'],
            rows: [
              ['Patch', 'Bug fix, docs clarification, accessibility correction without API impact', 'Regression test and changelog entry'],
              ['Minor', 'New component, prop, token, recipe, or compatible visual capability', 'Docs, examples, design asset, adoption note'],
              ['Major', 'Removed or renamed API, changed default, token meaning change', 'Deprecation window, codemod or migration, owner outreach'],
              ['Emergency', 'Security or critical accessibility fix', 'Expedited review plus follow-up documentation and audit'],
            ],
          },
          {
            type: 'rules',
            title: 'Deprecation contract',
            items: [
              { title: 'Name the replacement', description: 'A deprecation without a supported next step is not actionable.' },
              { title: 'Provide a deadline', description: 'Publish the earliest removal version and a review date.' },
              { title: 'Measure remaining use', description: 'Track package references or product inventory before removal.' },
              { title: 'Keep the old path stable', description: 'Do not silently change deprecated behavior during the migration window.' },
            ],
          },
        ],
      },
      {
        id: 'health',
        title: 'System health and exceptions',
        summary: 'A mature library measures use, quality, and drift rather than equating inventory size with success.',
        blocks: [
          {
            type: 'table',
            title: 'Health signals',
            columns: ['Signal', 'Question'],
            rows: [
              ['Adoption', 'What share of eligible product surfaces uses the supported primitive or pattern?'],
              ['Coverage', 'Which recurring product needs still require local implementations?'],
              ['Quality', 'What accessibility, visual, reliability, and performance regressions recur?'],
              ['Parity', 'Which design or code assets expose unmatched decisions?'],
              ['Velocity', 'How long do proposals, reviews, migrations, and critical fixes take?'],
              ['Trust', 'Can product teams predict behavior, ownership, and upgrade cost?'],
            ],
          },
          {
            type: 'rules',
            title: 'Exception policy',
            items: [
              { title: 'Record the need', description: 'State the unmet requirement, affected surface, and why composition fails.' },
              { title: 'Limit the blast radius', description: 'Keep the exception product-local and avoid naming it like a shared primitive.' },
              { title: 'Assign an owner and review date', description: 'Every exception expires, graduates, or is explicitly renewed.' },
              { title: 'Feed the system', description: 'Repeated exceptions become contribution evidence, not permanent forks.' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'assets',
    index: '07',
    title: 'Assets and distribution',
    shortTitle: 'Assets',
    summary: 'Reusable tokens, package exports, presets, icon policy, media requirements, and the source-of-truth map for every consumer.',
    status: 'evolving',
    owner: 'Design Systems and Frontend Platform',
    lastReviewed: 'August 2026',
    reviewCycle: 'Every package and token release',
    sourceOfTruth: 'Repository package exports and generated token artifact',
    outcomes: [
      'Consumers can install or download the system without copying values by hand.',
      'Every asset type names its canonical source and update path.',
      'Generated exports fail validation when they drift from source CSS.',
    ],
    sections: [
      {
        id: 'downloads',
        title: 'Reusable downloads',
        summary: 'The downloadable token artifact is generated from canonical CSS. Code consumers use package exports directly.',
        blocks: [
          {
            type: 'resources',
            title: 'Asset directory',
            items: [
              { title: 'Design tokens JSON', description: 'Generated DTCG-shaped token data with reference, semantic, layout, radius, motion, and light/dark mode values.', href: '/design-system/tokens.json', action: 'Download JSON' },
              { title: 'Design-system manifest', description: 'Versioned machine-readable contract for every public export, component, guideline, source, token dependency, and blocking validation command.', href: '/design-system/manifest.json', action: 'Download JSON' },
              { title: 'AI agent quick context', description: 'Concise operating rules and links for tools that discover llms.txt.', href: '/llms.txt', action: 'Open text' },
              { title: 'AI agent full context', description: 'Complete readable component, accessibility, implementation, guideline, template, and validation reference.', href: '/llms-full.txt', action: 'Open text' },
              { title: 'Token CSS', description: 'Canonical CSS custom properties for product runtimes.', href: 'https://github.com/TheMarco/ai-created-ui/blob/main/styles/tokens.css', action: 'View source', external: true },
              { title: 'Tailwind preset', description: 'Theme mappings, typography families, radii, semantic colors, and motion utilities.', href: 'https://github.com/TheMarco/ai-created-ui/blob/main/tailwind-preset.js', action: 'View source', external: true },
              { title: 'Approved page templates', description: 'Six complete production archetypes with loading, empty, error, permission, and completion states.', href: 'https://github.com/TheMarco/ai-created-ui/tree/main/templates/agent', action: 'View source', external: true },
              { title: 'Agent integration guide', description: 'Query commands, consumer setup, exception policy, CI gates, and MCP adapter guidance.', href: 'https://github.com/TheMarco/ai-created-ui/blob/main/docs/agent-integration.md', action: 'Read guide', external: true },
              { title: 'Component package', description: 'Public React components, utilities, providers, and motion helpers.', href: 'https://github.com/TheMarco/ai-created-ui', action: 'Open repository', external: true },
            ],
          },
          {
            type: 'code',
            title: 'Consumer setup',
            description: 'Import tokens once, extend the preset, then import public components from the package root.',
            language: 'tsx',
            code: `// app/globals.css\n@import '@ai-created/ui/styles/tokens.css';\n\n// tailwind.config.js\nmodule.exports = {\n  presets: [require('@ai-created/ui/tailwind-preset')],\n  content: ['./src/**/*.{ts,tsx}'],\n};\n\n// product UI\nimport { Button, Surface } from '@ai-created/ui';`,
          },
        ],
      },
      {
        id: 'agent-contract',
        title: 'AI agent contract',
        summary: 'Agents use the same versioned inputs and blocking gates as human contributors, without inferring undocumented design decisions.',
        blocks: [
          {
            type: 'rules',
            title: 'Agent operating model',
            items: [
              { title: 'Query canonical context', description: 'Read the manifest or query CLI before implementation. Never reconstruct props, variants, or tokens from model memory.' },
              { title: 'Start from an approved archetype', description: 'Use the directory, detail, form, settings, dashboard, or onboarding template when its product shape matches.' },
              { title: 'Reject silent drift', description: 'Raw colors, reference tokens, internal imports, arbitrary system values, and local primitive copies fail the policy gate.' },
              { title: 'Make exceptions accountable', description: 'A necessary departure names one rule, narrow files, a concrete reason, an owner, and a future review date.' },
            ],
          },
          {
            type: 'code',
            title: 'Agent query and validation',
            description: 'Commands return JSON and validate the same contract that ships with the selected package version.',
            language: 'bash',
            code: `npm run agent:query -- component button\nnpm run agent:query -- guideline accessibility\nnpm run agent:query -- template dashboard\nnpm run agent:check`,
          },
        ],
      },
      {
        id: 'source-map',
        title: 'Source-of-truth map',
        summary: 'Each asset has one canonical authoring location and an explicit distribution path.',
        blocks: [
          {
            type: 'table',
            title: 'Asset ownership',
            columns: ['Asset', 'Canonical source', 'Distribution', 'Change gate'],
            rows: [
              ['Reference and semantic tokens', 'styles/tokens.css', 'CSS package export and generated JSON', 'Theme and contrast review'],
              ['Tailwind mappings', 'tailwind-preset.js', 'Preset package export', 'Matches canonical CSS names'],
              ['React components', 'src/components', 'Package root exports', 'API, a11y, unit, interaction and visual review'],
              ['Component specifications', 'playground/specs', 'This portal', 'Registry completeness and parity tests'],
              ['Icons', 'Lucide dependency', 'lucide-react', 'Use standard glyph before custom asset'],
              ['Product imagery', 'Owning product repository', 'Product deployment', 'Theme, crop, rights and accessibility review'],
              ['Visual baselines', 'e2e/__screenshots__', 'Repository test artifact', 'Intentional reviewed update'],
              ['Agent manifest and context', 'Runtime, tokens, registries, templates, and AGENTS.md', 'Package files and portal downloads', 'Generated parity and freshness checks'],
            ],
          },
        ],
      },
      {
        id: 'library-model',
        title: 'Design library model',
        summary: 'A future design-tool library should mirror this portal without becoming a competing source of truth.',
        blocks: [
          {
            type: 'table',
            title: 'Recommended library pages',
            columns: ['Page', 'Contents'],
            rows: [
              ['00 Cover and release', 'Version, status, owner, release notes, migration alerts'],
              ['01 Foundations', 'Variables, text styles, layout, radius, motion, icon and media rules'],
              ['02 Components', 'Published component sets matching public exports'],
              ['03 Patterns', 'Approved compositions and complete state flows'],
              ['04 Accessibility', 'Annotations, focus order, keyboard and announcement notes'],
              ['05 QA', 'Theme, locale, resize, density and exceptional-state comparison frames'],
              ['99 Deprecated', 'Migration-only assets with removal version'],
            ],
          },
          {
            type: 'rules',
            title: 'Publishing policy',
            items: [
              { title: 'Version the release', description: 'Publish design assets with the corresponding package version and changelog.' },
              { title: 'Expose semantic variables', description: 'Consumers select intent. Reference values remain hidden from product authoring.' },
              { title: 'Keep code-only exports honest', description: 'Providers and utilities receive documentation, not artificial canvas components.' },
              { title: 'Audit detached instances', description: 'Detachment signals either missing capability or unsupported product drift.' },
            ],
          },
        ],
      },
      {
        id: 'asset-quality',
        title: 'Asset quality gates',
        summary: 'Reusable assets are complete only when their licensing, modes, states, naming, and fallback behavior are documented.',
        blocks: [
          {
            type: 'checklist',
            title: 'Release checklist by asset type',
            groups: [
              { title: 'Tokens', items: ['Generated artifact matches CSS.', 'Aliases resolve without cycles.', 'Light and dark modes are complete.', 'Names and types remain stable or include migration.'] },
              { title: 'Icons', items: ['Optical size matches 16, 20, or 32px role.', 'Accessible name comes from the control or nearby text.', 'Directionality is documented.', 'Custom icons include source and license.'] },
              { title: 'Media', items: ['Usage rights and source are recorded.', 'Light/dark variants and crops are paired.', 'Fallback and alt behavior is defined.', 'Files meet product performance budgets.'] },
            ],
          },
        ],
      },
    ],
  },
];

const guidelineBySlug = new Map<GuidelineSlug, GuidelineSpec>(
  guidelineSpecs.map((spec) => [spec.slug, spec]),
);

export function getGuidelineSpec(slug: string): GuidelineSpec | undefined {
  return guidelineBySlug.get(slug as GuidelineSlug);
}

export function isGuidelineSlug(slug: string): slug is GuidelineSlug {
  return guidelineBySlug.has(slug as GuidelineSlug);
}
