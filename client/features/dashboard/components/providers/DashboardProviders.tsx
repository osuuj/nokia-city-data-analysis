'use client';

import type React from 'react';
import { ReactQueryProvider } from './ReactQueryProvider';

interface DashboardProvidersProps {
  children: React.ReactNode;
}

/**
 * Dashboard Providers component
 * Wraps all necessary providers for the dashboard
 */
export function DashboardProviders({ children }: DashboardProvidersProps) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
