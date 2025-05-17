'use client';

import { DashboardFooter } from '@/features/dashboard/components/layout';
import { SidebarWrapper } from '@/features/dashboard/components/layout/sidebar/SidebarWrapper';
import { ErrorBoundary } from '@/shared/components/error';
import { StandardFallback } from '@/shared/components/loading';
import { Suspense } from 'react';

/**
 * Layout for the `/dashboard` route.
 * Clean layout with sidebar handled internally.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarWrapper />
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <ErrorBoundary
          fallback={<div>Something went wrong in the dashboard. Please refresh the page.</div>}
        >
          <Suspense fallback={<StandardFallback text="Loading dashboard..." />}>
            <main className="flex-1 w-full h-full overflow-auto p-2 sm:p-3 md:p-4">{children}</main>
          </Suspense>
        </ErrorBoundary>
        <DashboardFooter className="flex-shrink-0" />
      </div>
    </div>
  );
}
