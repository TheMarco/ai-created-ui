import Link from 'next/link';
import { ArrowLeft, Check, ExternalLink, X } from 'lucide-react';
import DSCodeBlock from './DSCodeBlock';
import ComponentWorkbench from './ComponentWorkbench';
import ComponentSpecNav from './ComponentSpecNav';
import ComponentConstructionSection from './ComponentConstructionSection';
import type { ComponentSpec } from './specs';

function SectionHeading({ id, title, description }: { id: string; title: string; description: string }) {
  return (
    <header className="max-w-3xl scroll-mt-28" id={id}>
      <h2 className="font-heading text-2xl font-medium text-text md:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-text2 md:text-base">{description}</p>
    </header>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-text2">
          <span className="shrink-0 text-accent" aria-hidden="true">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ComponentSpecPage({
  spec,
  groups,
}: {
  spec: ComponentSpec;
  groups: Array<[string, ComponentSpec[]]>;
}) {
  return (
    <div className="container-custom py-10 md:py-16">
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-3 xl:top-24 xl:max-h-[calc(100vh-7rem)]">
            <ComponentSpecNav groups={groups} activeId={spec.id} />
          </div>
        </aside>

        <div className="min-w-0">
          <Link
            href="/components"
            className="inline-flex items-center gap-2 text-sm text-text2 transition-colors hover:text-text lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All components
          </Link>

          <header className="mt-8 border-b border-border pb-12 lg:mt-0">
            <p className="font-mono text-xs uppercase tracking-wider text-accent">{spec.category}</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl tracking-wide text-text md:text-6xl">
              {spec.name}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-text2 md:text-lg">{spec.summary}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {spec.packageExports.map((packageExport) => (
                <code
                  key={packageExport}
                  className="rounded-sm border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-text2"
                >
                  {packageExport}
                </code>
              ))}
            </div>
            <a
              href={`https://github.com/TheMarco/ai-created-ui/blob/main/${spec.sourcePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-text2 transition-colors hover:text-text"
            >
              View source
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </header>

          <div className="space-y-24 py-14 md:space-y-32 md:py-20">
            <section aria-labelledby="specimen-heading" data-visual="component-live-specimen">
              <SectionHeading
                id="specimen-heading"
                title="Component workbench"
                description="Configure the production component, inspect it at responsive widths, copy synchronized JSX, and share the exact state from one workspace."
              />
              <div className="mt-8">
                <ComponentWorkbench spec={spec} />
              </div>
            </section>

            <section aria-labelledby="anatomy-heading">
              <SectionHeading
                id="anatomy-heading"
                title="Anatomy"
                description="Named regions define what belongs to the component, what remains optional, and where semantic responsibility lives."
              />
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {spec.anatomy.map((part, index) => (
                  <article key={part.name} className="rounded-md border border-border bg-surface p-5">
                    <div className="flex items-start gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-action-primary font-mono text-xs text-on-action">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading font-medium text-text">{part.name}</h3>
                          <span className="font-mono text-[10px] text-text3">
                            {part.required ? 'Required' : 'Optional'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-text2">{part.description}</p>
                        {part.semanticElement ? (
                          <code className="mt-3 inline-block rounded-sm bg-surface2 px-2 py-1 font-mono text-[11px] text-text2">
                            {part.semanticElement}
                          </code>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <ComponentConstructionSection spec={spec} />

            <section aria-labelledby="visual-heading">
              <SectionHeading
                id="visual-heading"
                title="Visual specification"
                description="These measurements and semantic tokens define the supported visual contract. Local overrides should preserve the same hierarchy and interaction cues."
              />
              <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                <div className="grid gap-4 sm:grid-cols-2">
                  {spec.visualSpec.measurements.map((measurement) => (
                    <article key={measurement.property} className="rounded-md border border-border bg-surface p-5">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-text3">{measurement.property}</p>
                      <p className="mt-3 font-heading text-2xl text-text">{measurement.value}</p>
                      {measurement.notes ? (
                        <p className="mt-2 text-xs leading-relaxed text-text2">{measurement.notes}</p>
                      ) : null}
                    </article>
                  ))}
                </div>
                <div className="rounded-md border border-border bg-surface p-6">
                  <h3 className="font-heading text-lg font-medium text-text">Rules</h3>
                  <div className="mt-5">
                    <BulletList items={spec.visualSpec.rules} />
                  </div>
                  {spec.visualSpec.responsiveBehavior?.length ? (
                    <>
                      <h3 className="mt-8 font-heading text-lg font-medium text-text">Responsive behavior</h3>
                      <div className="mt-5">
                        <BulletList items={spec.visualSpec.responsiveBehavior} />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 rounded-md border border-border bg-surface p-6">
                <h3 className="font-heading text-lg font-medium text-text">Token dependencies</h3>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {spec.designTokens.map((token) => (
                    <div key={token.token} className="rounded-sm bg-surface2 p-4">
                      <code className="font-mono text-xs text-accent">{token.token}</code>
                      <p className="mt-2 text-xs leading-relaxed text-text2">{token.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section aria-labelledby="states-heading">
              <SectionHeading
                id="states-heading"
                title="States and behavior"
                description="A component is not complete until its passive, interactive, disabled, and exceptional states remain understandable in both themes."
              />
              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                {spec.stateDefinitions.map((state) => (
                  <article key={state.name} className="rounded-md border border-border bg-surface p-5">
                    <h3 className="font-heading text-lg font-medium text-text">{state.name}</h3>
                    <dl className="mt-4 space-y-4 text-sm">
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-text3">Trigger</dt>
                        <dd className="mt-1 leading-relaxed text-text2">{state.trigger}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-text3">Visual response</dt>
                        <dd className="mt-1 leading-relaxed text-text2">{state.visual}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-text3">Behavior</dt>
                        <dd className="mt-1 leading-relaxed text-text2">{state.behavior}</dd>
                      </div>
                      {state.accessibility ? (
                        <div>
                          <dt className="font-mono text-[10px] uppercase tracking-wider text-text3">Accessibility</dt>
                          <dd className="mt-1 leading-relaxed text-text2">{state.accessibility}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="accessibility-heading">
              <SectionHeading
                id="accessibility-heading"
                title="Accessibility contract"
                description="Semantics, accessible naming, keyboard behavior, focus and announcements are implementation requirements, not optional documentation."
              />
              <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div className="rounded-md border border-border bg-surface p-6">
                  <dl className="space-y-6">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-text3">Semantics</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-text2">{spec.accessibilitySpec.semantics}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-text3">Accessible name</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-text2">{spec.accessibilitySpec.accessibleName}</dd>
                    </div>
                  </dl>
                  <div className="mt-6">
                    <BulletList items={spec.accessibilitySpec.requirements} />
                  </div>
                </div>

                <div className="rounded-md border border-border bg-surface p-6">
                  <h3 className="font-heading text-lg font-medium text-text">Keyboard behavior</h3>
                  {spec.keyboard.length ? (
                    <dl className="mt-5 space-y-4">
                      {spec.keyboard.map((interaction) => (
                        <div key={`${interaction.key}-${interaction.action}`} className="grid gap-2 sm:grid-cols-[120px_1fr]">
                          <dt><kbd className="rounded-sm border border-border bg-surface2 px-2 py-1 font-mono text-xs text-text">{interaction.key}</kbd></dt>
                          <dd className="text-sm leading-relaxed text-text2">
                            {interaction.action}
                            {interaction.condition ? <span className="block text-xs text-text3">{interaction.condition}</span> : null}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="mt-4 text-sm leading-relaxed text-text2">No component-specific keyboard behavior. Native document behavior remains unchanged.</p>
                  )}
                  {spec.accessibilitySpec.announcements?.length ? (
                    <div className="mt-8 border-t border-border pt-6">
                      <h3 className="font-heading text-lg font-medium text-text">Announcements</h3>
                      <div className="mt-4"><BulletList items={spec.accessibilitySpec.announcements} /></div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            <section aria-labelledby="implementation-heading">
              <SectionHeading
                id="implementation-heading"
                title="Implementation"
                description="Use the public package API and preserve the controlled-state, native-attribute, and ref contracts described below."
              />
              <div className="mt-8 space-y-6">
                <DSCodeBlock code={spec.implementation.importStatement} language="tsx" />
                <div className="rounded-md border border-border bg-surface p-6">
                  <p className="font-mono text-[11px] text-text3">
                    {spec.implementation.clientComponent ? 'Client Component required' : 'Server Component compatible'}
                  </p>
                  <div className="mt-5"><BulletList items={spec.implementation.notes} /></div>
                </div>
                <DSCodeBlock code={spec.code} language="tsx" />
                {spec.implementation.recipes?.map((recipe) => (
                  <article key={recipe.name} className="space-y-4">
                    <div>
                      <h3 className="font-heading text-lg font-medium text-text">{recipe.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-text2">{recipe.description}</p>
                    </div>
                    <DSCodeBlock code={recipe.code} language="tsx" />
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="api-heading">
              <SectionHeading
                id="api-heading"
                title="Public API"
                description="These props and helpers are compatibility contracts. Changes require migration guidance and release notes."
              />
              <div className="mt-8 overflow-x-auto rounded-md border border-border">
                <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                  <thead className="bg-surface2 font-mono text-[10px] uppercase tracking-wider text-text3">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">Prop</th>
                      <th scope="col" className="px-4 py-3 font-medium">Type</th>
                      <th scope="col" className="px-4 py-3 font-medium">Default</th>
                      <th scope="col" className="px-4 py-3 font-medium">Contract</th>
                    </tr>
                  </thead>
                  <tbody className="bg-surface">
                    {spec.api.map((row) => (
                      <tr key={row.prop} className="border-t border-border align-top">
                        <td className="px-4 py-3 font-mono text-xs text-text">{row.prop}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text2">{row.type}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text3">{row.defaultValue}</td>
                        <td className="px-4 py-3 text-xs leading-relaxed text-text2">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="guidance-heading">
              <SectionHeading
                id="guidance-heading"
                title="Usage guidance"
                description="These rules keep the component recognizable across products without preventing deliberate composition."
              />
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-md border border-success-border bg-success-surface p-6">
                  <h3 className="flex items-center gap-2 font-heading text-lg font-medium text-success">
                    <Check className="h-4 w-4" aria-hidden="true" /> Do
                  </h3>
                  <div className="mt-5"><BulletList items={spec.guidance.dos} /></div>
                </div>
                <div className="rounded-md border border-error-border bg-error-surface p-6">
                  <h3 className="flex items-center gap-2 font-heading text-lg font-medium text-error">
                    <X className="h-4 w-4" aria-hidden="true" /> Do not
                  </h3>
                  <div className="mt-5"><BulletList items={spec.guidance.donts} /></div>
                </div>
              </div>
            </section>

            <section aria-labelledby="testing-heading">
              <SectionHeading
                id="testing-heading"
                title="Testing contract"
                description="The component should be verified as rendered UI, an interaction model, an accessibility surface, and a theme-aware visual artifact."
              />
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {([
                  ['Unit', spec.testing.unit],
                  ['Interaction', spec.testing.interaction],
                  ['Accessibility', spec.testing.accessibility],
                  ['Visual', spec.testing.visual],
                ] as const).map(([label, items]) => (
                  <article key={label} className="rounded-md border border-border bg-surface p-5">
                    <h3 className="font-heading text-lg font-medium text-text">{label}</h3>
                    <div className="mt-4"><BulletList items={items} /></div>
                  </article>
                ))}
              </div>

              {spec.relatedComponents.length ? (
                <div className="mt-12 border-t border-border pt-8">
                  <h3 className="font-heading text-lg font-medium text-text">Related specifications</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {spec.relatedComponents.map((related) => (
                      <Link
                        key={related}
                        href={`/components/${related}`}
                        className="rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text2 transition-colors hover:border-border-strong hover:text-text"
                      >
                        {related}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
