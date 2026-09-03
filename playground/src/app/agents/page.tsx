import type { Metadata } from 'next';
import AgentsPage from '@/components/design-system/agents/AgentsPage';

export const metadata: Metadata = {
  title: 'AI Agents | @ai-created/ui',
  description:
    'How coding agents consume AI-Created UI through machine-readable component contracts, semantic tokens, approved templates, and automated design-policy validation.',
  alternates: {
    canonical: 'https://ui.ai-created.com/agents',
  },
  openGraph: {
    title: 'AI Agents | @ai-created/ui',
    description:
      'How coding agents consume AI-Created UI through machine-readable component contracts, semantic tokens, approved templates, and automated design-policy validation.',
    url: 'https://ui.ai-created.com/agents',
    siteName: '@ai-created/ui',
    locale: 'en_US',
    type: 'website',
  },
};

export default function Agents() {
  return <AgentsPage />;
}
