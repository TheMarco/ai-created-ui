import type { ReactNode } from 'react';
import { ThemeProvider } from '@ai-created/ui';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-accent="red">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=document.documentElement,t=localStorage.getItem('theme'),a=localStorage.getItem('accent'),v=['red','green','blue','orange','yellow','purple','teal','pink','magenta'];if(t==='light')r.classList.add('light');if(v.indexOf(a)>-1)r.dataset.accent=a}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-bg font-body text-text">
        <ThemeProvider defaultAccent="red">{children}</ThemeProvider>
      </body>
    </html>
  );
}
