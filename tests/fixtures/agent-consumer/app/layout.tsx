import type { ReactNode } from 'react';
import { ThemeProvider } from '@ai-created/ui';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg font-body text-text">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
