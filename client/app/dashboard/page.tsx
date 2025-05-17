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
    // Add dashboard class and apply fixed positioning
    document.body.classList.add('dashboard-page');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    // Clean up function
    return () => {
      document.body.classList.remove('dashboard-page');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  return <DashboardPage />;
}
