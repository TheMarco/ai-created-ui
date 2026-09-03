'use client';

import { useEffect } from 'react';

/** Marks the document once the portal has hydrated so browser tests can wait on it. */
export default function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.playgroundHydrated = 'true';

    return () => {
      delete document.documentElement.dataset.playgroundHydrated;
    };
  }, []);

  return null;
}
