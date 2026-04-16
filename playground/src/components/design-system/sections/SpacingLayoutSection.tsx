'use client';

import DSSection from '../DSSection';

const spacingScale = [
  { class: 'p-1', rem: '0.25rem', px: '4px', custom: false },
  { class: 'p-2', rem: '0.5rem', px: '8px', custom: false },
  { class: 'p-3', rem: '0.75rem', px: '12px', custom: false },
  { class: 'p-4', rem: '1rem', px: '16px', custom: false },
  { class: 'p-6', rem: '1.5rem', px: '24px', custom: false },
  { class: 'p-8', rem: '2rem', px: '32px', custom: false },
  { class: 'p-10', rem: '2.5rem', px: '40px', custom: false },
  { class: 'p-12', rem: '3rem', px: '48px', custom: false },
  { class: 'p-16', rem: '4rem', px: '64px', custom: false },
  { class: 'p-18', rem: '4.5rem', px: '72px', custom: true },
  { class: 'p-20', rem: '5rem', px: '80px', custom: false },
  { class: 'p-24', rem: '6rem', px: '96px', custom: false },
  { class: 'p-32', rem: '8rem', px: '128px', custom: false },
];

const radii = [
  { class: 'rounded-sm', value: '4px' },
  { class: 'rounded', value: '6px' },
  { class: 'rounded-md', value: '6px' },
  { class: 'rounded-lg', value: '10px' },
  { class: 'rounded-full', value: '9999px' },
];

const layoutRecipes = [
  {
    title: 'Hero Frame',
    recipe: 'pt-32 pb-20 with centered max-w-4xl copy block',
    note: 'Used on browse and context pages. Homepage hero is larger, but follows the same centered copy logic.',
  },
  {
    title: 'Standard Section',
    recipe: 'py-20 with one clear heading and one primary grid or block',
    note: 'The default rhythm across homepage sections and most interior modules.',
  },
  {
    title: 'Feature Card',
    recipe: 'bg-surface border rounded-md p-8 md:p-12',
    note: 'Primary module shell for proof blocks, summaries, and larger content groups.',
  },
  {
    title: 'Grid Rhythm',
    recipe: 'gap-6 for cards and related modules',
    note: 'The system mostly relies on 24px gaps; larger jumps should be intentional and rare.',
  },
  {
    title: 'Overview + Workspace',
    recipe: 'compact summary row or cards above one active workspace panel',
    note: 'Use this on product-heavy surfaces when several tools or outputs share a page. Let users scan first, then work in one focused area.',
  },
  {
    title: 'Dense Toolbar',
    recipe: 'fixed-height controls with one trailing flex item that fills remaining width',
    note: 'Useful for source rows, filters, and compact control strips. Mixed controls should align by height and visual weight.',
  },
];

const accessibilityNotes = [
  'Every route must expose the shared skip-link target: `#main-content`.',
  'Source order should stay logical on mobile and desktop; visual rearrangement cannot break reading or tab order.',
  'Headings, sections, and landmarks are part of layout, not content garnish. The system expects both visual rhythm and structural rhythm.',
  'Toolbars should preserve shared hit areas and consistent control height so mixed buttons, dropdowns, and icon actions still read as one system.',
  'Overview regions and active workspaces should remain clearly grouped so screen-reader and keyboard users can distinguish scanning from editing.',
];

interface SpacingLayoutSectionProps {
  onInView?: (id: string) => void;
}

