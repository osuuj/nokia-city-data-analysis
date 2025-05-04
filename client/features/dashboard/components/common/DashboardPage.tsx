'use client';

import { ViewSwitcher } from '@/features/dashboard/components/common/ViewSwitcher';
import { DashboardErrorBoundary } from '@/features/dashboard/components/common/error/DashboardErrorBoundary';
import { ErrorDisplay } from '@/features/dashboard/components/common/error/ErrorDisplay';
import { DashboardSkeleton } from '@/features/dashboard/components/common/loading/Skeletons';
import { DashboardHeader } from '@/features/dashboard/components/layout/DashboardHeader';
import { useDashboardStore } from '@/features/dashboard/store/useDashboardStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { FeatureCollection, Point } from 'geojson';
import { Suspense, useMemo } from 'react';

/**
 * DashboardPage
 * Main entry point for the dashboard feature.
 * Refactored to use Zustand global state management.
 */
export function DashboardPage() {
  // Get dashboard state from Zustand store
  const viewMode = useDashboardStore((state) => state.activeView);
  const setViewMode = useDashboardStore((state) => state.setActiveView);
  const selectedCompanies = useDashboardStore((state) => state.selectedCompanies);
  const isDataLoading = useDashboardStore((state) => state.isDataLoading);

  // Selected businesses as array
  const selectedBusinesses = useMemo<CompanyProperties[]>(() => {
    return Object.values(selectedCompanies);
  }, [selectedCompanies]);

  // TODO: Implement these functions
  const prefetchViewData = async (view: typeof viewMode) => {
    console.log(`Prefetching data for view: ${view}`);
    // Implementation will come in future refactoring
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <DashboardHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        fetchViewData={prefetchViewData}
        onViewModeChange={setViewMode}
      />

      <DashboardErrorBoundary
        componentName="DashboardContent"
        fallback={
          <ErrorDisplay
            message="The dashboard encountered an unexpected error"
            showDetails={process.env.NODE_ENV === 'development'}
            error={undefined}
          />
        }
      >
        <Suspense fallback={<DashboardSkeleton />}>
          {/* ViewSwitcher will be added in a future refactoring step */}
        </Suspense>
      </DashboardErrorBoundary>
    </div>
  );
}
