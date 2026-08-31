import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Download, ExternalLink } from 'lucide-react';
import DSCodeBlock from './DSCodeBlock';
import GuidelineNav from './GuidelineNav';
import { guidelineSpecs, type GuidelineBlock, type GuidelineSpec } from './principal-spec';

function RuleList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-text2">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function BlockHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5 max-w-3xl">
      <h3 className="font-heading text-lg font-medium text-text md:text-xl">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-relaxed text-text2">{description}</p> : null}
    </div>
  );
}

function GuidelineBlockView({ block }: { block: GuidelineBlock }) {
  if (block.type === 'table') {
    return (
      <div>
        <BlockHeader title={block.title} description={block.description} />
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-surface2 font-mono text-[10px] uppercase tracking-wider text-text3">
              <tr>
                {block.columns.map((column) => (
                  <th key={column} scope="col" className="border-r border-border px-4 py-3 font-medium last:border-r-0">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-surface/35">
              {block.rows.map((row, rowIndex) => (
                <tr key={`${row[0]}-${rowIndex}`} className="border-t border-border align-top">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${cell}-${cellIndex}`}
                      className={`border-r border-border px-4 py-4 leading-relaxed last:border-r-0 ${
                        cellIndex === 0 ? 'font-medium text-text' : 'text-text2'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (block.type === 'rules') {
    return (
      <div>
        <BlockHeader title={block.title} description={block.description} />
        <div className="grid border-l border-t border-border md:grid-cols-2">
          {block.items.map((item, index) => (
            <article key={item.title} className="border-b border-r border-border bg-surface/35 p-5 md:p-6">
              <div className="flex items-start gap-4">
                <span className="font-mono text-[10px] text-accent">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4 className="font-heading font-medium text-text">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-text2">{item.description}</p>
                  {item.requirements?.length ? (
                    <ul className="mt-4 space-y-2 border-t border-border pt-4">
                      {item.requirements.map((requirement) => (
                        <li key={requirement} className="text-xs leading-relaxed text-text3">{requirement}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === 'checklist') {
    return (
      <div>
        <BlockHeader title={block.title} description={block.description} />
        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 xl:grid-cols-3">
          {block.groups.map((group) => (
            <article key={group.title} className="bg-surface p-6">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent">{group.title}</h4>
              <div className="mt-5"><RuleList items={group.items} /></div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === 'process') {
    return (
      <div>
        <BlockHeader title={block.title} description={block.description} />
        <ol className="border-t border-border">
          {block.steps.map((step, index) => (
            <li key={step.title} className="grid gap-4 border-b border-border py-6 md:grid-cols-[52px_1fr_0.8fr] md:gap-6">
              <span className="font-display text-3xl text-accent">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h4 className="font-heading text-lg font-medium text-text">{step.title}</h4>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-text3">Owner: {step.owner}</p>
                <p className="mt-3 text-sm leading-relaxed text-text2">{step.output}</p>
              </div>
              <div className="border-l-2 border-accent-border pl-4 text-sm leading-relaxed text-text2">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-text3">Exit gate</span>
                {step.gate}
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (block.type === 'code') {
    return (
      <div>
        <BlockHeader title={block.title} description={block.description} />
        <DSCodeBlock code={block.code} language={block.language} />
      </div>
    );
  }

  if (block.type === 'tokens') {
    return (
      <div>
        <BlockHeader title={block.title} description={block.description} />
        <div className="grid border-l border-t border-border sm:grid-cols-2 xl:grid-cols-3">
          {block.items.map((item) => (
            <article key={item.name} className="border-b border-r border-border bg-surface/35 p-5">
              <div
                className="h-14 border border-border"
                style={{ background: item.cssVariable ? `var(${item.cssVariable})` : item.value }}
                aria-hidden="true"
              />
              <div className="mt-4 flex items-start justify-between gap-3">
                <h4 className="font-heading font-medium text-text">{item.name}</h4>
                {item.cssVariable ? <code className="font-mono text-[9px] text-text3">{item.cssVariable}</code> : null}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-text2">{item.purpose}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <BlockHeader title={block.title} description={block.description} />
      <div className="divide-y divide-border border-y border-border">
        {block.items.map((item) => (
          <a
            key={item.title}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            download={!item.external && /\.(?:json|txt)$/.test(item.href) ? true : undefined}
            className="group grid gap-4 py-5 transition-colors hover:bg-surface/60 sm:grid-cols-[1fr_auto] sm:px-4"
          >
            <div>
              <h4 className="font-heading font-medium text-text">{item.title}</h4>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-text2">{item.description}</p>
            </div>
            <span className="flex items-center gap-2 self-center whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-accent">
              {item.action}
              {item.external ? <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> : <Download className="h-3.5 w-3.5" aria-hidden="true" />}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

const statusCopy = {
  canonical: 'Canonical',
  operational: 'Operational',
  evolving: 'Evolving',
} as const;

export default function GuidelinePage({ spec }: { spec: GuidelineSpec }) {
  const currentIndex = guidelineSpecs.findIndex((entry) => entry.slug === spec.slug);
  const previous = guidelineSpecs[currentIndex - 1];
  const next = guidelineSpecs[currentIndex + 1];

  return (
    <div className="container-custom py-10 md:py-16">
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-3">
            <GuidelineNav activeSlug={spec.slug} />
          </div>
        </aside>

        <main className="min-w-0" data-guideline={spec.slug}>
          <Link href="/guidelines" className="inline-flex items-center gap-2 text-sm text-text2 transition-colors hover:text-text lg:hidden">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All guidelines
          </Link>

          <header className="mt-8 border-b border-border pb-12 lg:mt-0">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
              <span className="text-accent">Guideline {spec.index}</span>
              <span className="text-text3">{statusCopy[spec.status]}</span>
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-5xl tracking-wide text-text md:text-7xl">{spec.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-text2 md:text-lg">{spec.summary}</p>

            <dl className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Owner', spec.owner],
                ['Last reviewed', spec.lastReviewed],
                ['Review cadence', spec.reviewCycle],
                ['Source of truth', spec.sourceOfTruth],
              ].map(([label, value]) => (
                <div key={label} className="bg-surface p-4">
                  <dt className="font-mono text-[9px] uppercase tracking-wider text-text3">{label}</dt>
                  <dd className="mt-2 text-xs leading-relaxed text-text2">{value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <section aria-labelledby="outcomes-heading" className="border-b border-border py-10">
            <h2 id="outcomes-heading" className="font-mono text-[10px] uppercase tracking-widest text-text3">Required outcomes</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {spec.outcomes.map((outcome, index) => (
                <div key={outcome} className="flex gap-3 text-sm leading-relaxed text-text2">
                  <span className="font-mono text-[10px] text-accent">0{index + 1}</span>
                  <p>{outcome}</p>
                </div>
              ))}
            </div>
          </section>

          <nav aria-label="On this page" className="border-b border-border py-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-text3">On this page</p>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {spec.sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="group flex items-center gap-3 py-1 text-sm text-text2 hover:text-text">
                    <span className="font-mono text-[10px] text-text3 group-hover:text-accent">{String(index + 1).padStart(2, '0')}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-28 py-16 md:space-y-36 md:py-24">
            {spec.sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-28" aria-labelledby={`${section.id}-heading`}>
                <div className="grid gap-4 border-t border-border pt-5 md:grid-cols-[80px_1fr]">
                  <span className="font-display text-3xl text-accent">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h2 id={`${section.id}-heading`} className="font-heading text-2xl font-medium text-text md:text-3xl">{section.title}</h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text2 md:text-base">{section.summary}</p>
                  </div>
                </div>
                <div className="mt-10 space-y-14">
                  {section.blocks.map((block) => <GuidelineBlockView key={`${section.id}-${block.title}`} block={block} />)}
                </div>
              </section>
            ))}
          </div>

          <nav aria-label="Adjacent guidelines" className="grid border-t border-border sm:grid-cols-2">
            {previous ? (
              <Link href={`/guidelines/${previous.slug}`} className="group border-b border-border py-8 sm:border-b-0 sm:border-r sm:pr-8">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text3">Previous</span>
                <span className="mt-3 flex items-center gap-3 font-heading text-lg text-text group-hover:text-accent">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {previous.title}
                </span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/guidelines/${next.slug}`} className="group py-8 sm:pl-8 sm:text-right">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text3">Next</span>
                <span className="mt-3 flex items-center justify-end gap-3 font-heading text-lg text-text group-hover:text-accent">
                  {next.title} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ) : null}
          </nav>
        </main>
      </div>
    </div>
  );
}
