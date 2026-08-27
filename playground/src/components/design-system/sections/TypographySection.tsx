'use client';

import DSSection from '../DSSection';

const families = [
  {
    name: 'Instrument Serif',
    role: 'Display',
    className: 'font-display',
    sample: 'The art of building software',
    weights: [{ label: 'Regular', value: 400 }],
    usage: 'Hero titles, section headers, editorial moments. The only serif in the system \u2014 used sparingly for maximum impact.',
    tracking: 'tracking-wide',
  },
  {
    name: 'Space Grotesk',
    role: 'Primary Sans',
    className: 'font-heading',
    sample: 'Products that ship. Clear, readable text that scales from captions to paragraphs.',
    weights: [
      { label: 'Light', value: 300 },
      { label: 'Regular', value: 400 },
      { label: 'Medium', value: 500 },
      { label: 'Semi', value: 600 },
      { label: 'Bold', value: 700 },
    ],
    usage: 'Headings, body text, navigation, UI labels. The workhorse typeface \u2014 geometric, distinctive, readable at every size.',
    tracking: 'tracking-tight to tracking-normal',
  },
  {
    name: 'System Monospace',
    role: 'Monospace',
    className: 'font-mono',
    sample: 'const system = { status: "live" }',
    weights: [
      { label: 'Regular', value: 400 },
    ],
    usage: 'Code, technical labels, badges, metadata. Uses the platform\u2019s native monospace (SF Mono, Menlo, Consolas).',
    tracking: 'tracking-normal',
  },
];

const typeScale = [
  { class: 'text-xs', size: '15px', role: 'Meta labels, timestamps, badges', sample: 'Published May 2026' },
  { class: 'text-sm', size: '17.5px', role: 'Card copy, controls, supporting UI', sample: 'Structured product and editorial copy.' },
  { class: 'text-base', size: '20px', role: 'Primary paragraphs and intro copy', sample: 'Clear, confident body text for authored content.' },
  { class: 'text-lg', size: '22.5px', role: 'Hero subheads and summary lines', sample: 'A system that stays readable while feeling premium.' },
  { class: 'text-xl', size: '25px', role: 'Card titles and callout headings', sample: 'What the interface should make obvious' },
  { class: 'text-3xl', size: '37.5px', role: 'Section titles', sample: 'Section Heading' },
  { class: 'text-5xl', size: '60px', role: 'Large display moments', sample: 'Design System' },
];

const roleRecipes = [
  {
    title: 'Hero Title',
    recipe: 'font-display text-4xl md:text-7xl tracking-wide',
    note: 'Reserved for route-level hero moments and major page framing.',
  },
  {
    title: 'Section Title',
    recipe: 'font-display text-3xl md:text-5xl tracking-wide',
    note: 'Used for major sections on the homepage and key interior pages.',
  },
  {
    title: 'Card Title',
    recipe: 'font-heading text-lg or text-xl font-medium',
    note: 'Most UI titles should stay in Space Grotesk rather than borrowing display styling.',
  },
  {
    title: 'Metadata',
    recipe: 'font-mono text-xs uppercase tracking-wider',
    note: 'Use for dates, labels, statuses, platform markers, and structural utility copy.',
  },
];

const accessibilityNotes = [
  'The effective base size is 20px, so the UI starts from a readable floor instead of relying on micro-type.',
  'Use real heading levels in page templates; display styling never replaces document structure.',
  'Serif is reserved for expressive moments. Dense UI, forms, and filters stay in Space Grotesk to preserve legibility.',
];

interface TypographySectionProps {
  onInView?: (id: string) => void;
}

export default function TypographySection({ onInView }: TypographySectionProps) {
  return (
    <DSSection
      id="typography"
      title="Typography"
      subtitle="One serif for tone, one sans for almost everything else, and monospace for structure. The system works because serif usage is restrained."
      onInView={onInView}
    >
      {/* Font Families */}
      <div className="space-y-12 mb-20">
        {families.map((family) => (
          <div
            key={family.name}
            data-visual={`font-family-${family.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className="border-b border-border pb-12 last:border-b-0 last:pb-0"
          >
            <div className="flex items-baseline gap-4 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text3">
                {family.role}
              </span>
              <span className="text-[10px] font-mono text-text3">
                {family.className}
              </span>
            </div>

            <h3
              className={`${family.className} text-4xl md:text-5xl text-text mb-6`}
              style={{ fontWeight: family.weights[0].value }}
            >
              {family.name}
            </h3>

            {/* Sample at different sizes */}
            <div className="space-y-2 mb-6">
              <p className={`${family.className} text-2xl text-text`}>{family.sample}</p>
              <p className={`${family.className} text-lg text-text2`}>{family.sample}</p>
              <p className={`${family.className} text-sm text-text3`}>{family.sample}</p>
            </div>

            {/* Weights */}
            <div className="flex flex-wrap gap-6 mb-4">
              {family.weights.map((w) => (
                <div key={w.value} className="flex items-baseline gap-2">
                  <span
                    className={`${family.className} text-lg text-text`}
                    style={{ fontWeight: w.value }}
                  >
                    Aa
                  </span>
                  <span className="text-[10px] font-mono text-text3">
                    {w.value} {w.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-text3">{family.usage}</p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-heading font-medium text-text mb-6">Role Recipes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {roleRecipes.map((role) => (
          <div key={role.title} className="bg-surface border border-border rounded-md p-6">
            <h4 className="text-lg font-heading font-medium text-text mb-2">
              {role.title}
            </h4>
            <p className="text-xs font-mono text-text3 mb-3">
              {role.recipe}
            </p>
            <p className="text-sm text-text2 leading-relaxed">
              {role.note}
            </p>
          </div>
        ))}
      </div>

      {/* Type Scale */}
      <h3 className="text-xl font-heading font-medium text-text mb-6">Type Scale</h3>
      <p className="text-sm text-text3 mb-8">
        Base font-size is set to 125% (20px). These are the computed sizes at that base.
      </p>
      <div className="space-y-4">
        {typeScale.map((entry) => (
          <div key={entry.class} className="flex items-baseline gap-6">
            <div className="w-44 shrink-0 text-right">
              <span className="text-[10px] font-mono text-text3">{entry.class}</span>
              <span className="text-[10px] font-mono text-text3 ml-2 opacity-50">{entry.size}</span>
            </div>
            <div className="min-w-0">
              <span className={`${entry.class} text-text leading-tight block`}>
                {entry.sample}
              </span>
              <span className="text-[10px] font-mono text-text3 block mt-1">
                {entry.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pairing Demo */}
      <div className="mt-16 bg-surface border border-border rounded-md p-8 md:p-12 max-w-2xl">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text3 block mb-6">
          Pairing in context
        </span>
        <h4 className="font-display text-3xl text-text tracking-wide mb-2">
          Building in the open
        </h4>
        <h5 className="font-heading text-lg font-medium text-text2 tracking-tight mb-4">
          Editorial voice plus quiet UI typography
        </h5>
        <p className="font-heading text-base text-text2 leading-relaxed mb-4" style={{ fontWeight: 400 }}>
          Serif creates the atmosphere. Space Grotesk carries the actual reading load. That split keeps the site expressive without making it fragile.
        </p>
        <code className="font-mono text-sm text-text3">
          rule: use display typography sparingly
        </code>
      </div>

      <div className="mt-12 bg-surface border border-border rounded-md p-8">
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
    </DSSection>
  );
}
