import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ExternalLink, X } from 'lucide-react';
import DSCtaLink from '../DSCtaLink';
import DSCodeBlock from '../DSCodeBlock';
import { release } from '@/lib/release';
import { systemFacts } from '@/lib/system-facts';

const AGENT_CONTRACT_HREF = '/guidelines/assets#agent-contract';

const heroStats = [
  { label: 'Versioned contract', value: `v${release.version}` },
  { label: 'Policy validation', value: `${systemFacts.policyRules} rules` },
  { label: 'Approved templates', value: `${systemFacts.pageTemplates} page templates` },
  { label: 'Drift detection', value: `${systemFacts.agentChecks} blocking checks` },
] as const;

const consumers = [
  {
    role: 'Designer',
    intro: 'Works from reviewed intent rather than redrawing decided problems.',
    consumes: [
      'semantic design decisions',
      'component anatomy',
      'variants',
      'composition rules',
      'responsive behavior',
      'accessibility guidance',
    ],
    contract: 'Design contract',
  },
  {
    role: 'Engineer',
    intro: 'Works from the shipped implementation rather than a redrawn approximation.',
    consumes: [
      'React components',
      'TypeScript APIs',
      'semantic tokens',
      'interaction behavior',
      'accessibility implementation',
      'test contracts',
    ],
    contract: 'Runtime contract',
  },
  {
    role: 'Agent',
    intro: 'Works from queryable contracts rather than screenshots or model memory.',
    consumes: [
      'design-system manifest',
      'approved component APIs',
      'semantic tokens',
      'page templates',
      'design policies',
      'machine-readable context',
    ],
    contract: 'Machine contract',
  },
] as const;

const workflowSteps = [
  {
    id: 'receive',
    title: 'Receive the task',
    body: 'Product intent arrives in prose. Nothing about the design system is decided yet.',
    quote:
      'Build the account settings screen with profile information, notification preferences, and destructive account actions.',
  },
  {
    id: 'query',
    title: 'Query the system',
    body: 'The agent reads canonical context instead of inferring APIs. Every source below ships inside the package and the published release.',
    items: [
      'design-system.manifest.json',
      'llms.txt',
      'llms-full.txt',
      'AGENTS.md',
      'templates/agent/manifest.json',
    ],
    code: {
      language: 'bash',
      label: 'Canonical context queries',
      code: `npm run agent:query -- context\nnpm run agent:query -- templates\nnpm run agent:query -- component toggle\nnpm run agent:query -- guideline accessibility`,
    },
  },
  {
    id: 'select',
    title: 'Select approved building blocks',
    body: 'The settings brief matches one reviewed archetype. The template names its slots, its required states, and the primitives it composes.',
    items: [
      'archetype: workspace, subtype settings',
      'components: Button, Notice, Surface, Toggle',
      'states: ready, saving, saved, error, forbidden',
      'semantic tokens through the shared Tailwind preset',
    ],
    code: {
      language: 'bash',
      label: 'Approved template lookup',
      code: `npm run agent:query -- template settings`,
    },
  },
  {
    id: 'implement',
    title: 'Implement',
    body: 'Composition happens against public exports and documented props. Local reinvention of a shared primitive is not an implementation detail; it is drift.',
    allowed: [
      'public components from @ai-created/ui',
      'documented props and variants',
      'semantic tokens and utilities',
      'approved composition patterns',
    ],
    rejected: [
      'locally recreated design-system components',
      'raw color values',
      'undocumented variants',
      'arbitrary radius, shadow, and palette utilities',
      'guessed component APIs',
    ],
  },
  {
    id: 'validate',
    title: 'Validate',
    body: 'The same commands run for an agent, a contributor, and continuous integration. None of them are advisory.',
    code: {
      language: 'bash',
      label: 'Blocking validation commands',
      code: `npm run agent:check\nnpm run typecheck\nnpm run validate`,
    },
  },
  {
    id: 'resolve',
    title: 'Pass or fail loudly',
    body: 'There is no third outcome where a departure quietly ships. A justified departure is written down, scoped, owned, and given an expiry date.',
    outcomes: [
      { state: 'pass', title: 'Contract satisfied', detail: 'Every blocking check exits zero and the work is publishable.' },
      { state: 'fail', title: 'Design policy violation', detail: 'The validator prints the rule, file, line, and required correction.' },
    ],
  },
] as const;

