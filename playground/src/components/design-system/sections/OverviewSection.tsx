'use client';

import { motion } from 'framer-motion';
import DSSection from '../DSSection';
import { borderHoverMotion, motionDuration, staggerDelay } from '@ai-created/ui';

const principles = [
  {
    word: 'Product-First',
    description:
      'The site exists to support shipped work. Brand expression matters, but proof, hierarchy, and navigation win over spectacle.',
  },
  {
    word: 'Editorial Restraint',
    description:
      'Large serif moments create tone. Most UI stays quiet, geometric, and highly legible so the work can carry the personality.',
  },
  {
    word: 'Dark-Native',
    description:
      'Dark mode defines the atmosphere. Light mode is warm, calm, and equally intentional rather than a quick inversion.',
  },
  {
    word: 'System Before Novelty',
    description:
      'New visual ideas must earn their place. Shared rules beat one-off styling, and route drift is treated as design debt.',
  },
  {
    word: 'Accessible by Default',
    description:
      'Keyboard access, visible focus, readable contrast, clear labels, and reduced-motion support are core system requirements, not finishing work.',
  },
  {
    word: 'Hierarchy Over Noise',
    description:
      'Promote the primary metric, action, or object. Remove duplicate labels, dead helper chrome, and warning styling that adds drama without clarity.',
  },
  {
    word: 'Task vs Utility',
    description:
      'Workflow steps belong in the main navigation. Help, settings, and other support utilities should stay adjacent, not masquerade as peer tasks.',
  },
];

const changeRules = [
  'If a change adds a new route pattern, update the page archetypes before shipping it.',
  'If a change adds a new component style, update both /design-system and DESIGN-SYSTEM.md in the same pass.',
  'If a new UI need appears, try existing primitives first. Promote it into a shared component only when the pattern repeats or clearly belongs across routes.',
  'If a change affects interaction, verify keyboard use, focus states, contrast, and reduced-motion behavior before shipping.',
  'Do not introduce a second visual language for one part of the site unless it is explicitly documented as a sub-system.',
  'When production surfaces teach us a better product pattern, update the canonical design contract and the live /design-system examples together.',
];

interface OverviewSectionProps {
  onInView?: (id: string) => void;
}

export default function OverviewSection({ onInView }: OverviewSectionProps) {
  return (
    <DSSection
      id="overview"
      title="Principles"
      subtitle="These are the non-negotiable rules behind the live site. Everything else should follow from them."
      onInView={onInView}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {principles.map((p, i) => (
          <motion.div
            key={p.word}
            className="relative bg-surface border border-border rounded-md p-8 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: motionDuration.base + 0.1, delay: staggerDelay(i) }}
            {...borderHoverMotion()}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-red rounded-t-md" />
            <h3 className="text-xl font-heading font-semibold text-text mb-3 mt-2">
              {p.word}
            </h3>
            <p className="text-text2 text-sm leading-relaxed">{p.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-md p-8">
        <h3 className="text-xl font-heading font-medium text-text mb-4">
          Change Discipline
        </h3>
        <ul className="space-y-2">
          {changeRules.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-sm text-text2 leading-relaxed">
              <span className="text-red mt-0.5">-</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </DSSection>
  );
}
