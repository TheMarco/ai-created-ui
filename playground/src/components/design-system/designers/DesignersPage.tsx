import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import DSCtaLink from '../DSCtaLink';
import FigmaPreview from './FigmaPreview';
import { figmaLibrary } from '@/lib/figma-library';
import { release } from '@/lib/release';

const metrics = [
  { value: figmaLibrary.componentAssets, label: 'Component assets' },
  { value: figmaLibrary.variables, label: 'Named variables' },
  { value: figmaLibrary.textStyles, label: 'Text styles' },
  { value: figmaLibrary.templates, label: 'Page templates' },
] as const;

const features = [
  {
    title: 'Change the instance, keep the component.',
    description: 'Choose supported variants, sizes, and states. Edit labels, show or hide optional content, swap icons, and fill content slots. Auto layout keeps the structure intact as your copy changes.',
    href: '/guidelines/construction',
    link: 'Component construction',
  },
  {
    title: 'Set the theme on the frame.',
    description: 'Apply light or dark mode to a parent frame and let semantic variables carry that choice through its components. Choose an accent independently. No separate light and dark component libraries to maintain.',
    href: '/foundations#colors',
    link: 'Color and theme foundations',
  },
  {
    title: 'Design the moments between screens.',
    description: 'Loading, empty, error, permission, validation, and success examples are included where each flow needs them. Hover, keyboard focus, and disabled appearances are documented alongside the controls.',
    href: '/guidelines/patterns#state-model',
    link: 'State and pattern guidance',
  },
  {
    title: 'Hand off decisions engineers can use.',
    description: 'Component anatomy, property mappings, content limits, and responsive guidance connect the Figma kit to the public React components. Link the relevant specification when you hand off a design.',
    href: '/components',
    link: 'Live component specifications',
  },
] as const;

const templates = [
  { title: 'Directory', description: 'Search a collection, scan status, and open a record.' },
  { title: 'Detail', description: 'Show identity, attributes, context, and the next action.' },
  { title: 'Form', description: 'Collect input with validation, saving, and recovery.' },
  { title: 'Settings', description: 'Group preferences and make save feedback clear.' },
  { title: 'Dashboard', description: 'Bring key metrics and recent changes into focus.' },
  { title: 'Onboarding', description: 'Guide setup through progress, decisions, and completion.' },
] as const;

const steps = [
  {
    title: 'Make your copy.',
    description: 'Open the Community resource and choose Open in Figma. Sign in to add an editable copy to your drafts, then begin on the Getting started page.',
  },
  {
    title: 'Choose a starting frame.',
    description: 'Copy the closest desktop or mobile template onto a working page. Start with its ready state, then bring along the other states your flow needs.',
  },
  {
    title: 'Set appearance, then content.',
    description: 'Select the parent frame and set AI-Created UI / Semantic to light or dark. Choose the Accent mode, then edit component properties and content slots. Keep instances connected.',
  },
  {
    title: 'Check the edges of your flow.',
    description: 'Try longer labels, narrower frames, and failure states. Add implementation notes for keyboard behavior, validation, and announcements that a visual mockup cannot demonstrate.',
  },
] as const;

const textLink = 'text-accent underline underline-offset-4 hover:text-text';

