import { ErrorFallback } from '@/shared/components/ErrorFallback';
import { ErrorBoundary } from '@/shared/components/error';
import { fontSans, siteConfig } from '@shared/config';
import { ConditionalLayout } from '@shared/layout/components/conditional/ConditionalLayout';
import { Providers } from '@shared/providers';
import '@/shared/styles/globals.css';
import { ResponsiveLoading } from '@/shared/components/loading/ResponsiveLoading';
import { BreadcrumbProvider } from '@/shared/context';
import { LoadingProvider } from '@/shared/context/LoadingContext';
import clsx from 'clsx';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type React from 'react';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['company search', 'business analytics', 'data visualization', 'ETL', 'dashboard'],
  authors: [{ name: 'Osuuj Team' }],
  creator: 'Osuuj Team',
  publisher: 'Osuuj',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://osuuj.com',
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

/**
 * Root layout component wrapping all pages in the application.
 * Applies global styles, fonts, providers, and metadata configuration.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme loader script to prevent flicker */}
        <Script id="theme-loader" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const savedTheme = localStorage.getItem('theme');
                const finalTheme = savedTheme || systemTheme;
                document.documentElement.setAttribute('data-theme', finalTheme);
              } catch (e) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            })();
          `}
        </Script>
      </head>
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <LoadingProvider>
            <Providers themeProps={{ attribute: 'data-theme', defaultTheme: 'dark' }}>
              <BreadcrumbProvider>
                <ConditionalLayout>
                  <ResponsiveLoading />
                  {children}
                </ConditionalLayout>
              </BreadcrumbProvider>
            </Providers>
          </LoadingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
