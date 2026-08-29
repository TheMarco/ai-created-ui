import Link from 'next/link';
import type { ComponentSpec } from './specs';

export default function ComponentSpecNav({
  groups,
  activeId,
}: {
  groups: Array<[string, ComponentSpec[]]>;
  activeId: string;
}) {
  return (
    <nav aria-label="Component specifications" className="space-y-7">
      <Link
        href="/components"
        className="block rounded-sm border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:border-border-strong"
      >
        All components
      </Link>
      {groups.map(([category, specs]) => (
        <div key={category}>
          <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-wider text-text3">
            {category}
          </p>
          <div className="space-y-0.5">
            {specs.map((spec) => (
              <Link
                key={spec.id}
                href={`/components/${spec.slug}`}
                aria-current={spec.id === activeId ? 'page' : undefined}
                className={`block rounded-sm px-3 py-1.5 text-sm transition-colors ${
                  spec.id === activeId
                    ? 'bg-surface2 font-medium text-text'
                    : 'text-text2 hover:bg-surface hover:text-text'
                }`}
              >
                {spec.name.replace(/\s*\/.*$/, '')}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
