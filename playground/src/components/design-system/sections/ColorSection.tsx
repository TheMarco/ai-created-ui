'use client';

import { accentNames, useTheme, type Accent } from '@ai-created/ui';
import DSSection from '../DSSection';
import DSCopyButton from '../DSCopyButton';

const accentValues: Record<Accent, {
  dark: string;
  darkHover: string;
  light: string;
  lightHover: string;
  action: string;
  actionHover: string;
}> = {
  red: { dark: '#FF4B2B', darkHover: '#F13A1D', light: '#C81E1E', lightHover: '#B80E0E', action: '#D41010', actionHover: '#C81010' },
  green: { dark: '#03A32C', darkHover: '#029527', light: '#01761D', lightHover: '#016819', action: '#027B1F', actionHover: '#01741C' },
  blue: { dark: '#268CFE', darkHover: '#027FF5', light: '#0264C2', lightHover: '#0158AD', action: '#0269CC', actionHover: '#0162BF' },
  orange: { dark: '#D97001', darkHover: '#C86701', light: '#9E5000', lightHover: '#8C4601', action: '#A55401', actionHover: '#9B4E01' },
  yellow: { dark: '#AC8802', darkHover: '#9E7D01', light: '#7C6202', lightHover: '#6E5600', action: '#826701', actionHover: '#7A6001' },
  purple: { dark: '#A96CFF', darkHover: '#9D5FF1', light: '#8240D0', lightHover: '#7632C2', action: '#8746D6', actionHover: '#803ECE' },
  teal: { dark: '#059E91', darkHover: '#059085', light: '#027268', lightHover: '#00655C', action: '#02776E', actionHover: '#017067' },
  pink: { dark: '#F14E9C', darkHover: '#E23F8F', light: '#C01473', lightHover: '#AE0166', action: '#C71F78', actionHover: '#BE0F71' },
  magenta: { dark: '#D25CDA', darkHover: '#C44FCD', light: '#A52EAE', lightHover: '#971CA0', action: '#AB35B3', actionHover: '#A32BAC' },
};

const accentRoles = [
  { token: 'accent', label: 'Accent', purpose: 'Links, icons, active rules, and selective emphasis.' },
  { token: 'accent-muted', label: 'Muted accent', purpose: 'Accessible lower-chroma supporting emphasis.' },
  { token: 'accent-hover', label: 'Accent hover', purpose: 'Text and icon interaction feedback.' },
  { token: 'accent-border', label: 'Accent border', purpose: 'Contrast-safe accented boundaries.' },
  { token: 'action-primary', label: 'Primary action', purpose: 'Solid branded controls with on-action text.' },
  { token: 'action-primary-hover', label: 'Action hover', purpose: 'Hover fill that retains text and boundary contrast.' },
  { token: 'focus', label: 'Focus', purpose: 'Global keyboard focus indicator.' },
  { token: 'selection', label: 'Selection', purpose: 'Theme-aware text selection surface.' },
] as const;

const statusRoles = [
  { token: 'success', label: 'Success' },
  { token: 'warning', label: 'Warning' },
  { token: 'info', label: 'Info' },
  { token: 'error', label: 'Error' },
  { token: 'action-destructive', label: 'Destructive' },
] as const;

const usageRules = [
  ['Semantic first', 'Components consume accent, action, focus, and selection roles. They never select a named hue directly.'],
  ['Red by default', 'Existing consumers remain red until data-accent or ThemeProvider selects another supported scheme.'],
  ['Meaning stays fixed', 'Destructive, success, warning, info, and error never change when the accent changes.'],
  ['Dual-theme contract', 'Every role is independently tuned for dark and light foundations instead of mechanically inverted.'],
] as const;

const accessibilityNotes = [
  'Accent, muted-accent, and hover text meet 4.5:1 on bg, surface, and surface2 in both themes.',
  'Primary action and hover fills meet 4.5:1 with on-action text and 3:1 against every foundation.',
  'Focus and accent borders meet 3:1 against all three foundations.',
  'Selection keeps primary text at 4.5:1 or better on every foundation.',
  'The browser suite exercises all nine accents across both themes: 18 appearance combinations per browser project.',
  'Color reinforces state but never carries meaning without text, iconography, or native semantics.',
];

interface ColorSectionProps {
  onInView?: (id: string) => void;
}

