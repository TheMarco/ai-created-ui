'use client';

import DSSection from '../DSSection';
import DSCodeBlock from '../DSCodeBlock';
import { ThemeToggle } from '@ai-created/ui';
import AccentPicker from '../../AccentPicker';

const darkVars = [
  { name: '--radius-md', dark: '6px', light: '6px' },
  { name: '--layout-container-max', dark: '1400px', light: '1400px' },
  { name: '--motion-base', dark: '0.3s', light: '0.3s' },
  { name: '--color-bg', dark: '#0A0A0B', light: '#F2EDE6' },
  { name: '--color-surface', dark: '#101113', light: '#F7F3EC' },
  { name: '--color-surface2', dark: '#14161A', light: '#EAE4DB' },
  { name: '--color-text', dark: '#F5F7FA', light: '#1D1D1F' },
  { name: '--color-text2', dark: 'rgba(245,247,250,0.72)', light: 'rgba(29,29,31,0.72)' },
  { name: '--color-text3', dark: 'rgba(245,247,250,0.62)', light: 'rgba(29,29,31,0.68)' },
  { name: '--color-accent', dark: '#FF4B2B', light: '#C81E1E' },
  { name: '--color-accent-hover', dark: '#F13A1D', light: '#B80E0E' },
  { name: '--color-action-primary', dark: '#D41010', light: '#D41010' },
  { name: '--color-action-primary-hover', dark: '#C81010', light: '#C81010' },
  { name: '--color-action-destructive', dark: '#B91C1C', light: '#9F1239' },
  { name: '--color-on-action', dark: '#FFFFFF', light: '#FFFFFF' },
  { name: '--color-border', dark: 'rgba(255,255,255,0.10)', light: 'rgba(0,0,0,0.10)' },
  { name: '--color-border-strong', dark: 'rgba(255,255,255,0.16)', light: 'rgba(0,0,0,0.18)' },
  { name: '--color-control-border', dark: 'rgba(255,255,255,0.36)', light: 'rgba(0,0,0,0.42)' },
  { name: '--color-control-border-strong', dark: 'rgba(255,255,255,0.50)', light: 'rgba(0,0,0,0.54)' },
  { name: '--color-focus', dark: '#FF4B2B', light: '#C81E1E' },
  { name: '--color-overlay', dark: 'rgba(0,0,0,0.60)', light: 'rgba(0,0,0,0.45)' },
  { name: '--color-highlight', dark: 'rgba(255,255,255,0.05)', light: 'rgba(0,0,0,0.04)' },
  { name: '--color-success', dark: '#55D39A', light: '#065F46' },
  { name: '--color-success-surface', dark: 'rgba(85,211,154,0.12)', light: 'rgba(6,95,70,0.08)' },
  { name: '--color-info', dark: '#6BB9FF', light: '#1E40AF' },
  { name: '--color-warning', dark: '#F2B84B', light: '#713F12' },
  { name: '--color-error', dark: '#FF6B6B', light: '#9F1239' },
];

const codeExample = `:root {
  --radius-md: 6px;
  --layout-container-max: 1400px;
  --motion-base: 0.3s;
  --color-bg: #0A0A0B;
  --color-surface: #101113;
  --color-text: #F5F7FA;
  --color-focus: #FF4B2B;
  --color-accent: var(--ref-accent-current-400);
  --color-accent-hover: var(--ref-accent-current-500);
  --color-action-primary: var(--ref-accent-current-700);
  --color-action-primary-hover: var(--ref-accent-current-800);
  --color-action-destructive: #B91C1C;
  --color-on-action: #FFFFFF;
  --color-success: #55D39A;
  --color-info: #6BB9FF;
}

html.light {
  --color-bg: #F2EDE6;
  --color-surface: #F7F3EC;
  --color-text: #1D1D1F;
  --color-focus: var(--ref-accent-current-750);
  --color-accent: var(--ref-accent-current-750);
  --color-accent-hover: var(--ref-accent-current-900);
  --color-action-destructive: #9F1239;
  --color-success: #065F46;
  --color-info: #1E40AF;
}

html[data-accent='blue'] {
  /* Switches the current accent reference family; semantic utilities stay unchanged. */
}`;

const accentSetupExample = `// Persisted user preference: render the fallback before hydration.
<html data-accent="blue">
  <head>{/* Run the validated theme + accent storage script from the README. */}</head>
  <body>
    <ThemeProvider defaultAccent="blue">{children}</ThemeProvider>
  </body>
</html>

// Fixed product accent: ignore saved accent storage.
<html data-accent="blue">
  <head>{/* Run the theme-only initialization script from the README. */}</head>
  <body>
    <ThemeProvider accent="blue">{children}</ThemeProvider>
  </body>
</html>

// Externally controlled accent: the owner applies callback requests.
<ThemeProvider accent={accent} onAccentChange={setAccent}>
  {children}
</ThemeProvider>`;

const implementationRules = [
  'Prefer semantic tokens such as bg-bg, bg-surface, text-text2, and border-border before reaching for raw white or black utilities.',
  'text3 is metadata only. Do not use it for critical navigation or long-form body copy, especially in light mode.',
  'Use bg-action-primary or bg-action-destructive with text-on-action for filled actions. Primary follows the accent; destructive never does.',
  'Prefer shared primitives such as Button, Surface, TextInput, and TextArea before rebuilding interaction styling route by route.',
  'Accent hover values are state roles, not standalone palette choices. Do not select numbered reference steps in product code.',
  'Focus styling is tokenized. Do not invent ad hoc focus colors that drift from the system.',
  'Status feedback uses semantic success, info, warning, and error tokens instead of borrowing brand red for every message.',
  'Choose a persisted preference with useTheme, a fallback with defaultAccent, or a fixed product accent with accent.',
  'Hero media uses shared theme variables and the ThemedHeroImage component. Do not hand-roll overlay colors or theme swaps in route components.',
  'A component is not done until it works credibly in both dark and light themes.',
];

