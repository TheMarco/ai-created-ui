'use client';

import DSSection from '../DSSection';

const archetypes = [
  {
    title: 'Home',
    routes: '/',
    purpose: 'Set the thesis, prove the work, and move people into products, stories, or contact.',
    anatomy: [
      'Immersive hero with one core message',
      'Proof sections before opinion-heavy copy',
      'Featured products and supporting content modules',
      'Direct contact path at the bottom',
    ],
  },
  {
    title: 'Browse',
    routes: '/products, /stories, /lab-notes, /media',
    purpose: 'Help people scan, compare, and choose where to go next.',
    anatomy: [
      'Clear hero with route-specific framing, usually via ThemedHeroImage',
      'Structured filters only when they improve findability',
      'Card grids with consistent metadata hierarchy',
      'Strong empty states and clear onward links',
    ],
  },
  {
    title: 'Detail',
    routes: '/products/[slug], /stories/[slug], /lab-notes/[slug]',
    purpose: 'Let one piece of work or writing carry focus without clutter.',
    anatomy: [
      'Breadcrumb or route context',
      'Tight headline and supporting metadata',
      'Primary proof block: copy, media, or article body',
      'Shared article shell for editorial detail routes, with citation, author context, comments, and return path',
      'Related links that keep the user inside the system',
    ],
  },
  {
    title: 'Context',
    routes: '/about, /resume',
    purpose: 'Establish credibility, experience, and point of view without turning the site into a generic personal brand funnel.',
    anatomy: [
      'Direct framing and authored copy',
      'Structured credibility blocks',
      'Clear tie-back to products and shipped work',
      'Simple CTAs that point back into the main system',
    ],
  },
  {
    title: 'Workspace',
    routes: 'internal tools, dashboards, multi-step product flows',
    purpose: 'Support real work with clear hierarchy: task navigation, utility actions, scan-first summaries, and one focused workspace at a time.',
    anatomy: [
      'Workflow navigation for real task stages only',
      'Utility actions like Help and Settings adjacent to the workflow, not inside it',
      'Compact overview row or summary cards before the active work area',
      'One primary workspace, panel, or editor open at a time',
      'Honest empty and capacity states with direct next actions',
    ],
  },
];

const iaRules = [
  'Public navigation is fixed: Home, Products, 0→1 Stories, Lab Notes, Media, About, Design System.',
  'Legacy routes are redirected, not visually maintained as separate systems.',
  'A new top-level route must justify its place in navigation and match an existing page archetype or create a documented new one.',
  'Route-level heroes and article pages should start from shared primitives like ThemedHeroImage and ArticleLayout before adding route-specific variation.',
  'Workflow tabs should only represent real stages of work. Support utilities such as Help or Settings stay adjacent and visually secondary.',
  'When a page combines multiple tools, use overview-plus-workspace hierarchy before resorting to a long stack of unrelated sections.',
];

const accessibilityByArchetype = [
  'Home: one clear H1, obvious primary CTA, and a skip path to proof before long scrolling.',
  'Browse: filters must be labeled, keyboard reachable, and paired with live result feedback or clear empty states.',
  'Detail: breadcrumb or route context, readable hero copy, and media with meaningful fallback text or explicit decoration.',
  'Context: credibility content should remain structured, not collapse into decorative cards with vague headings.',
  'Workspace: task navigation and utility actions must stay semantically distinct, and unavailable actions should be disabled instead of routing users into empty UI.',
];

interface PageArchetypesSectionProps {
  onInView?: (id: string) => void;
}

export default function PageArchetypesSection({ onInView }: PageArchetypesSectionProps) {
  return (
    <DSSection
      id="archetypes"
      title="Page Archetypes"
      subtitle="Every live route should fit a known template. New pages inherit an archetype before they get bespoke styling."
      onInView={onInView}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {archetypes.map((archetype) => (
          <div key={archetype.title} className="bg-surface border border-border rounded-md p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-xl font-heading font-medium text-text">
                {archetype.title}
              </h3>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text3">
                {archetype.routes}
              </span>
            </div>
            <p className="text-sm text-text2 leading-relaxed mb-5">
              {archetype.purpose}
            </p>
            <ul className="space-y-2">
              {archetype.anatomy.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text2">
                  <span className="text-text3 mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-md p-8">
        <h3 className="text-xl font-heading font-medium text-text mb-4">
          IA Rules
        </h3>
        <ul className="space-y-2">
          {iaRules.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-accent mt-0.5">-</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 bg-surface border border-border rounded-md p-8">
        <h3 className="text-xl font-heading font-medium text-text mb-4">
          Accessibility By Archetype
        </h3>
        <ul className="space-y-2">
          {accessibilityByArchetype.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-accent mt-0.5">-</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </DSSection>
  );
}
