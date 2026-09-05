import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { ThemedHeroImage } from '@ai-created/ui';
import DSCtaLink from './DSCtaLink';
import { release } from '@/lib/release';
import { productionConsumers, systemFacts } from '@/lib/system-facts';

const destinations = [
  {
    href: '/designers',
    title: 'Designers',
    description: 'Editable Figma components, themes, and templates for your next mockup.',
  },
  {
    href: '/foundations',
    title: 'Foundations',
    description: 'Tokens, color, typography, spacing, motion, and theme behavior.',
  },
  {
    href: '/components',
    title: 'Components',
    description: 'Live behavior, controls, implementation, and API contracts.',
  },
  {
    href: '/guidelines',
    title: 'Guidelines',
    description: 'Product patterns, content rules, accessibility, and governance.',
  },
  {
    href: '/agents',
    title: 'Agents',
    description: 'How coding agents query the contract and get validated against it.',
  },
] as const;

const consumers = [
  {
    role: 'Designer',
    reads: 'Editable Figma components, semantic variables, themes, and page templates.',
    contract: 'Figma design kit',
    href: '/designers',
  },
  {
    role: 'Engineer',
    reads: 'React components, TypeScript APIs, tokens, and test contracts.',
    contract: 'Runtime contract',
    href: '/components',
  },
  {
    role: 'Agent',
    reads: 'The manifest, approved templates, policies, and machine context.',
    contract: 'Machine contract',
    href: '/agents',
  },
] as const;

const architecture = [
  {
    layer: 'Semantic tokens',
    detail: `${systemFacts.cssVariables} CSS custom properties in styles/tokens.css, mapped into utilities by the shared Tailwind preset.`,
    source: 'styles/tokens.css',
  },
  {
    layer: 'Components',
    detail: `${systemFacts.componentFamilies} documented families exposing ${systemFacts.publicExports} verified public exports.`,
    source: 'src/index.ts',
  },
  {
    layer: 'Patterns and templates',
    detail: `${systemFacts.guidelineChapters} principal guideline chapters and ${systemFacts.pageTemplates} approved page templates with declared states.`,
    source: 'templates/agent',
  },
  {
    layer: 'Documentation and machine context',
    detail: 'This portal, the generated manifest, and the concise and full agent context files.',
    source: 'design-system.manifest.json',
  },
  {
    layer: 'Policy and validation',
    detail: `${systemFacts.policyRules} design-policy rules and ${systemFacts.blockingValidationCommands} blocking validation commands.`,
    source: 'ai-created-ui.config.json',
  },
  {
    layer: 'Product consumers',
    detail: `${systemFacts.productionConsumers} production applications installing immutable release tags.`,
    source: 'consumers.json',
  },
] as const;

const healthMetrics = [
  { label: 'Stable release', value: `v${release.version}` },
  { label: 'Component families', value: String(systemFacts.componentFamilies) },
  { label: 'Public exports', value: String(systemFacts.publicExports) },
  { label: 'Blocking checks', value: String(systemFacts.blockingValidationCommands) },
] as const;

const qualityContract = [
  { name: 'Accessibility', detail: 'Component and axe-based tests plus browser keyboard, focus, and contrast coverage.' },
  { name: 'Token parity', detail: 'The generated token artifact and Tailwind preset must match canonical CSS.' },
  { name: 'Component API parity', detail: 'Documented props, controls, and geometry must match the public TypeScript.' },
  { name: 'Design policy', detail: 'Raw colors, reference tokens, internal imports, and local primitive copies fail the build.' },
  { name: 'Documentation contract', detail: 'Public counts, portal routes, and workflow guidance are verified against their sources.' },
  { name: 'Agent context', detail: 'The manifest, llms.txt, and llms-full.txt are rejected when stale.' },
  { name: 'Release and package', detail: 'The distributable package boundary is verified before a tag is cut.' },
] as const;

