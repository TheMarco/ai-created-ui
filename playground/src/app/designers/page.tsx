import type { Metadata } from 'next';
import DesignersPage from '@/components/design-system/designers/DesignersPage';

const description = 'Make mockups with the free AI-Created UI Figma kit: editable components, semantic variables, light and dark themes, and six complete page templates.';

export const metadata: Metadata = {
  title: 'For designers · Figma kit | AI-Created UI',
  description,
  alternates: { canonical: 'https://ui.ai-created.com/designers' },
  openGraph: {
    title: 'The whole system. In Figma.',
    description,
    url: 'https://ui.ai-created.com/designers',
    siteName: '@ai-created/ui',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: 'https://ui.ai-created.com/images/figma/dashboard-dark.png',
      width: 1440,
      height: 1015,
      alt: 'AI-Created UI dashboard template from the Figma library',
    }],
  },
  twitter: { card: 'summary_large_image', title: 'The whole system. In Figma.', description },
};

export default function Designers() {
  return <DesignersPage />;
}
