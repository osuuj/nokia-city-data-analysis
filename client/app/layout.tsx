import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import { ClientLayoutWrapper } from '@/shared/components/layout/ClientLayoutWrapper';
import { ResponsiveLoading } from '@/shared/components/loading/ResponsiveLoading';
import { MapboxLoader } from '@/shared/components/ui/MapboxLoader';
import { BreadcrumbProvider } from '@/shared/context';
import { LoadingProvider } from '@/shared/context/loading/LoadingContext';
import '@/shared/styles/critical.css';
import '@/shared/styles/globals.css';
import { ConditionalLayout } from '@shared/components/layout';
import { fontSans, siteConfig } from '@shared/config';
import { Providers } from '@shared/providers';
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
  keywords: [
    'company search',
    'business analytics',
    'data visualization',
    'ETL',
    'dashboard',
    'finland companies',
    'business data',
  ],
  authors: [{ name: 'Osuuj Team' }],
  creator: 'Osuuj Team',
  publisher: 'Osuuj',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://osuuj.ai',
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    site: '@osuuj',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://osuuj.ai'),
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
        {/* Performance optimization - preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Improve resource loading for icons */}
        <link rel="preconnect" href="https://api.iconify.design" />
        <link rel="dns-prefetch" href="https://api.iconify.design" />

        {/* Preload site icon */}
        <link rel="preload" href="/icon.png" as="image" />

        {/* Theme loader script to prevent flicker */}
        <Script id="theme-loader" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const savedTheme = localStorage.getItem('theme');
                const finalTheme = savedTheme || systemTheme;
                document.documentElement.setAttribute('data-theme', finalTheme);
                
                // Add class for dark mode immediately to prevent flash
                if (finalTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                }

                // Detect theme changes and add temporary class to prevent flash
                let lastTheme = finalTheme;
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class') {
                      const newTheme = document.documentElement.getAttribute('data-theme') || 
                                      (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
                      
                      if (newTheme !== lastTheme) {
                        document.documentElement.classList.add('theme-changing');
                        lastTheme = newTheme;
                        setTimeout(() => {
                          document.documentElement.classList.remove('theme-changing');
                        }, 300);
                      }
                    }
                  });
                });
                
                observer.observe(document.documentElement, { attributes: true });
              } catch (e) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            })();
          `}
        </Script>
      </head>
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ClientLayoutWrapper>
          <ErrorBoundary fallback={<ErrorMessage />}>
            <LoadingProvider>
              <Providers themeProps={{ attribute: 'data-theme', defaultTheme: 'dark' }}>
                <BreadcrumbProvider>
                  <ConditionalLayout>
                    {/* Initialize Mapbox GL with CSP compatibility */}
                    <MapboxLoader />
                    <ResponsiveLoading />
                    {children}
                  </ConditionalLayout>
                </BreadcrumbProvider>
              </Providers>
            </LoadingProvider>
          </ErrorBoundary>
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