/** Uses the approved context archetype and the existing documentation-page composition. */
export default function DesignersPage() {
  return (
    <>
      <section className="border-b border-border" data-visual="designers-hero">
        <div className="container-custom">
          <div className="grid gap-12 py-12 md:py-20 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)] lg:items-end lg:gap-20">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent">For designers / Figma Community</p>
              <h1 className="mt-5 max-w-3xl text-balance font-display text-5xl tracking-wide text-text md:text-6xl">
                The whole system. In Figma.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-text2">
                Make your next mockup with editable components, semantic variables, and complete page templates.
                The same design decisions as the React system, ready to use on the canvas.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <DSCtaLink href={figmaLibrary.communityUrl}>
                  Open in Figma <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </DSCtaLink>
                <Link href="#first-mockup" className={`text-sm ${textLink}`}>Make your first mockup</Link>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-text2">Free Community kit. A Figma account is needed to make your copy.</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-7">
              {metrics.map(({ value, label }) => (
                <div key={label} className="border-t border-border pt-4">
                  <dt className="text-xs text-text2">{label}</dt>
                  <dd className="mt-2 font-display text-4xl text-text md:text-5xl">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div className="container-custom">
        <div className="space-y-24 py-12 md:space-y-32 md:py-16">
          <section aria-label="Preview the Figma kit">
            <FigmaPreview />
          </section>

          <section aria-labelledby="editable-heading">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">Built for the way you work</p>
              <h2 id="editable-heading" className="mt-4 font-display text-3xl tracking-wide text-text md:text-4xl">
                A working library, down to the details.
              </h2>
            </div>
            <div className="mt-10 grid gap-x-14 gap-y-10 md:grid-cols-2">
              {features.map((feature) => (
                <article key={feature.title} className="border-t border-border pt-5">
                  <h3 className="font-heading text-lg font-medium text-text">{feature.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text2">{feature.description}</p>
                  <Link href={feature.href} className={`mt-5 inline-flex items-center gap-2 text-sm ${textLink}`}>
                    {feature.link} <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="templates-heading">
            <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-14">
              <h2 id="templates-heading" className="font-display text-3xl tracking-wide text-text md:text-4xl">Start with a complete flow.</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-text2">
                Six page templates, with {figmaLibrary.screenExamples} examples across desktop, mobile, light, dark,
                and the states each flow needs. Use them as a starting point for your content and decisions.
              </p>
            </div>
            <ol className="mt-10 grid gap-x-14 border-t border-border md:grid-cols-2">
              {templates.map((template, index) => (
                <li key={template.title} className="flex gap-5 border-b border-border py-6">
                  <span className="shrink-0 whitespace-nowrap pt-1 font-mono text-xs text-accent" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-heading text-lg font-medium text-text">{template.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text2">{template.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="first-mockup" aria-labelledby="start-heading" className="scroll-mt-32">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-accent">From duplicate to design</p>
                <h2 id="start-heading" className="mt-4 font-display text-3xl tracking-wide text-text md:text-4xl">Your first mockup.</h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-text2">The file includes its own foundations, authoring instructions, component pages, and QA guidance.</p>
              </div>
              <ol className="border-t border-border">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-5 border-b border-border py-6 first:pt-5">
                    <span aria-hidden="true" className="shrink-0 whitespace-nowrap pt-1 font-mono text-xs text-accent">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-heading text-lg font-medium text-text">{step.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-text2">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="using-the-kit" aria-labelledby="using-heading" className="scroll-mt-32">
            <h2 id="using-heading" className="font-display text-3xl tracking-wide text-text md:text-4xl">A few things to know.</h2>
            <dl className="mt-10 grid gap-x-14 gap-y-8 md:grid-cols-2">
              <div className="border-t border-border pt-5">
                <dt className="font-heading font-medium text-text">Copies and library updates</dt>
                <dd className="mt-3 text-sm leading-relaxed text-text2">
                  A Community copy is yours to edit. It does not receive future updates automatically; return to the Community resource for a newer version.
                  For a shared team workflow, publish your copy as a library and enable it through Assets → Libraries in working files. Your team can then review the updates you publish.
                </dd>
              </div>
              <div className="border-t border-border pt-5">
                <dt className="font-heading font-medium text-text">Fonts and text editing</dt>
                <dd className="mt-3 text-sm leading-relaxed text-text2">
                  The kit uses <a href="https://fonts.google.com/specimen/Space+Grotesk" className={textLink}>Space Grotesk</a>,{' '}
                  <a href="https://fonts.google.com/specimen/Instrument+Serif" className={textLink}>Instrument Serif</a>, and SF Mono.
                  If Figma reports a missing font, make a licensed copy available to Figma or replace it in your duplicate. Check wrapping after any substitution.
                </dd>
              </div>
              <div className="border-t border-border pt-5">
                <dt className="font-heading font-medium text-text">Matching a mockup to code</dt>
                <dd className="mt-3 text-sm leading-relaxed text-text2">
                  Figma measurements match this playground’s 20px root size. The React package leaves the root size to your application, so rem-based dimensions can differ.
                  Figma demonstrates layout and appearance; implemented keyboard behavior and accessibility are documented in the{' '}
                  <Link href="/components" className={textLink}>component specifications</Link>.
                </dd>
              </div>
              <div className="border-t border-border pt-5">
                <dt className="font-heading font-medium text-text">Usage and attribution</dt>
                <dd className="mt-3 text-sm leading-relaxed text-text2">
                  The Community file is shared under{' '}
                  <a href={figmaLibrary.licenseUrl} className={textLink}>{figmaLibrary.license}</a>.
                  Credit AI-Created UI by Marco van Hylckama Vlieg, link the license, and indicate changes.
                  The React package is separately available under the{' '}
                  <a href={release.licenseUrl} className={textLink}>{release.license} license</a>.
                </dd>
              </div>
            </dl>
          </section>

          <section className="flex flex-col items-start justify-between gap-8 border-t border-border pt-10 md:flex-row md:items-center" aria-labelledby="download-heading">
            <div>
              <h2 id="download-heading" className="font-display text-3xl tracking-wide text-text">Make it your starting point.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text2">Open the kit, choose a template, and spend your time on the decisions that make your product yours.</p>
            </div>
            <div className="shrink-0">
              <DSCtaLink href={figmaLibrary.communityUrl}>Open in Figma <ExternalLink aria-hidden="true" className="h-4 w-4" /></DSCtaLink>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
