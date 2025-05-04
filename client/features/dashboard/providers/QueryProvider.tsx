'use client';

import { BreadcrumbProvider } from '@/shared/context/BreadcrumbContext';
import { HeroUIProvider } from '@heroui/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
  themeProps?: object;
}

/**
 * Provider component that sets up:
 * - TanStack Query for data fetching
 * - HeroUI component system
 * - Theme management
 * - Breadcrumb navigation
 */
export function QueryProvider({ children, themeProps = {} }: QueryProviderProps) {
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

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <NextThemesProvider attribute="data-theme" defaultTheme="dark" {...themeProps}>
          <BreadcrumbProvider>{children}</BreadcrumbProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
