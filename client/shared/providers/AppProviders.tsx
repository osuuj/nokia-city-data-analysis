'use client';

import { BreadcrumbProvider } from '@/shared/context/BreadcrumbContext';
import { HeroUIProvider } from '@heroui/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Attribute } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode, useState } from 'react';

interface ProvidersProps {
  children: ReactNode;
  themeProps?: {
    attribute?: Attribute | Attribute[];
    defaultTheme?: string;
    enableSystem?: boolean;
  };
  withBreadcrumbs?: boolean;
  withHeroUI?: boolean;
}

/**
 * Global providers wrapper component
 * Wraps the application with all necessary context providers:
 * - React Query for data fetching and caching
 * - Next-themes for theme management
 * - HeroUI component system (optional)
 * - Breadcrumb navigation (optional)
 *
 * @param children The application content to wrap with providers
 * @param themeProps Theme configuration options
 * @param withBreadcrumbs Whether to include breadcrumb navigation
 * @param withHeroUI Whether to include HeroUI provider
 */
export function Providers({
  children,
  themeProps = {},
  withBreadcrumbs = false,
  withHeroUI = false,
}: ProvidersProps) {
  const { attribute = 'class', defaultTheme = 'system', enableSystem = true } = themeProps;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 30 * 60 * 1000, // 30 minutes (garbage collection time)
            retry: 3,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // Build the provider chain by wrapping components
  let content = children;

  // Add breadcrumbs if needed
  if (withBreadcrumbs) {
    content = <BreadcrumbProvider>{content}</BreadcrumbProvider>;
  }

  // Add theme provider
  content = (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
    >
      {content}
    </NextThemesProvider>
  );

  // Add HeroUI if needed
  if (withHeroUI) {
    content = <HeroUIProvider>{content}</HeroUIProvider>;
  }

  // Add Query Provider as the outermost wrapper
  content = (
    <QueryClientProvider client={queryClient}>
      {content}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );

  return content;
}

/**
 * Simplified Query Provider if you only need React Query
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/**
 * Dashboard-specific provider with all necessary contexts for the dashboard
 */
export function DashboardProvider({
  children,
  themeProps = {},
}: { children: ReactNode; themeProps?: object }) {
  return (
    <Providers
      themeProps={{
        attribute: 'data-theme',
        defaultTheme: 'dark',
        ...themeProps,
      }}
      withBreadcrumbs={true}
      withHeroUI={true}
    >
      {children}
    </Providers>
  );
}
