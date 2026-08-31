import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ComponentSpec } from './specs';

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-xs leading-relaxed text-text2">
          <span className="text-accent" aria-hidden="true">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-wider text-text3">{children}</p>;
}

export default function ComponentConstructionSection({ spec }: { spec: ComponentSpec }) {
  const construction = spec.construction;

  return (
    <section aria-labelledby="construction-heading" data-component-construction={spec.id}>
      <header className="max-w-3xl scroll-mt-28" id="construction-heading">
        <h2 className="font-heading text-2xl font-medium text-text md:text-3xl">Construction and authoring</h2>
        <p className="mt-3 text-sm leading-relaxed text-text2 md:text-base">
          The Figma-equivalent asset model, auto-layout, resizing, properties, slots, content bounds, localization, and governance contract.
        </p>
      </header>

      <div className="mt-8 border border-border">
        <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
          <div className="bg-surface p-5">
            <Label>Asset kind</Label>
            <p className="mt-2 font-heading text-lg capitalize text-text">{construction.asset.kind}</p>
          </div>
          <div className="bg-surface p-5">
            <Label>Design library name</Label>
            <p className="mt-2 break-words font-mono text-xs text-text">{construction.asset.figmaName ?? 'Code-only asset'}</p>
          </div>
          <div className="bg-surface p-5">
            <Label>Maturity</Label>
            <p className="mt-2 font-heading text-lg capitalize text-text">{construction.governance.status}</p>
          </div>
          <div className="bg-surface p-5">
            <Label>Last reviewed</Label>
            <p className="mt-2 font-mono text-xs text-text">{construction.governance.lastReviewed}</p>
          </div>
        </div>
        <div className="border-t border-border bg-surface/40 p-5">
          <Label>Canvas applicability</Label>
          <p className="mt-2 text-sm leading-relaxed text-text2">{construction.asset.canvasApplicability}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <article className="border-t border-border pt-5">
          <h3 className="font-heading text-lg font-medium text-text">Auto layout</h3>
          <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-6 text-sm">
            {[
              ['Direction', construction.autoLayout.direction],
              ['Gap', construction.autoLayout.gap],
              ['Padding', construction.autoLayout.padding],
              ['Alignment', construction.autoLayout.alignment],
              ['Wrap', construction.autoLayout.wrap],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-text3">{label}</dt>
                <dd className="mt-1 leading-relaxed text-text2">{value}</dd>
              </div>
            ))}
          </dl>
          {construction.autoLayout.notes.length ? <div className="mt-6"><List items={construction.autoLayout.notes} /></div> : null}
        </article>

        <article className="border-t border-border pt-5">
          <h3 className="font-heading text-lg font-medium text-text">Resizing</h3>
          <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-6 text-sm">
            {[
              ['Width', construction.resizing.width],
              ['Height', construction.resizing.height],
              ['Minimum width', construction.resizing.minWidth],
              ['Maximum width', construction.resizing.maxWidth],
              ['Minimum height', construction.resizing.minHeight],
              ['Maximum height', construction.resizing.maxHeight],
              ['Overflow', construction.resizing.overflow],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-text3">{label}</dt>
                <dd className="mt-1 leading-relaxed text-text2">{value}</dd>
              </div>
            ))}
          </dl>
          {construction.resizing.notes.length ? <div className="mt-6"><List items={construction.resizing.notes} /></div> : null}
        </article>
      </div>

      <div className="mt-12">
        <h3 className="font-heading text-lg font-medium text-text">Exposed design properties</h3>
        <div className="mt-5 overflow-x-auto border border-border">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead className="bg-surface2 font-mono text-[10px] uppercase tracking-wider text-text3">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Property</th>
                <th scope="col" className="px-4 py-3 font-medium">Type</th>
                <th scope="col" className="px-4 py-3 font-medium">Default</th>
                <th scope="col" className="px-4 py-3 font-medium">Code mapping</th>
                <th scope="col" className="px-4 py-3 font-medium">Options or notes</th>
              </tr>
            </thead>
            <tbody className="bg-surface/35">
              {construction.exposedProperties.map((property) => (
                <tr key={property.name} className="border-t border-border align-top">
                  <td className="px-4 py-4 font-medium text-text">
                    {property.label}
                    {property.required ? <span className="ml-2 font-mono text-[9px] uppercase text-accent">Required</span> : null}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-text2">{property.type}</td>
                  <td className="px-4 py-4 font-mono text-xs text-text2">{property.defaultValue === null ? 'None' : String(property.defaultValue)}</td>
                  <td className="px-4 py-4 font-mono text-xs text-text2">{property.codeMapping}</td>
                  <td className="max-w-sm px-4 py-4 text-xs leading-relaxed text-text2">{property.options?.join(', ') ?? property.notes ?? 'No additional constraint'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 grid gap-8 xl:grid-cols-2">
        <article>
          <h3 className="font-heading text-lg font-medium text-text">Nested assets and slots</h3>
          <div className="mt-5 divide-y divide-border border-y border-border">
            {construction.nestedAssets.map((asset) => (
              <div key={asset.name} className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-medium text-text">{asset.name}</h4>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text3">{asset.kind}{asset.required ? ' / required' : ''}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-text2">{asset.description}</p>
                <code className="mt-2 block break-words font-mono text-[10px] text-accent">{asset.codeMapping}</code>
              </div>
            ))}
          </div>
        </article>

        <article>
          <h3 className="font-heading text-lg font-medium text-text">Content limits</h3>
          <div className="mt-5 divide-y divide-border border-y border-border">
            {construction.contentLimits.map((limit) => (
              <div key={limit.target} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-medium text-text">{limit.target}</h4>
                  <span className="font-mono text-[10px] text-accent">{limit.limit}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-text2"><strong className="font-medium text-text">Overflow:</strong> {limit.overflowBehavior}</p>
                <p className="mt-1 text-xs leading-relaxed text-text3">{limit.rationale}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-3">
        <article className="bg-surface p-6">
          <h3 className="font-heading text-lg font-medium text-text">Localization and RTL</h3>
          {construction.localization.translatable.length ? (
            <p className="mt-4 text-xs leading-relaxed text-text2">
              <strong className="font-medium text-text">Translatable:</strong> {construction.localization.translatable.join(', ')}
            </p>
          ) : null}
          <div className="mt-5"><List items={[...construction.localization.rtlBehavior, ...construction.localization.stressCases]} /></div>
        </article>
        <article className="bg-surface p-6">
          <h3 className="font-heading text-lg font-medium text-text">Responsive behavior</h3>
          <p className="mt-4 text-sm leading-relaxed text-text2">{construction.responsive.strategy}</p>
          <p className="mt-4 font-mono text-[10px] text-accent">{construction.responsive.breakpoints.join(' / ')}</p>
          <div className="mt-5"><List items={construction.responsive.behavior} /></div>
        </article>
        <article className="bg-surface p-6">
          <h3 className="font-heading text-lg font-medium text-text">Authoring limits</h3>
          <div className="mt-5"><List items={[...construction.limitations.figma, ...construction.limitations.code, ...construction.limitations.notApplicable]} /></div>
        </article>
      </div>

      <div className="mt-10 border-l-2 border-accent-border pl-6">
        <Label>Accountable owner</Label>
        <p className="mt-2 font-heading text-lg text-text">{construction.governance.ownerRole}</p>
        <p className="mt-2 font-mono text-[10px] text-text3">Canonical source: {construction.governance.canonicalSource}</p>
        <div className="mt-5"><List items={construction.governance.changePolicy} /></div>
                <Link href="/guidelines/construction" className="mt-6 inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent-hover">
          Read the system construction standard <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
