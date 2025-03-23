'use client';

import { HeroUIProvider } from '@heroui/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: object;
}

const queryClient = new QueryClient();

/**
 * Wraps the application with all global providers:
 * - TanStack Query (data fetching)
 * - HeroUI component system
 * - NextThemes (theme management)
 */
export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <NextThemesProvider attribute="data-theme" defaultTheme="dark" {...themeProps}>
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
