import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import GuidelineDirectory from '@/components/design-system/GuidelineDirectory';

export const metadata: Metadata = {
  title: 'Principal specification | @ai-created/ui',
  description: 'Foundations, construction, product patterns, content, accessibility, governance, and reusable assets for the AI-Created design system.',
};

export default function GuidelinesPage() {
  return (
    <div className="container-custom py-12 md:py-20">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-text2 transition-colors hover:text-text">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Design-system overview
      </Link>

      <header className="mt-12 grid gap-10 border-b border-border pb-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Principal specification</p>
          <h1 className="mt-5 max-w-5xl font-display text-5xl tracking-wide text-text md:text-7xl">
            One system. Every decision.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-text2 md:text-lg">
            The complete operating contract for designing, building, reviewing, releasing, and evolving AI-Created product interfaces.
          </p>
        </div>
        <div className="border-l-2 border-accent-border pl-5 text-sm leading-relaxed text-text2">
          Use the component workbench for production APIs and live behavior. Use these guidelines for the cross-system decisions a component alone cannot carry.
        </div>
      </header>

      <div className="mt-12">
        <GuidelineDirectory />
      </div>
    </div>
  );
}