const startingPoints = [
  { intent: 'Design with the system', action: 'Figma kit and design workflow', href: '/designers' },
  { intent: 'Build with components', action: 'Component specifications', href: '/components' },
  { intent: 'Build with an agent', action: 'Agent architecture', href: '/agents' },
  { intent: 'Inspect or contribute', action: 'GitHub repository', href: release.repositoryUrl, external: true },
] as const;

export default function OverviewShell() {
  return (
    <>
      <section
        data-visual="portal-hero"
        className="relative overflow-hidden border-b border-border pt-32 xl:pt-24"
      >
        <ThemedHeroImage
          darkSrc="/images/hero/designsystem-hero.png"
          lightSrc="/images/hero/designsystem-hero-light.png"
          overlay="strong"
          priority
          fadeBottom
        />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 gap-14 py-12 md:py-20 lg:grid-cols-5 lg:items-end lg:gap-20">
            <div className="max-w-4xl lg:col-span-3">
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                {release.packageName} · Open-source design system
              </p>
              <h1 className="max-w-4xl font-display text-5xl tracking-wide hero-text md:text-7xl">
                Design once. Build without drift.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed hero-text-muted sm:text-lg">
                Designers, engineers, and coding agents build against one versioned interface contract. The same
                tokens, components, accessibility rules, and page patterns,
                validated through blocking checks in every consumer.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <DSCtaLink href="/components">
                  Browse components
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </DSCtaLink>
                <DSCtaLink href="/agents" variant="secondary">
                  Explore agent architecture
                </DSCtaLink>
              </div>

              <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs hero-text-muted">
                <span>v{release.version}</span>
                <span aria-hidden="true">·</span>
                <span>Stable release</span>
                <span aria-hidden="true">·</span>
                <a
                  href={release.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-accent"
                >
                  GitHub
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href={release.releasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-accent"
                >
                  Releases
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href={release.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-accent"
                >
                  {release.license}
                </a>
              </p>
            </div>

            <nav
              aria-label="Design system destinations"
              className="border-l border-border pl-5 sm:pl-8 lg:col-span-2"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-text3">Explore the system</p>
              <div className="mt-4 border-b border-border">
                {destinations.map(({ href, title, description }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-t border-border py-5 transition-colors hover:text-accent"
                  >
                    <span>
                      <span className="block text-sm font-medium text-text transition-colors group-hover:text-accent">
                        {title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-text2">{description}</span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 text-text3 transition-transform group-hover:translate-x-1 group-hover:text-accent"
                    />
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </section>

      {/* container-custom sets the padding shorthand, so vertical rhythm lives on the outer section. */}
      <section className="pb-32 pt-12" data-visual="portal-content">
        <div className="container-custom space-y-28 md:space-y-36">
        <section id="overview" aria-labelledby="consumers-heading" className="scroll-mt-28">
          <h2 id="consumers-heading" className="font-display text-3xl tracking-wide text-text md:text-4xl">
            One system. Three consumers.
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text2">
            Each audience reads a different projection of the same reviewed decisions, never an independent
            interpretation of them.
          </p>

          <div className="mt-10 border-l border-t border-border">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {consumers.map((consumer) => (
                <Link
                  key={consumer.role}
                  href={consumer.href}
                  className="group flex flex-col border-b border-r border-border bg-surface/35 p-6 transition-colors hover:bg-surface md:p-8"
                >
                  <h3 className="font-heading text-xl font-medium text-text group-hover:text-accent">
                    {consumer.role}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text2">{consumer.reads}</p>
                  <p className="mt-8 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-widest text-accent">
                    {consumer.contract}
                  </p>
                </Link>
              ))}
            </div>
            <div className="border-b border-r border-border bg-surface/35 p-6 text-center md:p-8">
              <h3 className="font-heading text-xl font-medium text-text md:text-2xl">One interface contract</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-text2">
                Published as one versioned contract, with blocking validation across every consumer.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="architecture-heading">
          <h2 id="architecture-heading" className="font-display text-3xl tracking-wide text-text md:text-4xl">
            System architecture
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text2">
            Each layer has one canonical source. Documentation and machine context are generated from those sources
            and rejected when they fall out of date.
          </p>

          <ol className="mt-10 border-t border-border">
            {architecture.map((layer, index) => (
              <li
                key={layer.layer}
                className="grid grid-cols-1 gap-4 border-b border-border py-6 md:grid-cols-[64px_minmax(0,1.1fr)_minmax(0,0.7fr)] md:gap-6"
              >
                <span className="font-mono text-xs text-accent" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-heading font-medium text-text">{layer.layer}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text2">{layer.detail}</p>
                </div>
                <code className="self-center font-mono text-xs text-text3">{layer.source}</code>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="health-heading">
          <h2 id="health-heading" className="font-display text-3xl tracking-wide text-text md:text-4xl">
            Running infrastructure
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text2">
            Every number below is read from a canonical repository source at build time rather than maintained by
            hand.
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
            {healthMetrics.map(({ label, value }) => (
              <div key={label} className="bg-surface p-6">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-text3">{label}</dt>
                <dd className="mt-2 font-display text-3xl text-text">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="production-heading">
          <h2 id="production-heading" className="font-display text-3xl tracking-wide text-text md:text-4xl">
            In production
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text2">
            These applications install immutable release tags and run their own compatibility checks before adopting
            an update. The registry below is the same file the currency tooling reads.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            {productionConsumers.map((consumer) => (
              <article key={consumer.id} className="bg-surface p-6 md:p-8">
                <h3 className="font-heading text-lg font-medium text-text">{consumer.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text2">
                  Compares its installed tag against the latest reviewed GitHub Release and blocks adoption until its
                  own checks pass.
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {consumer.compatibilityChecks.map((check) => (
                    <li key={check} className="font-mono text-[11px] text-text3">
                      {check}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-sm">
                  {consumer.siteUrl ? (
                    <a
                      href={consumer.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-accent underline underline-offset-4 hover:text-text"
                    >
                      Visit site
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : null}
                  <a
                    href={consumer.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent underline underline-offset-4 hover:text-text"
                  >
                    Repository
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="quality-heading">
          <h2 id="quality-heading" className="font-display text-3xl tracking-wide text-text md:text-4xl">
            The quality contract
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text2">
            A change is publishable only when every gate passes. Nothing here is advisory.
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
            {qualityContract.map(({ name, detail }) => (
              <div key={name} className="border-t border-border pt-4">
                <dt className="font-heading font-medium text-text">{name}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-text2">{detail}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-text2">
            Read how agent output enters the same system in the{' '}
            <Link href="/agents#enforcement" className="text-accent underline underline-offset-4 hover:text-text">
              agent enforcement chain
            </Link>{' '}
            and how changes are reviewed and released in the{' '}
            <Link href="/guidelines/governance" className="text-accent underline underline-offset-4 hover:text-text">
              governance guideline
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="start-heading">
          <h2 id="start-heading" className="font-display text-3xl tracking-wide text-text md:text-4xl">
            Start where you are
          </h2>

          <div className="mt-10 divide-y divide-border border-y border-border">
            {startingPoints.map((point) => {
              const content = (
                <>
                  <span className="text-base text-text">{point.intent}</span>
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                    {point.action}
                    {'external' in point && point.external ? (
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </span>
                </>
              );
              const className =
                'grid grid-cols-1 items-center gap-2 py-5 transition-colors hover:bg-surface/60 sm:grid-cols-[1fr_auto] sm:px-4';

              return 'external' in point && point.external ? (
                <a key={point.intent} href={point.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {content}
                </a>
              ) : (
                <Link key={point.intent} href={point.href} className={className}>
                  {content}
                </Link>
              );
            })}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-text2">
            The package is distributed through immutable GitHub tags, not the npm registry. Consumer setup, the
            install command, and the update lifecycle are documented in the{' '}
            <a
              href={`${release.repositoryUrl}#setup-new-consumer-app`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 hover:text-text"
            >
              repository README
            </a>
            .
          </p>
          </section>
        </div>
      </section>
    </>
  );
}
