import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@ai-created/ui';
import PlaygroundFooter from '@/components/PlaygroundFooter';

export const metadata: Metadata = {
  title: '@ai-created/ui | Design System Specification',
  description:
    'Design once. Build without drift. A versioned design system consumed by designers, engineers, and coding agents through one interface contract.',
  alternates: {
    canonical: 'https://ui.ai-created.com',
  },
  openGraph: {
    title: '@ai-created/ui | Design System Specification',
    description:
      'Design once. Build without drift. A versioned design system consumed by designers, engineers, and coding agents through one interface contract.',
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
    <html lang="en" suppressHydrationWarning data-accent="red" data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=document.documentElement,t=localStorage.getItem('theme'),a=localStorage.getItem('accent'),v=['red','green','blue','orange','yellow','purple','teal','pink','magenta'];if(t==='light')r.classList.add('light');if(v.indexOf(a)>-1)r.dataset.accent=a}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider defaultAccent="red">
          {children}
          <PlaygroundFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