const invalidExample = `import Button from './ui/Button';

export function AccountActions() {
  return (
    <div className="rounded-xl bg-slate-800 p-[13px]">
      <button
        style={{ background: '#6633ff', borderRadius: 11 }}
        className="text-white"
      >
        Save changes
      </button>
      <Button tone="danger">Delete account</Button>
    </div>
  );
}`;

const invalidDiagnostics = [
  {
    rule: 'no-local-primitive',
    location: '1:1',
    message: 'Import Button from @ai-created/ui; local primitive imports can drift from the canonical implementation.',
  },
  {
    rule: 'no-arbitrary-style-value',
    location: '5:21',
    message: 'Replace unapproved radius utility "rounded-xl" with rounded-none, rounded-sm, rounded-md, rounded-lg, or rounded-full.',
  },
  {
    rule: 'no-theme-palette',
    location: '5:32',
    message: 'Replace stock palette utility "bg-slate-800" with a semantic utility that resolves through design-system tokens.',
  },
  {
    rule: 'no-raw-color',
    location: '7:31',
    message: 'Replace the raw color with a semantic design-system token or utility.',
  },
  {
    rule: 'no-theme-palette',
    location: '8:20',
    message: 'Replace stock palette utility "text-white" with a semantic utility that resolves through design-system tokens.',
  },
] as const;

const validExample = `import { Button, Notice, Surface, Toggle } from '@ai-created/ui';

interface Props {
  status: 'ready' | 'saving' | 'error';
  productUpdates: boolean;
  onChange: (next: boolean) => void;
  onSave: () => void;
}

export function NotificationSettings({
  status,
  productUpdates,
  onChange,
  onSave,
}: Props) {
  return (
    <Surface padding="none" className="divide-y divide-border">
      {status === 'error' ? (
        <Notice variant="error" title="Settings were not saved">
          Check your connection and try again.
        </Notice>
      ) : null}

      <div className="flex items-center justify-between gap-4 p-5">
        <p className="text-sm text-text">Product updates</p>
        <Toggle
          label="Product updates"
          checked={productUpdates}
          onChange={onChange}
        />
      </div>

      <div className="flex justify-end p-5">
        <Button
          variant="primary"
          disabled={status === 'saving'}
          onClick={onSave}
        >
          Save settings
        </Button>
      </div>
    </Surface>
  );
}`;

const validOutcomes = [
  'Public component API, verified against src/index.ts by npm run api:check.',
  'Semantic tokens inherited from styles/tokens.css through the shared preset.',
  'Accessibility behavior inherited from the Toggle, Notice, and Button contracts.',
  'Light, dark, and all nine accent schemes inherited without local overrides.',
  'Future system releases stay compatible because nothing was forked locally.',
] as const;

interface MachineResource {
  title: string;
  description: string;
  href: string;
  action: string;
  external?: boolean;
}

