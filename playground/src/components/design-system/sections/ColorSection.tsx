'use client';

import DSSection from '../DSSection';
import DSCopyButton from '../DSCopyButton';

const DARK_COLORS = {
  bg: '#0A0A0B',
  surface: '#101113',
  surface2: '#14161A',
  border: 'rgba(255,255,255,0.10)',
  'border-strong': 'rgba(255,255,255,0.16)',
  text: '#F5F7FA',
  text2: 'rgba(245,247,250,0.72)',
  text3: 'rgba(245,247,250,0.62)',
  red: '#FF4B2B',
  'red-hover': '#F13A1D',
  'red-solid': '#D41010',
  'red-solid-hover': '#B80E0E',
  red2: 'rgba(255,75,43,0.72)',
  'red-border': 'rgba(255,75,43,0.42)',
  overlay: 'rgba(0,0,0,0.60)',
  highlight: 'rgba(255,255,255,0.05)',
  focus: 'rgba(255,75,43,0.72)',
  success: '#55D39A',
  'success-surface': 'rgba(85,211,154,0.12)',
  'success-border': 'rgba(85,211,154,0.32)',
  warning: '#F2B84B',
  'warning-surface': 'rgba(242,184,75,0.12)',
  'warning-border': 'rgba(242,184,75,0.30)',
  info: '#6BB9FF',
  'info-surface': 'rgba(107,185,255,0.12)',
  'info-border': 'rgba(107,185,255,0.32)',
  error: '#FF6B6B',
  'error-surface': 'rgba(255,107,107,0.12)',
  'error-border': 'rgba(255,107,107,0.32)',
};

const LIGHT_COLORS = {
  bg: '#F2EDE6',
  surface: '#F7F3EC',
  surface2: '#EAE4DB',
  border: 'rgba(0,0,0,0.10)',
  'border-strong': 'rgba(0,0,0,0.18)',
  text: '#1D1D1F',
  text2: 'rgba(29,29,31,0.72)',
  text3: 'rgba(29,29,31,0.68)',
  red: '#DE3A1F',
  'red-hover': '#C92C18',
  'red-solid': '#D41010',
  'red-solid-hover': '#B80E0E',
  red2: 'rgba(222,58,31,0.76)',
  'red-border': 'rgba(222,58,31,0.35)',
  overlay: 'rgba(0,0,0,0.45)',
  highlight: 'rgba(0,0,0,0.04)',
  focus: 'rgba(222,58,31,0.64)',
  success: '#0F9F6E',
  'success-surface': 'rgba(15,159,110,0.08)',
  'success-border': 'rgba(15,159,110,0.22)',
  warning: '#A86800',
  'warning-surface': 'rgba(168,104,0,0.08)',
  'warning-border': 'rgba(168,104,0,0.22)',
  info: '#1F6FEB',
  'info-surface': 'rgba(31,111,235,0.08)',
  'info-border': 'rgba(31,111,235,0.22)',
  error: '#C81E1E',
  'error-surface': 'rgba(200,30,30,0.08)',
  'error-border': 'rgba(200,30,30,0.20)',
};

const RED_ROLES = [
  {
    title: 'Accent red',
    token: 'red',
    hoverToken: 'red-hover',
    description:
      'The brighter red is for emphasis, active cues, rules, and selective highlights. It should read as signal, not as a filled control.',
    usage: 'Use for dividers, highlighted text, active markers, and selective accents.',
    contrast: '4.47:1 with white in dark mode',
    note: 'Do not use this as a filled button with white text.',
    contrastLabel: 'Not for white text',
    preview: 'accent',
  },
  {
    title: 'Action red',
    token: 'red-solid',
    hoverToken: 'red-solid-hover',
    description:
      'The darker red is the functional action color. It exists so filled controls can keep the same brand feel while remaining accessible.',
    usage: 'Use for primary buttons, submit actions, and any red surface carrying white text.',
    contrast: '5.41:1 with white in dark mode',
    note: 'This is the default red for filled CTAs.',
    contrastLabel: 'Accessible with white',
    preview: 'action',
  },
] as const;

