'use client';

import DSSection from '../DSSection';
import DSComponentReference from '../DSComponentReference';
import { componentDocs } from '../componentDocs';

interface ComponentReferenceSectionProps {
  onInView?: (id: string) => void;
}

export default function ComponentReferenceSection({ onInView }: ComponentReferenceSectionProps) {
  const categories = Array.from(new Set(componentDocs.map((entry) => entry.category)));

  return (
    <DSSection
      id="reference"
      title="Component Reference"
      subtitle="Public contracts for every component family, including intent, defaults, states, accessibility, composition, and realistic usage."
      onInView={onInView}
    >
      <nav aria-label="Component reference index" className="mb-12 rounded-lg border border-border bg-surface p-5 md:p-6">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-text3">
          Jump to a component
        </p>
        <div className="flex flex-wrap gap-2">
          {componentDocs.map((entry) => (
            <a
              key={entry.id}
              href={`#component-${entry.id}`}
              className="rounded-md border border-border bg-surface2 px-3 py-2 text-xs text-text2 transition-colors hover:border-border-strong hover:text-text"
            >
              {entry.name}
            </a>
          ))}
        </div>
      </nav>

      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category} aria-labelledby={`reference-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
            <h3
              id={`reference-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="mb-6 font-display text-2xl tracking-wide text-text"
            >
              {category}
            </h3>
            <div className="space-y-6">
              {componentDocs
                .filter((entry) => entry.category === category)
                .map((entry) => <DSComponentReference key={entry.id} entry={entry} />)}
            </div>
          </section>
        ))}
      </div>
    </DSSection>
  );
}
