import Link from 'next/link';

export default function GuidelineNotFound() {
  return (
    <div className="container-custom py-24">
      <div className="max-w-2xl border-l-2 border-accent-border pl-8">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">404</p>
        <h1 className="mt-4 font-display text-5xl tracking-wide text-text">Guideline not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-text2">
          This guideline does not exist, or its route has changed.
        </p>
      <Link href="/guidelines" className="mt-8 inline-flex rounded-md bg-action-primary px-5 py-2.5 text-sm font-medium text-on-action transition-colors hover:bg-action-primary-hover">
          Browse guidelines
        </Link>
      </div>
    </div>
  );
}