const groups = [
  {
    label: 'Backgrounds',
    tokens: ['bg', 'surface', 'surface2'],
  },
  {
    label: 'Text',
    tokens: ['text', 'text2', 'text3'],
  },
  {
    label: 'Red Support',
    tokens: ['red2', 'red-border', 'focus'],
  },
  {
    label: 'UI',
    tokens: ['border', 'border-strong', 'overlay', 'highlight'],
  },
  {
    label: 'Semantic Status',
    tokens: [
      'success',
      'success-surface',
      'success-border',
      'warning',
      'warning-surface',
      'warning-border',
      'info',
      'info-surface',
      'info-border',
      'error',
      'error-surface',
      'error-border',
    ],
  },
];

const usageRules = [
  {
    title: 'Layering',
    body: 'Use bg for page background, surface for primary cards and modules, and surface2 for nested controls or quieter sub-panels.',
  },
  {
    title: 'Text Hierarchy',
    body: 'text is primary content, text2 is supporting copy, and text3 is reserved for metadata, labels, and low-emphasis UI only.',
  },
  {
    title: 'Accent Restraint',
    body: 'The bright red token is for emphasis, dividers, and active state cues. Filled controls with white text use the darker solid red token.',
  },
  {
    title: 'Light Mode Discipline',
    body: 'Because light mode is warmer and softer, avoid leaning too hard on text3 for important copy or navigation.',
  },
  {
    title: 'Semantic Status',
    body: 'Success, info, warning, and error use dedicated tokens so status UI does not overload the brand red system.',
  },
];

const accessibilityNotes = [
  'Primary and secondary text tokens are safe for navigation, labels, and helper copy. `text3` is not.',
  'Filled red controls use `red-solid` because the accent red is intentionally brighter and warmer, while `#D41010` reaches 5.41:1 with white text in dark mode.',
  'Hover reds are state tokens, not separate brand colors. They support interaction feedback, not palette expansion.',
  'Focus uses its own token so interactive outlines are visible in both themes without borrowing random utility colors.',
  'Accent red should never become the only way to communicate meaning; it reinforces, it does not carry the whole signal.',
  'Semantic status tokens are for confirmations, warnings, guidance, and failures. They should support meaning without competing with the core palette.',
];

interface ColorSectionProps {
  onInView?: (id: string) => void;
}

