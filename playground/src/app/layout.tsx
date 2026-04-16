import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@ai-created/ui';

export const metadata: Metadata = {
  title: '@ai-created/ui — Design System Playground',
  description:
    'Live playground and reference for @ai-created/ui, the shared design system powering AI-Created products.',
  alternates: {
    canonical: 'https://ui.ai-created.com',
  },
  openGraph: {
    title: '@ai-created/ui — Design System Playground',
    description:
      'Live playground and reference for @ai-created/ui, the shared design system powering AI-Created products.',
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
    <html lang="en" suppressHydrationWarning>
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