const machineResources: MachineResource[] = [
  {
    title: 'design-system.manifest.json',
    description:
      'Versioned projection of the public API, component contracts, guideline chapters, canonical source precedence, and every blocking validation command.',
    href: '/design-system/manifest.json',
    action: 'Open JSON',
  },
  {
    title: 'llms.txt',
    description:
      'Concise routing context: the required sequence, canonical authority order, appearance contract, and machine resource map.',
    href: '/llms.txt',
    action: 'Open text',
  },
  {
    title: 'llms-full.txt',
    description:
      'Expanded context for tasks that need complete component, accessibility, implementation, guideline, template, and validation detail.',
    href: '/llms-full.txt',
    action: 'Open text',
  },
  {
    title: 'Design tokens JSON',
    description: 'DTCG-shaped export generated from styles/tokens.css, with reference, semantic, layout, radius, motion, and mode values.',
    href: '/design-system/tokens.json',
    action: 'Open JSON',
  },
  {
    title: 'AGENTS.md',
    description: 'The repository-level operating contract: canonical source precedence, required context, prohibited drift, and the missing-capability path.',
    href: 'https://github.com/TheMarco/ai-created-ui/blob/main/AGENTS.md',
    action: 'View source',
    external: true,
  },
  {
    title: 'Agent templates',
    description: `${systemFacts.pageTemplates} approved page archetypes with declared slots, required states, imported primitives, and their own compile check.`,
    href: 'https://github.com/TheMarco/ai-created-ui/tree/main/templates/agent',
    action: 'View source',
    external: true,
  },
  {
    title: 'Design-policy validator',
    description: `The ${systemFacts.policyRules} rules that turn implementation drift into a failing command, plus the schema for scoped exceptions.`,
    href: 'https://github.com/TheMarco/ai-created-ui/blob/main/scripts/validate-design-policy.mjs',
    action: 'View source',
    external: true,
  },
  {
    title: 'Agent integration guide',
    description: 'Consumer setup, query commands, required gates, repository enforcement, exception policy, and adapter guidance.',
    href: 'https://github.com/TheMarco/ai-created-ui/blob/main/docs/agent-integration.md',
    action: 'Read guide',
    external: true,
  },
];

const qualityGates = [
  { command: 'npm run typecheck', purpose: 'Package and portal TypeScript, including every documented prop.' },
  { command: 'npm run lint', purpose: 'Source, script, test, and portal conventions.' },
  { command: 'npm run test', purpose: 'Component behavior, contract, and accessibility tests.' },
  { command: 'npm run build:playground', purpose: 'Production build of the specification portal.' },
  { command: 'npm run package:check', purpose: 'The distributable package contract.' },
] as const;

const contractChecks = [
  { command: 'npm run tokens:check', purpose: 'Rejects a generated token artifact that drifted from canonical CSS.' },
  { command: 'npm run manifest:check', purpose: 'Rejects a stale or incomplete machine manifest.' },
  { command: 'npm run tailwind:check', purpose: 'Rejects framework mappings that drifted from canonical tokens.' },
  { command: 'npm run api:check', purpose: 'Rejects documented props, controls, or imports that drifted from the public TypeScript API.' },
  { command: 'npm run policy:check', purpose: 'Rejects prohibited styling, imports, tokens, and local primitive copies.' },
  { command: 'npm run templates:check', purpose: 'Compiles and verifies every approved page template.' },
  { command: 'npm run docs:check', purpose: 'Rejects stale public counts, routes, and workflow guidance.' },
  { command: 'npm run agent-context:check', purpose: 'Rejects stale concise or full agent context artifacts.' },
] as const;

const composeAllowed = [
  'compose approved components',
  'select documented variants',
  'combine existing patterns',
  'create product-specific layouts',
  'write product-specific content',
  'implement unique domain behavior',
] as const;

const composeProhibited = [
  'create a new design-system primitive',
  'introduce a new token',
  'add an arbitrary variant',
  'duplicate an existing component',
  'redefine accessibility behavior',
  'invent an undocumented component API',
] as const;

const exceptionFlow = [
  { title: 'Product requirement', detail: 'A real, specific need appears in product work.' },
  { title: 'No approved system solution', detail: 'Composition and every approved template were tried first.' },
  { title: 'Document exception', detail: 'One rule, narrow file globs, a concrete reason, an owner, and a review date.' },
  { title: 'Human review', detail: 'A person decides. The validator only enforces the shape and the expiry.' },
] as const;

const exceptionOutcomes = [
  {
    title: 'Local approved exception',
    detail: 'The departure stays product-local and expires. An expired entry fails the build with rule exception-expired.',
  },
  {
    title: 'Promote into design system',
    detail: 'Repeated evidence becomes a contribution through the governance workflow, and the exception is removed.',
  },
] as const;