export default function ColorSection({ onInView }: ColorSectionProps) {
  return (
    <DSSection
      id="colors"
      title="Colors"
      subtitle="A dual-theme palette with explicit hierarchy, one accent red, one solid action red, and a small semantic status layer for system feedback."
      onInView={onInView}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {usageRules.map((rule) => (
          <div key={rule.title} className="bg-surface border border-border rounded-md p-6">
            <h3 className="text-lg font-heading font-medium text-text mb-2">
              {rule.title}
            </h3>
            <p className="text-sm text-text2 leading-relaxed">
              {rule.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-20">
        <div className="mb-6">
          <h3 className="text-xl font-heading font-medium text-text mb-2">
            Red Roles
          </h3>
          <p className="text-sm text-text2 leading-relaxed max-w-3xl">
            The red system is intentionally narrow. There are only two public-facing jobs here:
            a brighter accent red for signal and a darker action red for filled controls.
            Hover values exist as state, not as standalone color identities.
          </p>
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-text2 mt-3">
            Click any swatch or token row to copy its current value.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {RED_ROLES.map((role) => (
            <div key={role.title} className="bg-surface border border-border rounded-md p-6">
              <div className="flex flex-col gap-2 mb-5">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-lg font-heading font-medium text-text">
                    {role.title}
                  </h4>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text3">
                    {role.preview === 'action' ? 'filled controls' : 'signal only'}
                  </span>
                </div>
                <p className="text-sm text-text2 leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="mb-5">
                <DSCopyButton
                  value={DARK_COLORS[role.token as keyof typeof DARK_COLORS]}
                  className="w-full text-left flex-col items-start gap-0 rounded-md border border-border bg-surface2 p-3"
                >
                  <div
                    className="w-full h-24 rounded-md border border-border mb-3"
                    style={{ backgroundColor: `var(--color-${role.token})` }}
                  />
                  <div className="flex w-full items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono text-text block">
                        {role.token}
                      </span>
                      <span className="text-[10px] font-mono text-text3 block">
                        {`--color-${role.token}`}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] ${
                        role.preview === 'action'
                          ? 'bg-red-solid text-white'
                          : 'border border-red-border text-red'
                      }`}
                    >
                      {role.contrastLabel}
                    </span>
                  </div>
                </DSCopyButton>
              </div>

              <div className="rounded-md border border-border bg-surface2 p-3 mb-5">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text3">
                    Hover state
                  </span>
                  <span className="text-[10px] font-mono text-text3">
                    {`--color-${role.hoverToken}`}
                  </span>
                </div>
                <DSCopyButton
                  value={DARK_COLORS[role.hoverToken as keyof typeof DARK_COLORS]}
                  className="w-full text-left items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-12 rounded-sm border border-border"
                      style={{ backgroundColor: `var(--color-${role.hoverToken})` }}
                    />
                    <span className="text-xs font-mono text-text">
                      {role.hoverToken}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-text3">
                    state only
                  </span>
                </DSCopyButton>
              </div>

              <div className="rounded-md border border-border bg-bg p-4 mb-4">
                {role.preview === 'accent' ? (
                  <div className="space-y-4">
                    <div
                      className="h-px w-full"
                      style={{ background: 'linear-gradient(90deg, var(--color-red), transparent)' }}
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center rounded-full border border-red-border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-red">
                        active cue
                      </span>
                      <span className="text-sm text-text2">
                        Use the brighter red to point, not to shout.
                      </span>
                    </div>
                    <p className="text-sm text-text2 leading-relaxed">
                      <span className="text-text">Signal</span> and{' '}
                      <span className="text-red">selective emphasis</span> should feel deliberate.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center rounded-md bg-red-solid px-4 py-2 text-sm font-medium text-white">
                        Launch Product
                      </span>
                      <span className="inline-flex items-center rounded-md bg-red-solid-hover px-4 py-2 text-sm font-medium text-white">
                        Hover State
                      </span>
                    </div>
                    <p className="text-sm text-text2 leading-relaxed">
                      Filled red actions must preserve the brand while still reading clearly with white text.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-md border border-border bg-surface2 px-3 py-3">
                  <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">
                    Use
                  </span>
                  <span className="text-text2 leading-relaxed">{role.usage}</span>
                </div>
                <div className="rounded-md border border-border bg-surface2 px-3 py-3">
                  <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">
                    Guardrail
                  </span>
                  <span className="text-text2 leading-relaxed">{role.note}</span>
                </div>
              </div>

              <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.16em] text-text3">
                Contrast: {role.contrast}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Supporting Palette Grid */}
      <div className="space-y-10 mb-20">
        <div>
          <h3 className="text-xl font-heading font-medium text-text mb-2">
            Supporting Tokens
          </h3>
          <p className="text-sm text-text2 leading-relaxed max-w-3xl">
            These tokens support the main palette. They matter, but they are not meant to compete
            with the primary color roles above.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.label}>
            <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-text3 mb-4">
              {group.label}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {group.tokens.map((token) => (
                <DSCopyButton
                  key={token}
                  value={DARK_COLORS[token as keyof typeof DARK_COLORS]}
                  className="w-full text-left flex-col items-start gap-0"
                >
                  <div
                    className="w-full h-16 rounded-md border border-border mb-2"
                    style={{ backgroundColor: `var(--color-${token})` }}
                  />
                  <span className="text-xs font-mono text-text block">
                    {token}
                  </span>
                  <span className="text-[10px] font-mono text-text3 block">
                    {`--color-${token}`}
                  </span>
                </DSCopyButton>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-md p-8 mb-16">
        <h3 className="text-xl font-heading font-medium text-text mb-4">
          Accessibility Notes
        </h3>
        <ul className="space-y-2">
          {accessibilityNotes.map((note) => (
            <li key={note} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-red mt-0.5">-</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Dark ↔ Light Comparison */}
      <h3 className="text-xl font-heading font-medium text-text mb-6">
        Dark &#8596; Light
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {/* Dark Panel */}
        <div className="rounded-lg overflow-hidden border border-border" style={{ backgroundColor: '#0A0A0B' }}>
          <div className="px-5 py-3 border-b border-border">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: 'rgba(245,247,250,0.62)' }}>
              Dark Mode
            </span>
          </div>
          <div className="p-5 space-y-2">
            {Object.entries(DARK_COLORS).slice(0, 10).map(([name, value]) => (
              <div key={name} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-sm shrink-0 border border-border"
                  style={{ backgroundColor: value }}
                />
                <span className="text-xs font-mono" style={{ color: 'rgba(245,247,250,0.62)' }}>
                  {name}
                </span>
                <span className="text-[10px] font-mono ml-auto" style={{ color: 'rgba(245,247,250,0.36)' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Light Panel */}
        <div className="rounded-lg overflow-hidden border" style={{ backgroundColor: '#F2EDE6', borderColor: 'rgba(0,0,0,0.10)' }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.10)' }}>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: 'rgba(29,29,31,0.68)' }}>
              Light Mode
            </span>
          </div>
          <div className="p-5 space-y-2">
            {Object.entries(LIGHT_COLORS).slice(0, 10).map(([name, value]) => (
              <div key={name} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-sm shrink-0"
                  style={{ backgroundColor: value, border: '1px solid rgba(0,0,0,0.10)' }}
                />
                <span className="text-xs font-mono" style={{ color: 'rgba(29,29,31,0.68)' }}>
                  {name}
                </span>
                <span className="text-[10px] font-mono ml-auto" style={{ color: 'rgba(29,29,31,0.32)' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contrast Showcase */}
      <h3 className="text-xl font-heading font-medium text-text mb-6">
        In Context
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dark card preview */}
        <div className="rounded-lg overflow-hidden border border-border p-6" style={{ backgroundColor: '#101113' }}>
          <h4 className="text-lg font-heading font-medium mb-2" style={{ color: '#F5F7FA' }}>
            Card Heading
          </h4>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(245,247,250,0.72)' }}>
            Body text on a surface background. This demonstrates how the token hierarchy creates readable, layered interfaces.
          </p>
          <div className="flex gap-3">
            <span className="px-4 py-1.5 text-sm font-medium rounded-md text-white" style={{ backgroundColor: '#D41010' }}>
              Primary Action
            </span>
            <span className="px-4 py-1.5 text-sm font-medium rounded-md" style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(245,247,250,0.72)' }}>
              Secondary
            </span>
          </div>
        </div>

        {/* Light card preview */}
        <div className="rounded-lg overflow-hidden p-6" style={{ backgroundColor: '#F7F3EC', border: '1px solid rgba(0,0,0,0.10)' }}>
          <h4 className="text-lg font-heading font-medium mb-2" style={{ color: '#1D1D1F' }}>
            Card Heading
          </h4>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(29,29,31,0.72)' }}>
            Body text on a surface background. This demonstrates how the token hierarchy creates readable, layered interfaces.
          </p>
          <div className="flex gap-3">
            <span className="px-4 py-1.5 text-sm font-medium rounded-md text-white" style={{ backgroundColor: '#D41010' }}>
              Primary Action
            </span>
            <span className="px-4 py-1.5 text-sm font-medium rounded-md" style={{ border: '1px solid rgba(0,0,0,0.10)', color: 'rgba(29,29,31,0.72)' }}>
              Secondary
            </span>
          </div>
        </div>
      </div>
    </DSSection>
  );
}
