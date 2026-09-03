import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FoundationsShell from '@/components/design-system/FoundationsShell';
import { systemFacts } from '@/lib/system-facts';

export const metadata: Metadata = {
  title: 'Foundations | @ai-created/ui',
  description:
    'Design tokens, color, typography, spacing and layout, motion, and theme foundations for the @ai-created/ui design system.',
  alternates: {
    canonical: 'https://ui.ai-created.com/foundations',
  },
  openGraph: {
    title: 'Foundations | @ai-created/ui',
    description:
      'Design tokens, color, typography, spacing and layout, motion, and theme foundations for the @ai-created/ui design system.',
    url: 'https://ui.ai-created.com/foundations',
    siteName: '@ai-created/ui',
    locale: 'en_US',
    type: 'website',
  },
};

export default function FoundationsPage() {
  return (
    <div className="container-custom pb-32 pt-12 md:pt-20">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-text2 transition-colors hover:text-text">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Design-system overview
      </Link>

      <header className="mt-10 max-w-4xl border-b border-border pb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Foundations</p>
        <h1 className="mt-4 font-display text-4xl tracking-wide text-text md:text-6xl">
          The decisions every surface inherits.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-text2 md:text-lg">
          This is the implementation reference: token values, live specimens, and the exact CSS variables that resolve
          the same way in every component and every consuming product. The principles, decisions, and acceptance rules
          that govern them live in the{' '}
          <Link href="/guidelines/foundations" className="text-accent underline underline-offset-4 hover:text-text">
            Foundations guideline
          </Link>
          .
        </p>
      </header>

      <div className="mt-16">
        <FoundationsShell cssVariables={systemFacts.cssVariables} />
      </div>
    </div>
  );
}
