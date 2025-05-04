'use client';

import { BreadcrumbProvider } from '@/shared/context/BreadcrumbContext';
import { HeroUIProvider } from '@heroui/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode, useState } from 'react';

interface DashboardProvidersProps {
  children: ReactNode;
  themeProps?: object;
}

/**
 * DashboardProviders
 * Provides all necessary providers for the dashboard feature:
 * - TanStack Query (data fetching) with optimized configuration
 * - HeroUI component system
 * - NextThemes (theme management)
 * - Breadcrumb (navigation context)
 */
export function DashboardProviders({ children, themeProps = {} }: DashboardProvidersProps) {
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

// For backward compatibility
export const QueryProvider = DashboardProviders;