export default function ColorSection({ onInView }: ColorSectionProps) {
  const { accent, setAccent } = useTheme();
  const selected = accentValues[accent];

  return (
    <DSSection
      id="colors"
      title="Colors"
      subtitle="Nine accessible accent schemes share one semantic contract across dark and light mode. Status and destructive colors remain independent."
      onInView={onInView}
    >
      <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-2">
        {usageRules.map(([title, body]) => (
          <div key={title} className="rounded-md border border-border bg-surface p-6">
            <h3 className="mb-2 text-lg font-heading font-medium text-text">{title}</h3>
            <p className="text-sm leading-relaxed text-text2">{body}</p>
          </div>
        ))}
      </div>

      <section className="mb-20" aria-labelledby="accent-schemes-heading">
        <div className="mb-6 max-w-3xl">
          <h3 id="accent-schemes-heading" className="mb-2 text-xl font-heading font-medium text-text">
            Accent schemes
          </h3>
          <p className="text-sm leading-relaxed text-text2">
            Choose a scheme to preview the full portal. Dark display accents share the current red’s luminance target; light values and yellow-family actions deliberately deepen to preserve contrast.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {accentNames.map((name) => {
            const values = accentValues[name];
            const active = accent === name;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => setAccent(name)}
                className={`rounded-md border bg-surface p-3 text-left transition-colors ${active ? 'border-accent' : 'border-control-border hover:border-control-border-strong'}`}
              >
                <span className="mb-3 grid h-10 grid-cols-2 overflow-hidden rounded-sm border border-border" aria-hidden="true">
                  <span style={{ backgroundColor: values.dark }} />
                  <span style={{ backgroundColor: values.light }} />
                </span>
                <span className="block text-sm capitalize text-text">{name}</span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-text3">
                  {active ? 'Active' : 'Preview'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-20" aria-labelledby="active-roles-heading">
        <div className="mb-6">
          <h3 id="active-roles-heading" className="mb-2 text-xl font-heading font-medium text-text">
            Active {accent} roles
          </h3>
          <p className="max-w-3xl text-sm leading-relaxed text-text2">
            Public utilities keep semantic names. The legacy red aliases resolve to these same active values for compatibility.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {accentRoles.map(({ token, label, purpose }) => (
            <DSCopyButton
              key={token}
              value={`var(--color-${token})`}
              className="w-full flex-col items-start gap-0 rounded-md border border-border bg-surface p-4 text-left"
            >
              <span
                className="mb-4 h-16 w-full rounded-md border border-border"
                style={{ backgroundColor: `var(--color-${token})` }}
              />
              <span className="text-sm text-text">{label}</span>
              <span className="mt-1 font-mono text-[10px] text-accent">--color-{token}</span>
              <span className="mt-2 text-xs leading-relaxed text-text3">{purpose}</span>
            </DSCopyButton>
          ))}
        </div>
      </section>

      <section className="mb-20 rounded-md border border-border bg-surface p-6" aria-labelledby="semantic-colors-heading">
        <h3 id="semantic-colors-heading" className="mb-2 text-xl font-heading font-medium text-text">
          Meaning does not follow the accent
        </h3>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-text2">
          A green brand accent does not turn errors green, and a red accent does not make routine information destructive.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {statusRoles.map(({ token, label }) => (
            <div key={token} className="rounded-md border border-border bg-surface2 p-3">
              <span className="mb-3 block h-8 rounded-sm" style={{ backgroundColor: `var(--color-${token})` }} />
              <span className="text-xs text-text2">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20" aria-labelledby="theme-comparison-heading">
        <h3 id="theme-comparison-heading" className="mb-6 text-xl font-heading font-medium text-text">
          {accent} in dark and light
        </h3>
        <div data-visual="color-theme-comparison" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg border" style={{ backgroundColor: '#0A0A0B', borderColor: 'rgba(255,255,255,0.16)' }}>
            <div className="border-b px-5 py-3" style={{ borderColor: 'rgba(255,255,255,0.16)', color: '#F5F7FA' }}>Dark mode</div>
            <div className="space-y-5 p-5">
              <p className="text-sm" style={{ color: selected.dark }}>Accent text remains readable on black foundations.</p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: selected.action }}>Primary action</span>
                <span className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: selected.actionHover }}>Hover state</span>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono text-[10px]" style={{ color: 'rgba(245,247,250,0.72)' }}>
                <span>{selected.dark}</span><span>{selected.action}</span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border" style={{ backgroundColor: '#F2EDE6', borderColor: 'rgba(0,0,0,0.18)' }}>
            <div className="border-b px-5 py-3" style={{ borderColor: 'rgba(0,0,0,0.18)', color: '#1D1D1F' }}>Light mode</div>
            <div className="space-y-5 p-5">
              <p className="text-sm" style={{ color: selected.light }}>Accent text deepens to remain readable on white foundations.</p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: selected.action }}>Primary action</span>
                <span className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: selected.actionHover }}>Hover state</span>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono text-[10px]" style={{ color: 'rgba(29,29,31,0.72)' }}>
                <span>{selected.light}</span><span>{selected.action}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-border bg-surface p-8" aria-labelledby="contrast-contract-heading">
        <h3 id="contrast-contract-heading" className="mb-4 text-xl font-heading font-medium text-text">
          Accessibility contract
        </h3>
        <ul className="space-y-2">
          {accessibilityNotes.map((note) => (
            <li key={note} className="flex items-start gap-2 text-sm leading-relaxed text-text2">
              <span className="mt-0.5 text-accent">-</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </section>
    </DSSection>
  );
}
