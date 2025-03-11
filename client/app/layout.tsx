import '@/styles/globals.css';
import clsx from 'clsx';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type React from 'react';

import ConditionalLayout from '@/components/conditional-layout';
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Preload CSS to prevent unstyled content */}
        <link rel="preload" href="/styles/globals.css" as="style" />
        <link rel="stylesheet" href="/styles/globals.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ✅ Apply Dark Mode Before React Loads */}
        <Script id="theme-loader" strategy="beforeInteractive">
          {`
            (function() {
              let theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            })();
          `}
        </Script>
      </head>
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Providers themeProps={{ attribute: 'data-theme', defaultTheme: 'dark' }}>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
