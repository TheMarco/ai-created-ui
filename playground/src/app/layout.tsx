import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@ai-created/ui';

export const metadata: Metadata = {
  title: '@ai-created/ui | Design System Specification',
  description:
    'The canonical component, design guidance, and agent contract portal for the @ai-created/ui design system.',
  alternates: {
    canonical: 'https://ui.ai-created.com',
  },
  openGraph: {
    title: '@ai-created/ui | Design System Specification',
    description:
      'The canonical component, design guidance, and agent contract portal for the @ai-created/ui design system.',
    url: 'https://ui.ai-created.com',
    siteName: '@ai-created/ui',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
