import Link from 'next/link';
import { guidelineSpecs, type GuidelineSlug } from './principal-spec';

export default function GuidelineNav({ activeSlug }: { activeSlug?: GuidelineSlug }) {
  return (
    <nav aria-label="Design-system guidelines">
      <Link
        href="/guidelines"
        className="mb-4 block font-mono text-[10px] uppercase tracking-widest text-text3 transition-colors hover:text-text"
      >
        Principal specification
      </Link>
      <ol className="space-y-1">
        {guidelineSpecs.map((spec) => {
          const active = spec.slug === activeSlug;
          return (
            <li key={spec.slug}>
              <Link
                href={`/guidelines/${spec.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`grid grid-cols-[2rem_1fr] items-center rounded-md px-2 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-surface2 text-text'
                    : 'text-text2 hover:bg-surface hover:text-text'
                }`}
              >
                <span className={`font-mono text-[10px] ${active ? 'text-accent' : 'text-text3'}`}>
                  {spec.index}
                </span>
                <span>{spec.shortTitle}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
