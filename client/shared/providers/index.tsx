'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Attribute } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type React from 'react';

/**
 * Default React Query client configuration
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (garbage collection time, was cacheTime in v4)
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: {
    attribute?: Attribute | Attribute[];
    defaultTheme?: string;
    enableSystem?: boolean;
  };
}

/**
 * Global providers wrapper component
 * Wraps the application with all necessary context providers:
 * - React Query for data fetching and caching
 * - Next-themes for theme management
 *
 * @param children The application content to wrap with providers
 */
export function Providers({ children, themeProps = {} }: ProvidersProps) {
  const { attribute = 'class', defaultTheme = 'system', enableSystem = true } = themeProps;

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute={attribute}
        defaultTheme={defaultTheme}
        enableSystem={enableSystem}
      >
        {children}
      </NextThemesProvider>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
