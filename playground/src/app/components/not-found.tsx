import Link from 'next/link';

export default function ComponentNotFound() {
  return (
    <div className="container-custom py-24">
      <div className="max-w-2xl rounded-md border border-border bg-surface p-8 md:p-12">
        <h1 className="font-display text-4xl tracking-wide text-text">Specification not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-text2">
          This component does not have a public specification, or its route has changed.
        </p>
        <Link
          href="/components"
          className="mt-8 inline-flex rounded-md bg-red-solid px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-solid-hover"
        >
          Browse components
        </Link>
      </div>
    </div>
  );
}
