'use client';

import DSSection from '../DSSection';
import DSCodeBlock from '../DSCodeBlock';
import { ThemeToggle } from '@ai-created/ui';

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
  { name: '--color-red', dark: '#FF4B2B', light: '#DE3A1F' },
  { name: '--color-red-hover', dark: '#F13A1D', light: '#C92C18' },
  { name: '--color-red-solid', dark: '#D41010', light: '#D41010' },
  { name: '--color-red-solid-hover', dark: '#B80E0E', light: '#B80E0E' },
  { name: '--color-border', dark: 'rgba(255,255,255,0.10)', light: 'rgba(0,0,0,0.10)' },
  { name: '--color-border-strong', dark: 'rgba(255,255,255,0.16)', light: 'rgba(0,0,0,0.18)' },
  { name: '--color-focus', dark: 'rgba(255,75,43,0.72)', light: 'rgba(222,58,31,0.64)' },
  { name: '--color-overlay', dark: 'rgba(0,0,0,0.60)', light: 'rgba(0,0,0,0.45)' },
  { name: '--color-highlight', dark: 'rgba(255,255,255,0.05)', light: 'rgba(0,0,0,0.04)' },
  { name: '--color-success', dark: '#55D39A', light: '#0F9F6E' },
  { name: '--color-success-surface', dark: 'rgba(85,211,154,0.12)', light: 'rgba(15,159,110,0.08)' },
  { name: '--color-info', dark: '#6BB9FF', light: '#1F6FEB' },
  { name: '--color-warning', dark: '#F2B84B', light: '#A86800' },
  { name: '--color-error', dark: '#FF6B6B', light: '#C81E1E' },
];

const codeExample = `:root {
  --radius-md: 6px;
  --layout-container-max: 1400px;
  --motion-base: 0.3s;
  --color-bg: #0A0A0B;
  --color-surface: #101113;
  --color-text: #F5F7FA;
  --color-focus: rgba(255,75,43,0.72);
  --color-red: #FF4B2B;
  --color-red-hover: #F13A1D;
  --color-red-solid: #D41010;
  --color-red-solid-hover: #B80E0E;
  --color-success: #55D39A;
  --color-info: #6BB9FF;
}

html.light {
  --color-bg: #F2EDE6;
  --color-surface: #F7F3EC;
  --color-text: #1D1D1F;
  --color-focus: rgba(222,58,31,0.64);
  --color-red: #DE3A1F;
  --color-red-hover: #C92C18;
  --color-red-solid: #D41010;
  --color-red-solid-hover: #B80E0E;
  --color-success: #0F9F6E;
  --color-info: #1F6FEB;
}`;

const implementationRules = [
  'Prefer semantic tokens such as bg-bg, bg-surface, text-text2, and border-border before reaching for raw white or black utilities.',
  'text3 is metadata only. Do not use it for critical navigation or long-form body copy, especially in light mode.',
  'Use bg-red-solid and bg-red-solid-hover for filled actions with white text. bg-red remains the brighter accent token.',
  'Prefer shared primitives such as Button, Surface, TextInput, and TextArea before rebuilding interaction styling route by route.',
  'Hover reds are state values, not separate palette identities. Document them as interaction feedback, not as standalone brand colors.',
  'Focus styling is tokenized. Do not invent ad hoc focus colors that drift from the system.',
  'Status feedback uses semantic success, info, warning, and error tokens instead of borrowing brand red for every message.',
  'Hero media uses shared theme variables and the ThemedHeroImage component. Do not hand-roll overlay colors or theme swaps in route components.',
  'A component is not done until it works credibly in both dark and light themes.',
];

const accessibilityChecks = [
  'Verify contrast and focus visibility in both themes before shipping.',
  'Filled red controls should pass with white text because they use the solid action red, not the brighter accent red.',
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
      subtitle="The site is dark-native, but not dark-only. Theme support is part of the system contract, including layout, motion, and semantic feedback tokens."
      onInView={onInView}
    >
      <div className="bg-surface border border-border rounded-md p-8 mb-12">
        <h3 className="text-sm font-heading font-medium text-text mb-4">Implementation rules</h3>
        <ul className="space-y-2">
          {implementationRules.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-red mt-0.5">-</span>
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
          <span className="px-3 py-1.5 bg-surface2 border border-border rounded-md text-text2">localStorage</span>
          <span className="text-text3">&rarr;</span>
          <span className="px-3 py-1.5 bg-surface2 border border-border rounded-md text-text2">html.light class</span>
          <span className="text-text3">&rarr;</span>
          <span className="px-3 py-1.5 bg-surface2 border border-border rounded-md text-text2">CSS vars update</span>
        </div>
        <p className="text-xs text-text3 mt-4">
          A script in the document head reads localStorage before first paint, preventing flash of wrong theme.
          The <code className="font-mono text-text2">.theme-transitioning</code> class enables smooth 0.3s transitions only after user-initiated toggles.
        </p>
      </div>

      {/* Live Toggle */}
      <div className="bg-surface border border-border rounded-md p-8 mb-12 flex items-center gap-6">
        <ThemeToggle />
        <div>
          <p className="text-sm text-text font-medium">Toggle the site theme</p>
          <p className="text-xs text-text3 mt-0.5">Every documented token adapts. If a component breaks here, it is not following the system.</p>
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
              <span className="text-red mt-0.5">-</span>
              <span>{check}</span>
            </li>
          ))}
        </ul>
      </div>
    </DSSection>
  );
}
