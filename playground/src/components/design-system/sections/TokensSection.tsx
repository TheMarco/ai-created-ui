'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DSSection from '../DSSection';

interface TokenLevel {
  level: string;
  example: string;
  audience: string;
  rule: string;
}

const levels: TokenLevel[] = [
  {
    level: 'Reference',
    example: '--ref-red-500',
    audience: 'System maintainers',
    rule: 'Stores a raw value. Never consumed directly in product UI.',
  },
  {
    level: 'Semantic',
    example: '--color-action-primary',
    audience: 'Designers and engineers',
    rule: 'Names intent and owns light, dark, and accent behavior.',
  },
  {
    level: 'Component',
    example: 'Button / Primary / Background',
    audience: 'Component authors',
    rule: 'Maps one component decision onto a semantic token.',
  },
];

const groups = [
  { name: 'Color', prefix: '--color-*', purpose: 'Backgrounds, surfaces, text, borders, actions, and semantic feedback.' },
  { name: 'Layout', prefix: '--layout-*', purpose: 'Container maximum, gutters, and section rhythm.' },
  { name: 'Radius', prefix: '--radius-*', purpose: 'The complete corner scale: 4px, 6px, and 10px.' },
  { name: 'Motion', prefix: '--motion-*', purpose: 'Duration steps consumed by components and the motion helpers.' },
  { name: 'Elevation', prefix: '--shadow-elevation-*', purpose: 'The low, medium, and high shadow steps.' },
];

interface TokensSectionProps {
  cssVariables: number;
  onInView?: (id: string) => void;
}

export default function TokensSection({ cssVariables, onInView }: TokensSectionProps) {
  return (
    <DSSection
      id="tokens"
      title="Design tokens"
      subtitle={`Every visual decision on this page resolves through one of ${cssVariables} CSS custom properties declared in styles/tokens.css. Product UI consumes semantic names, never raw values.`}
      onInView={onInView}
    >
      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">Token decision hierarchy</caption>
          <thead className="bg-surface2 font-mono text-[10px] uppercase tracking-wider text-text3">
            <tr>
              {['Level', 'Example', 'Who consumes it', 'Rule'].map((column) => (
                <th key={column} scope="col" className="border-r border-border px-4 py-3 font-medium last:border-r-0">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface/35">
            {levels.map((level) => (
              <tr key={level.level} className="border-t border-border align-top">
                <td className="border-r border-border px-4 py-4 font-medium text-text">{level.level}</td>
                <td className="border-r border-border px-4 py-4">
                  <code className="font-mono text-xs text-text2">{level.example}</code>
                </td>
                <td className="border-r border-border px-4 py-4 text-text2">{level.audience}</td>
                <td className="px-4 py-4 leading-relaxed text-text2">{level.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 grid grid-cols-1 border-l border-t border-border md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <article key={group.name} className="min-w-0 border-b border-r border-border bg-surface/35 p-6">
            <h3 className="font-heading font-medium text-text break-words">{group.name}</h3>
            <code className="mt-2 block break-words font-mono text-xs text-accent">{group.prefix}</code>
            <p className="mt-3 break-words text-sm leading-relaxed text-text2">{group.purpose}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-sm">
        <Link
          href="/guidelines/foundations#token-architecture"
          className="inline-flex items-center gap-2 text-accent underline underline-offset-4 hover:text-text"
        >
          Canonical token architecture
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <a href="/design-system/tokens.json" className="text-accent underline underline-offset-4 hover:text-text">
          Download tokens JSON
        </a>
        <a
          href="https://github.com/TheMarco/ai-created-ui/blob/main/styles/tokens.css"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4 hover:text-text"
        >
          styles/tokens.css
        </a>
      </div>
    </DSSection>
  );
}
