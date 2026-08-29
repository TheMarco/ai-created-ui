import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ComponentDirectory from '@/components/design-system/ComponentDirectory';
import { componentDocs } from '@/components/design-system/componentDocs';

export const metadata: Metadata = {
  title: 'Components | @ai-created/ui',
  description: 'Detailed visual, behavioral, accessibility, and implementation specifications for every @ai-created/ui component.',
};

export default function ComponentsPage() {
  return (
    <div className="container-custom py-12 md:py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-text2 transition-colors hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Design-system overview
      </Link>

      <header className="mt-10 max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-wider text-red">Component specifications</p>
        <h1 className="mt-4 font-display text-4xl tracking-wide text-text md:text-6xl">
          Build from documented contracts.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-text2 md:text-lg">
          Every public primitive is documented as a visual system, an interaction contract, and a production implementation. Search the library or browse by responsibility.
        </p>
      </header>

      <div className="mt-16 border-t border-border pt-10">
        <ComponentDirectory items={componentDocs} />
      </div>
    </div>
  );
}
