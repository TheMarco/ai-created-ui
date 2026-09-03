'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * The overview route used to host the foundation, component, and reference
 * sections. Their anchors are still linked from older documentation and
 * bookmarks, and a fragment never reaches the server, so the move is completed
 * here on the client.
 */
const movedAnchors: Record<string, string> = {
  colors: '/foundations#colors',
  typography: '/foundations#typography',
  spacing: '/foundations#spacing',
  motion: '/foundations#motion',
  theme: '/foundations#theme',
  tokens: '/foundations#tokens',
  components: '/components#components',
  reference: '/components',
  accessibility: '/guidelines/accessibility',
  archetypes: '/guidelines/patterns#page-archetypes',
  'product-ux': '/guidelines/patterns',
};

export default function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const destination = movedAnchors[window.location.hash.replace(/^#/, '')];
    if (destination) router.replace(destination);
  }, [router]);

  return null;
}
