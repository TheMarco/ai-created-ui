'use client';

import Link from 'next/link';
import { buttonStyles, type ButtonVariant } from '@ai-created/ui';

interface AgentsCtaLinkProps {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
}

/**
 * buttonStyles ships from a client module, so the server-rendered /agents page
 * routes its calls-to-action through this boundary instead of copying classes.
 */
export default function AgentsCtaLink({ href, variant = 'primary', children }: AgentsCtaLinkProps) {
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
