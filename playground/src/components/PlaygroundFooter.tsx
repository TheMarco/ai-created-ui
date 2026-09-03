import Link from 'next/link';
import { release } from '@/lib/release';

const documentation = [
  { href: '/foundations', label: 'Foundations' },
  { href: '/components', label: 'Components' },
  { href: '/guidelines', label: 'Guidelines' },
  { href: '/agents', label: 'Agents' },
] as const;

const source = [
  { href: release.repositoryUrl, label: 'GitHub' },
  { href: release.releasesUrl, label: 'Releases' },
  { href: `${release.repositoryUrl}/blob/main/CHANGELOG.md`, label: 'Changelog' },
  { href: release.licenseUrl, label: `${release.license} License` },
] as const;

const machineContext = [
  { href: '/design-system/manifest.json', label: 'Manifest' },
  { href: '/llms.txt', label: 'llms.txt' },
  { href: '/llms-full.txt', label: 'llms-full.txt' },
  { href: '/design-system/tokens.json', label: 'Design tokens' },
] as const;

export default function PlaygroundFooter() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="container-custom grid grid-cols-1 gap-10 py-12 md:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.6fr))] md:py-16">
        <div>
          <p className="font-heading text-base text-text">{release.packageName}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-text2">
            One versioned interface contract for designers, engineers, and coding agents.
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-text3">
            <span className="text-text2">v{release.version}</span>
            <span aria-hidden="true">·</span>
            <span>Stable release</span>
            <span aria-hidden="true">·</span>
            <span>{release.license}</span>
          </p>
        </div>

        <nav aria-label="Documentation">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-text3">Documentation</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {documentation.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-text2 transition-colors hover:text-text">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Source and releases">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-text3">Source</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {source.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text2 transition-colors hover:text-text"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Machine-readable context">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-text3">Machine context</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {machineContext.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="text-text2 transition-colors hover:text-text">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container-custom border-t border-border py-6">
        <p className="text-xs leading-relaxed text-text3">
          Distributed through immutable GitHub tags, not the npm registry. Install a reviewed release with{' '}
          <code className="font-mono text-[11px] text-text2">{release.installCommand}</code>
        </p>
      </div>
    </footer>
  );
}
