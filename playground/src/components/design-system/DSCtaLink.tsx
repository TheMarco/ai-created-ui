'use client';

import Link from 'next/link';
import { buttonStyles, type ButtonVariant } from '@ai-created/ui';

interface DSCtaLinkProps {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
}

/**
 * buttonStyles ships from a client module, so server-rendered pages route their
 * calls-to-action through this boundary instead of copying button classes.
 */
export default function DSCtaLink({ href, variant = 'primary', children }: DSCtaLinkProps) {
  const className = buttonStyles({ variant, size: 'lg' });

  if (href.startsWith('/') && !href.includes('.')) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
