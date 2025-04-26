import React, { useEffect, useCallback, useMemo } from 'react';
import { DashboardError } from '../components/DashboardError';
import { DashboardFooter } from '../components/DashboardFooter';
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useDashboard } from '../hooks/useDashboard';
import { createLazyComponent, preloadComponents } from '../utils/lazyLoading';

// Lazy load the main content components
const DashboardOverview = createLazyComponent({
  path: 'overview/DashboardOverview',
  componentName: 'DashboardOverview',
});

const DashboardAnalytics = createLazyComponent({
  path: 'analytics/DashboardAnalytics',
  componentName: 'DashboardAnalytics',
});

const DashboardReports = createLazyComponent({
  path: 'reports/DashboardReports',
  componentName: 'DashboardReports',
});

const DashboardSettings = createLazyComponent({
  path: 'settings/DashboardSettings',
  componentName: 'DashboardSettings',
});

export const DashboardView: React.FC = React.memo(() => {
  const { state, actions, error, isLoading, activeView } = useDashboard();

  // Preload components that are likely to be needed
  useEffect(() => {
    preloadComponents([
      { path: 'overview/DashboardOverview', componentName: 'DashboardOverview' },
      { path: 'analytics/DashboardAnalytics', componentName: 'DashboardAnalytics' },
    ]);
  }, []);

  // Handle view changes with useCallback
  const handleViewChange = useCallback(
    (view: string) => {
      actions.setActiveView(view);
    },
    [actions],
  );

  // Memoize the active view component
  const ActiveViewComponent = useMemo(() => {
    switch (activeView) {
      case 'overview':
        return DashboardOverview;
      case 'analytics':
        return DashboardAnalytics;
      case 'reports':
        return DashboardReports;
      case 'settings':
        return DashboardSettings;
      default:
        return DashboardOverview;
    }
  }, [activeView]);

  // Memoize the loading spinner
  const LoadingSpinner = useMemo(
    () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    ),
    [],
  );

  if (error) {
    return <DashboardError error={error} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar activeView={activeView} onViewChange={handleViewChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {isLoading ? LoadingSpinner : <ActiveViewComponent />}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
});

// Add display name for debugging
DashboardView.displayName = 'DashboardView';
