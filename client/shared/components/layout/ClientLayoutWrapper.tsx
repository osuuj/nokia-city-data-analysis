'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

/**
 * Client component that wraps layout content and manages body classes
 * Allows applying conditional styling without making the root layout a client component
 */
export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Check if we're on dashboard pages
    const isDashboardPage = pathname?.startsWith('/dashboard') ?? false;

    // Add or remove the dashboard-page class based on the current route
    if (isDashboardPage) {
      document.body.classList.add('dashboard-page');
    } else {
      document.body.classList.remove('dashboard-page');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, [pathname]);

  // This component renders its children
  return <>{children}</>;
}