const accessibilityChecks = [
  'Verify contrast and focus visibility in both themes before shipping.',
  'Filled actions must keep at least 4.5:1 foreground contrast through the primary/destructive and on-action token pairs.',
  'Every accent must pass text, focus, boundary, hover, and selection checks across bg, surface, and surface2 in dark and light mode.',
  'Success, info, warning, and error surfaces should remain readable in both themes and should not become accidental brand accents.',
  'The theme toggle itself must remain clearly named and keyboard-usable.',
  'If a theme-specific exception is required, document why it exists and how it avoids becoming permanent design debt.',
];

interface ThemeSectionProps {
  onInView?: (id: string) => void;
}

export default function ThemeSection({ onInView }: ThemeSectionProps) {
  return (
    <DSSection
      id="theme"
      title="Theme Rules"
      subtitle="The system supports dark and light foundations plus nine accessible accent schemes. Theme, accent, motion, and semantic feedback are one appearance contract."
      onInView={onInView}
    >
      <div className="bg-surface border border-border rounded-md p-8 mb-12">
        <h3 className="text-sm font-heading font-medium text-text mb-4">Implementation rules</h3>
        <ul className="space-y-2">
          {implementationRules.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-accent mt-0.5">-</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Architecture */}
      <div className="bg-surface border border-border rounded-md p-8 mb-12">
        <h3 className="text-sm font-heading font-medium text-text mb-4">How it works</h3>
        <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-text3">
          <span className="px-3 py-1.5 bg-surface2 border border-border rounded-md text-text2">ThemeProvider</span>
          <span className="text-text3">&rarr;</span>
          <span className="px-3 py-1.5 bg-surface2 border border-border rounded-md text-text2">appearance owner / storage</span>
          <span className="text-text3">&rarr;</span>
          <span className="px-3 py-1.5 bg-surface2 border border-border rounded-md text-text2">html.light + data-accent</span>
          <span className="text-text3">&rarr;</span>
          <span className="px-3 py-1.5 bg-surface2 border border-border rounded-md text-text2">CSS vars update</span>
        </div>
        <p className="text-xs text-text3 mt-4">
          Preference mode reads theme and accent before first paint; fixed mode reads only theme and keeps its server-rendered accent.
          The <code className="font-mono text-text2">.theme-transitioning</code> class enables smooth 0.3s transitions only after user-initiated changes.
        </p>
      </div>

      {/* Live Toggle */}
      <div className="bg-surface border border-border rounded-md p-8 mb-12 flex flex-wrap items-center gap-6">
        <ThemeToggle />
        <AccentPicker />
        <div>
          <p className="text-sm text-text font-medium">Change the portal appearance</p>
          <p className="text-xs text-text3 mt-0.5">Every semantic component adapts to theme and accent without hue-specific component branches.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-md p-8 mb-12">
        <h3 className="text-sm font-heading font-medium text-text mb-3">Three accent selection modes</h3>
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div><p className="font-mono text-accent">defaultAccent</p><p className="text-text2 mt-1">Uncontrolled fallback. Resolution is saved preference, existing <code>data-accent</code>, this default, then red.</p></div>
          <div><p className="font-mono text-accent">useTheme().setAccent</p><p className="text-text2 mt-1">Use with <code>accentNames</code> for a picker. Changes update the document and persist for the user.</p></div>
          <div><p className="font-mono text-accent">accent + onAccentChange</p><p className="text-text2 mt-1">Controlled mode. The prop wins and stays fixed; requests call the callback without persistence. The callback also observes uncontrolled changes.</p></div>
        </div>
        <p className="text-xs text-text3 mt-4">For a fixed product accent, pair <code>data-accent="blue"</code> on the initial html element with <code>&lt;ThemeProvider accent="blue"&gt;</code> and use a theme-only pre-hydration script.</p>
        <div className="mt-6">
          <DSCodeBlock code={accentSetupExample} language="tsx" />
        </div>
      </div>

      {/* Code Example */}
      <div className="mb-12">
        <DSCodeBlock code={codeExample} language="css" />
      </div>

      {/* Variable Reference Table */}
      <h3 className="text-xl font-heading font-medium text-text mb-6">Token Reference</h3>
      <div className="border border-border rounded-md overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-0 text-[10px] font-mono uppercase tracking-wider text-text3 border-b border-border bg-surface">
          <div className="px-4 py-2.5">Variable</div>
          <div className="px-4 py-2.5">Dark</div>
          <div className="px-4 py-2.5">Light</div>
        </div>
        {darkVars.map((v, i) => (
          <div
            key={v.name}
            className={`grid grid-cols-[1fr_1fr_1fr] gap-0 text-xs font-mono ${
              i < darkVars.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className="px-4 py-2.5 text-text2 truncate">{v.name}</div>
            <div className="px-4 py-2.5 flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0 border border-border"
                style={{ backgroundColor: v.dark }}
              />
              <span className="text-text3 truncate">{v.dark}</span>
            </div>
            <div className="px-4 py-2.5 flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: v.light, border: '1px solid rgba(0,0,0,0.15)' }}
              />
              <span className="text-text3 truncate">{v.light}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-surface border border-border rounded-md p-8">
        <h3 className="text-xl font-heading font-medium text-text mb-4">
          Accessibility Checks
        </h3>
        <ul className="space-y-2">
          {accessibilityChecks.map((check) => (
            <li key={check} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-accent mt-0.5">-</span>
              <span>{check}</span>
            </li>
          ))}
        </ul>
      </div>
    </DSSection>
  );
}