const exceptionExample = `{
  "exceptions": [
    {
      "rule": "no-raw-color",
      "files": ["src/product/legacy-chart-theme.ts"],
      "reason": "The charting vendor needs literal hex until the token adapter lands.",
      "owner": "Design Systems",
      "reviewBy": "2026-12-01"
    }
  ]
}`;

const startCommands = `# Point an agent at the contract
npm run agent:query -- context

# Select an approved page archetype
npm run agent:query -- templates
npm run agent:query -- template settings

# Read one component contract before using it
npm run agent:query -- component button

# Run the blocking anti-drift contract
npm run agent:check`;

const consumerCommand = `# The same interface ships with the installed release
npx ai-created-ui-agent context
npx ai-created-ui-agent templates
npx ai-created-ui-agent template settings

# Report when the consumer falls behind a reviewed release
npx ai-created-ui-agent consumer-status`;

function SectionHeading({
  index,
  id,
  title,
  summary,
}: {
  index: string;
  id: string;
  title: string;
  summary: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 border-t border-border pt-5 md:grid-cols-[80px_minmax(0,1fr)]">
      <span className="font-display text-3xl text-accent" aria-hidden="true">
        {index}
      </span>
      <div>
        <h2 id={`${id}-heading`} className="font-heading text-2xl font-medium text-text md:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text2 md:text-base">{summary}</p>
      </div>
    </div>
  );
}

function CodeFigure({
  label,
  language,
  code,
}: {
  label: string;
  language: string;
  code: string;
}) {
  return (
    <figure>
      <figcaption className="mb-3 font-mono text-[10px] uppercase tracking-widest text-text3">{label}</figcaption>
      <DSCodeBlock code={code} language={language} label={label} />
    </figure>
  );
}

