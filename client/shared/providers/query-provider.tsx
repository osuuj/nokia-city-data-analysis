'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
  enableDevtools?: boolean;
}

/**
 * React Query Provider for client components
 * This creates a new QueryClient instance for each client component tree
 */
export default function QueryProvider({
  children,
  enableDevtools = process.env.NODE_ENV === 'development',
}: QueryProviderProps) {
  // Create a new QueryClient instance for each client component tree
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default options for all queries
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
