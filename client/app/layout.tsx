import '@/styles/globals.css';
import clsx from 'clsx';
import type { Metadata, Viewport } from 'next';
import type React from 'react';

import ConditionalLayout from '@/components/conditional-layout'; // ✅ Import the new component
import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <ConditionalLayout>
            {' '}
            {/* ✅ This component handles Header/Footer visibility */}
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