export default function AgentsPage() {
  return (
    <div className="container-custom py-12 md:py-20">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-text2 transition-colors hover:text-text">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Design-system overview
      </Link>

      <header className="mt-10 border-b border-border pb-14">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">AI-native design system</p>
        <h1 className="mt-5 max-w-5xl font-display text-5xl tracking-wide text-text md:text-7xl">
          Design once. Agents build without drift.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-text2 md:text-lg">
          AI-Created UI gives coding agents the same component contracts, design tokens, accessibility rules, page
          patterns, and governance used by human teams. Agents query the system instead of guessing from screenshots,
          documentation, or model memory.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <DSCtaLink href={AGENT_CONTRACT_HREF}>
            Explore the agent contract
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </DSCtaLink>
          <DSCtaLink href="/llms.txt" variant="secondary">
            View machine-readable context
          </DSCtaLink>
        </div>

        <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
          {heroStats.map(({ label, value }) => (
            <div key={label} className="bg-surface p-5">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-text3">{label}</dt>
              <dd className="mt-2 font-heading text-lg text-text">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="space-y-28 py-16 md:space-y-36 md:py-24">
        <section id="consumers" aria-labelledby="consumers-heading" className="scroll-mt-28">
          <SectionHeading
            index="01"
            id="consumers"
            title="One system. Three consumers."
            summary="The interface contract stays consistent regardless of who is building. Designers, engineers, and coding agents read different projections of one reviewed decision set, never three independent interpretations of it."
          />

          <div className="mt-10 border-l border-t border-border">
            <div className="grid grid-cols-1 lg:grid-cols-3">
            {consumers.map((consumer) => (
              <article key={consumer.role} className="flex flex-col border-b border-r border-border bg-surface/35 p-6 md:p-8">
                <h3 className="font-heading text-xl font-medium text-text">{consumer.role}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text2">{consumer.intro}</p>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-text3">Consumes</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm leading-relaxed text-text2">
                  {consumer.consumes.map((item) => (
                    <li key={item} className="flex min-w-0 gap-3">
                      <span className="mt-2 h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-widest text-accent">
                  {consumer.contract}
                </p>
              </article>
            ))}
            </div>

            <div className="border-b border-r border-border bg-surface/35 p-6 text-center md:p-8">
            <h3 className="font-heading text-xl font-medium text-text md:text-2xl">One interface contract</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-text2">
              {systemFacts.componentFamilies} documented component families, {systemFacts.publicExports}{' '}
              verified public exports, {systemFacts.guidelineChapters} principal guideline chapters, and{' '}
              {systemFacts.pageTemplates} approved page templates, published as one versioned release.
            </p>
            </div>
          </div>
        </section>

        <section id="workflow" aria-labelledby="workflow-heading" className="scroll-mt-28">
          <SectionHeading
            index="02"
            id="workflow"
            title="How an agent builds with the system"
            summary="A worked example, using the settings archetype that ships in templates/agent. Every command below exists in package.json today."
          />

          <ol className="mt-10 border-t border-border">
            {workflowSteps.map((step, index) => (
              <li key={step.id} className="grid grid-cols-1 gap-6 border-b border-border py-8 md:grid-cols-[88px_minmax(0,1fr)]">
                <span className="font-display text-3xl text-accent" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-medium text-text md:text-xl">
                    <span className="sr-only">Step {index + 1}. </span>
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text2">{step.body}</p>

                  {'quote' in step && step.quote ? (
                    <blockquote className="mt-5 max-w-3xl border-l-2 border-accent-border pl-5 text-sm leading-relaxed text-text2">
                      {step.quote}
                    </blockquote>
                  ) : null}

                  {'items' in step && step.items ? (
                    <ul className="mt-5 grid grid-cols-1 max-w-3xl gap-2 sm:grid-cols-2">
                      {step.items.map((item) => (
                        <li key={item} className="font-mono text-xs leading-relaxed text-text2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {'allowed' in step && step.allowed ? (
                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-text3">Uses</p>
                        <ul className="mt-3 space-y-2">
                          {step.allowed.map((item) => (
                            <li key={item} className="flex gap-3 text-sm leading-relaxed text-text2">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-text3">Rejected by validation</p>
                        <ul className="mt-3 space-y-2">
                          {step.rejected.map((item) => (
                            <li key={item} className="flex gap-3 text-sm leading-relaxed text-text2">
                              <X className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}

                  {'outcomes' in step && step.outcomes ? (
                    <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
                      {step.outcomes.map((outcome) => (
                        <div key={outcome.title} className="bg-surface p-5">
                          <p className="flex items-center gap-2 font-heading font-medium text-text">
                            {outcome.state === 'pass' ? (
                              <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                            ) : (
                              <X className="h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                            )}
                            {outcome.title}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-text2">{outcome.detail}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {'code' in step && step.code ? (
                    <div className="mt-6 max-w-3xl">
                      <CodeFigure label={step.code.label} language={step.code.language} code={step.code.code} />
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-text2">
            The system should never silently accept design-system drift. An agent either follows the contract, fails a
            blocking check, or records a narrowly scoped exception for human review.
          </p>
        </section>

        <section id="drift" aria-labelledby="drift-heading" className="scroll-mt-28">
          <SectionHeading
            index="03"
            id="drift"
            title="Drift becomes a build-time problem"
            summary="Both examples below were run through scripts/validate-design-policy.mjs. The diagnostics are the validator's real output, not an illustration of it."
          />

          <div className="mt-10 space-y-14">
            <article className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 border-b border-error-border pb-4">
                <X className="h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                <h3 className="font-heading text-lg font-medium text-text">Invalid</h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-error">Fails policy validation</span>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="min-w-0">
                  <CodeFigure label="Implementation that bypasses the system" language="tsx" code={invalidExample} />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text3">
                    npm run policy:check output
                  </p>
                  <ul className="mt-4 divide-y divide-border border-y border-border">
                    {invalidDiagnostics.map((diagnostic, index) => (
                      <li key={`${diagnostic.rule}-${index}`} className="py-4">
                        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <code className="font-mono text-xs text-error">{diagnostic.rule}</code>
                          <span className="font-mono text-[10px] text-text3">line {diagnostic.location}</span>
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-text2">{diagnostic.message}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-text2">
                The undocumented <code className="font-mono text-xs text-text">tone</code> prop is not a policy rule. It
                fails separately, and just as loudly, in <code className="font-mono text-xs text-text">npm run typecheck</code>.
              </p>
            </article>

            <article className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 border-b border-success-border pb-4">
                <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                <h3 className="font-heading text-lg font-medium text-text">Valid</h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-success">Contract satisfied</span>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="min-w-0">
                  <CodeFigure label="Implementation composed from public primitives" language="tsx" code={validExample} />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text3">What the contract carries</p>
                  <ul className="mt-4 space-y-3">
                    {validOutcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-3 text-sm leading-relaxed text-text2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="resources" aria-labelledby="resources-heading" className="scroll-mt-28">
          <SectionHeading
            index="04"
            id="resources"
            title="Built for machines without compromising humans"
            summary="The human documentation and the machine contract describe the same system from different angles. Both are generated from, or verified against, the same canonical sources."
          />

          <div className="mt-10 divide-y divide-border border-y border-border">
            {machineResources.map((resource) => (
              <a
                key={resource.title}
                href={resource.href}
                target={resource.external ? '_blank' : undefined}
                rel={resource.external ? 'noopener noreferrer' : undefined}
                className="group grid grid-cols-1 gap-4 py-5 transition-colors hover:bg-surface/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-[3px] sm:grid-cols-[1fr_auto] sm:px-4"
              >
                <div className="min-w-0">
                  <h3 className="font-mono text-sm text-text">{resource.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text2">{resource.description}</p>
                </div>
                <span className="flex items-center gap-2 self-center whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-accent">
                  {resource.action}
                  {resource.external ? (
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  )}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section id="enforcement" aria-labelledby="enforcement-heading" className="scroll-mt-28">
          <SectionHeading
            index="05"
            id="enforcement"
            title="The contract is enforced"
            summary="AI-written implementation enters the same engineering quality system as human-written implementation. Most of these gates are not agent features at all; they are ordinary package validation that agent output must also survive."
          />

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
            <div>
              <h3 className="font-heading text-lg font-medium text-text">General system quality gates</h3>
              <p className="mt-2 text-sm leading-relaxed text-text2">
                These exist whether or not an agent is involved. They are the reason agent output cannot ship on a
                design-system technicality alone.
              </p>
              <dl className="mt-6 divide-y divide-border border-y border-border">
                {qualityGates.map(({ command, purpose }) => (
                  <div key={command} className="py-4">
                    <dt>
                      <code className="font-mono text-xs text-text">{command}</code>
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-text2">{purpose}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="font-heading text-lg font-medium text-text">Agent-specific contract checks</h3>
              <p className="mt-2 text-sm leading-relaxed text-text2">
                These {systemFacts.agentChecks} checks are the machine contract itself. Together they run as{' '}
                <code className="font-mono text-xs text-text">npm run agent:check</code>.
              </p>
              <dl className="mt-6 divide-y divide-border border-y border-border">
                {contractChecks.map(({ command, purpose }) => (
                  <div key={command} className="py-4">
                    <dt>
                      <code className="font-mono text-xs text-text">{command}</code>
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-text2">{purpose}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-text2">
            <code className="font-mono text-xs text-text">npm run validate</code> runs typecheck, lint, tests,
            the full agent contract, the portal build, and the package check in one command. Browser and visual coverage
            runs through <code className="font-mono text-xs text-text">npm run test:browser</code>. Both are required on
            every pull request.
          </p>
        </section>

        <section id="composition" aria-labelledby="composition-heading" className="scroll-mt-28">
          <SectionHeading
            index="06"
            id="composition"
            title="Agents compose. They don't invent the system."
            summary="The boundary is not creativity versus obedience. It is product work, which stays flexible, versus system decisions, which stay governed."
          />

          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            <div className="bg-surface p-6 md:p-8">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-success">Agents can</h3>
              <ul className="mt-5 space-y-3">
                {composeAllowed.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-text2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface p-6 md:p-8">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-error">Agents cannot do silently</h3>
              <ul className="mt-5 space-y-3">
                {composeProhibited.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-text2">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 font-heading text-lg text-text md:text-xl">
            Product work stays flexible. System decisions stay governed.
          </p>
        </section>

        <section id="exceptions" aria-labelledby="exceptions-heading" className="scroll-mt-28">
          <SectionHeading
            index="07"
            id="exceptions"
            title="Exceptions stay explicit"
            summary="When a legitimate product requirement falls outside the current system, the correct outcome is not silent local divergence. It is a recorded decision with a name on it and a date attached."
          />

          <ol className="mt-10 border-t border-border">
            {exceptionFlow.map((stage, index) => (
              <li key={stage.title} className="grid grid-cols-1 gap-4 border-b border-border py-5 md:grid-cols-[88px_minmax(0,1fr)]">
                <span className="font-mono text-xs text-accent" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-heading font-medium text-text">{stage.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text2">{stage.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            {exceptionOutcomes.map((outcome) => (
              <div key={outcome.title} className="bg-surface p-6">
                <h3 className="font-heading font-medium text-text">{outcome.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text2">{outcome.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-3xl">
            <CodeFigure
              label="ai-created-ui.config.json exception shape"
              language="json"
              code={exceptionExample}
            />
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-text2">
            The schema at{' '}
            <code className="font-mono text-xs text-text">contracts/design-policy.schema.json</code> requires all five
            fields, rejects catch-all globs, and limits the rule to one of the{' '}
            {systemFacts.policyRules} policy rules. Read the full policy in the{' '}
            <Link href="/guidelines/governance" className="text-accent underline underline-offset-4 hover:text-text">
              governance guideline
            </Link>
            .
          </p>
        </section>

        <section id="start" aria-labelledby="start-heading" className="scroll-mt-28">
          <SectionHeading
            index="08"
            id="start"
            title="Give an agent the contract"
            summary="Point a coding agent at the query interface before it writes a line of UI. The same JSON interface ships inside every installed release."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-8">
            <CodeFigure label="Inside this repository" language="bash" code={startCommands} />
            <CodeFigure label="Inside a consumer application" language="bash" code={consumerCommand} />
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-sm">
            <Link href={AGENT_CONTRACT_HREF} className="text-accent underline underline-offset-4 hover:text-text">
              Agent contract reference
            </Link>
            <a
              href="https://github.com/TheMarco/ai-created-ui/blob/main/docs/agent-integration.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 hover:text-text"
            >
              Agent integration guide
            </a>
            <a href="/design-system/manifest.json" className="text-accent underline underline-offset-4 hover:text-text">
              Design-system manifest
            </a>
            <a href="/llms.txt" className="text-accent underline underline-offset-4 hover:text-text">
              llms.txt
            </a>
            <a href="/llms-full.txt" className="text-accent underline underline-offset-4 hover:text-text">
              llms-full.txt
            </a>
            <a
              href="https://github.com/TheMarco/ai-created-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 hover:text-text"
            >
              GitHub source
            </a>
          </div>
        </section>
      </div>

      <section aria-labelledby="agents-cta-heading" className="border-t border-border py-16 md:py-24">
        <h2 id="agents-cta-heading" className="max-w-4xl font-display text-3xl tracking-wide text-text md:text-5xl">
          Design-system compliance shouldn&apos;t depend on who wrote the code.
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-text2">
          Humans and agents should build against the same decisions, APIs, and constraints. AI-Created UI turns those
          decisions into a versioned contract that can be read, implemented, and validated by both.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <DSCtaLink href={AGENT_CONTRACT_HREF}>
            Read the agent contract
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </DSCtaLink>
          <DSCtaLink href="/components" variant="secondary">
            Browse components
          </DSCtaLink>
        </div>
      </section>
    </div>
  );
}