export default function SpacingLayoutSection({ onInView }: SpacingLayoutSectionProps) {
  return (
    <DSSection
      id="spacing"
      title="Spacing & Layout"
      subtitle="The site relies on a small set of repeatable spacing and layout recipes. Consistency here is what keeps the visual system tight."
      onInView={onInView}
    >
      <h3 className="text-xl font-heading font-medium text-text mb-6">Layout Recipes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {layoutRecipes.map((recipe) => (
          <div key={recipe.title} className="bg-surface border border-border rounded-md p-6">
            <h4 className="text-lg font-heading font-medium text-text mb-2">
              {recipe.title}
            </h4>
            <p className="text-xs font-mono text-text3 mb-3">
              {recipe.recipe}
            </p>
            <p className="text-sm text-text2 leading-relaxed">
              {recipe.note}
            </p>
          </div>
        ))}
      </div>

      {/* Spacing Scale */}
      <h3 className="text-xl font-heading font-medium text-text mb-6">Spacing Scale</h3>
      <div className="space-y-2 mb-16">
        {spacingScale.map((entry) => {
          const numericValue = parseFloat(entry.rem);
          const maxBarWidth = 100;
          const barWidth = Math.min((numericValue / 8) * maxBarWidth, maxBarWidth);
          return (
            <div key={entry.class} className="flex items-center gap-4">
              <div className="w-16 shrink-0 text-right">
                <span className="text-[10px] font-mono text-text3">{entry.class}</span>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div
                  className="h-5 rounded-sm flex items-center"
                  style={{ width: `${barWidth}%`, minWidth: '4px' }}
                >
                  <div className="w-[2px] h-full bg-red rounded-l-sm" />
                  <div className="flex-1 h-full bg-red/10" />
                </div>
                <span className="text-[10px] font-mono text-text3 shrink-0">
                  {entry.rem}
                  <span className="opacity-50 ml-1.5">{entry.px}</span>
                </span>
                {entry.custom && (
                  <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border border-red-border text-red">
                    Custom
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Border Radius */}
      <h3 className="text-xl font-heading font-medium text-text mb-6">Border Radius</h3>
      <div className="flex flex-wrap gap-6 mb-16">
        {radii.map((r) => (
          <div key={r.class} className="flex flex-col items-center gap-3">
            <div
              className={`w-20 h-20 bg-surface border border-border ${r.class}`}
            />
            <div className="text-center">
              <span className="block text-xs font-mono text-text">{r.class}</span>
              <span className="block text-[10px] font-mono text-text3">{r.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Container System */}
      <h3 className="text-xl font-heading font-medium text-text mb-6">Container</h3>
      <div className="border border-border rounded-md p-6 bg-surface">
        <div className="border border-dashed border-border rounded-md p-4 relative">
          <span className="absolute top-2 left-3 text-[9px] font-mono text-text3 uppercase tracking-wider">
            Viewport
          </span>
          <div className="mt-4 border border-red/30 rounded-md p-4 mx-auto max-w-lg relative bg-red/[0.03]">
            <span className="absolute top-2 left-3 text-[9px] font-mono text-red uppercase tracking-wider">
              .container-custom
            </span>
            <div className="mt-4 text-center">
              <span className="text-xs font-mono text-text3 block">max-width: 1400px</span>
              <span className="text-[10px] font-mono text-text3 block mt-1">
                padding: 2vw
                <span className="opacity-50"> / 6vw on mobile</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Strategy */}
      <div className="mt-12">
        <h3 className="text-xl font-heading font-medium text-text mb-2">
          Responsive Strategy
        </h3>
        <p className="text-sm text-text2 leading-relaxed mb-6 max-w-3xl">
          Mobile-first with standard Tailwind breakpoints. Content wrappers control reading width, not the container.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { bp: 'sm', px: '640px', usage: 'Small tablets, 2-col grids' },
            { bp: 'md', px: '768px', usage: 'Tablets, hero text scaling' },
            { bp: 'lg', px: '1024px', usage: 'Desktop sidebar, nav' },
            { bp: 'xl', px: '1280px', usage: 'Wide grids, split layouts' },
          ].map((item) => (
            <div key={item.bp} className="rounded-md border border-border bg-surface2 px-4 py-3">
              <span className="block text-sm font-mono text-text">{item.bp}: {item.px}</span>
              <span className="text-xs text-text3">{item.usage}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-md border border-border bg-surface px-4 py-3">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Articles</span>
            <span className="text-sm font-mono text-text2">max-w-3xl</span>
          </div>
          <div className="rounded-md border border-border bg-surface px-4 py-3">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Hero Copy</span>
            <span className="text-sm font-mono text-text2">max-w-4xl</span>
          </div>
          <div className="rounded-md border border-border bg-surface px-4 py-3">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Grids</span>
            <span className="text-sm font-mono text-text2">max-w-6xl</span>
          </div>
        </div>
      </div>

      {/* Image Patterns */}
      <div className="mt-12">
        <h3 className="text-xl font-heading font-medium text-text mb-2">
          Image Patterns
        </h3>
        <p className="text-sm text-text2 leading-relaxed mb-6 max-w-3xl">
          Consistent image handling across heroes, cards, and media embeds.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-md border border-border bg-surface2 px-4 py-3">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Video Embeds</span>
            <span className="text-sm text-text2">aspect-video or padding-bottom: 56.25% for 16:9</span>
          </div>
          <div className="rounded-md border border-border bg-surface2 px-4 py-3">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Fill Images</span>
            <span className="text-sm text-text2">next/image with fill + sizes prop</span>
          </div>
          <div className="rounded-md border border-border bg-surface2 px-4 py-3">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Object Fit</span>
            <span className="text-sm text-text2">object-cover default, object-contain for full visibility</span>
          </div>
          <div className="rounded-md border border-border bg-surface2 px-4 py-3">
            <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text3 mb-1">Loading</span>
            <span className="text-sm text-text2">Lazy by default, priority for above-fold heroes</span>
          </div>
        </div>
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
