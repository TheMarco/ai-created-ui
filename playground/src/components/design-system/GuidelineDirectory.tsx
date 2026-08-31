import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { guidelineSpecs } from './principal-spec';

const statusCopy = {
  canonical: 'Canonical',
  operational: 'Operational',
  evolving: 'Evolving',
} as const;

export default function GuidelineDirectory() {
  return (
    <div data-visual="guideline-directory">
      <div className="grid border-l border-t border-border md:grid-cols-2 xl:grid-cols-3">
        {guidelineSpecs.map((spec) => (
          <Link
            key={spec.slug}
            href={`/guidelines/${spec.slug}`}
            className="group flex min-h-72 flex-col border-b border-r border-border bg-surface/30 p-6 transition-colors hover:bg-surface md:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs text-accent">{spec.index}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-text3">
                {statusCopy[spec.status]}
              </span>
            </div>
            <div className="mt-10 flex-1">
              <h2 className="font-heading text-xl font-medium text-text md:text-2xl">{spec.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text2">{spec.summary}</p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-text3">
                {spec.sections.length} chapters
              </span>
              <ArrowRight
                className="h-4 w-4 text-text3 transition-transform group-hover:translate-x-1 group-hover:text-accent"
                aria-hidden="true"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
