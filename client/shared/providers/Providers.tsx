'use client';

import { HeroUIProvider } from '@heroui/system';
import { BreadcrumbProvider } from '@shared/context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: object;
}

/**
 * Create a new QueryClient instance with default configuration
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

/**
 * Wraps the application with all global providers:
 * - TanStack Query (data fetching)
 * - HeroUI component system
 * - NextThemes (theme management)
 * - Breadcrumb (navigation context)
 */
export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <NextThemesProvider attribute="data-theme" defaultTheme="dark" {...themeProps}>
          <BreadcrumbProvider>{children}</BreadcrumbProvider>
        </NextThemesProvider>
      </HeroUIProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
