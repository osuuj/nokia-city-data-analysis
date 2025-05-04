'use client';

import { DashboardPage } from '@/features/dashboard/components/common/DashboardPage';
import { useEffect } from 'react';

/**
 * Dashboard page component.
 * Displays an interactive dashboard for exploring city data analytics.
 *
 * @returns {JSX.Element} The rendered dashboard page component
 */
export default function Page(): JSX.Element {
  // Add a class to the body element for dashboard-specific styling
  useEffect(() => {
    // Add both dashboard and theme classes
    document.body.classList.add('dashboard-page');

    // Clean up function
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  return <DashboardPage />;
}
