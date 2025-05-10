'use client';

import { Footer, Header } from '@/shared/components/layout';
import { PageTransition } from '@/shared/components/layout/PageTransition';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * ConditionalLayout
 * A layout wrapper that hides Header/Footer on specific routes (e.g., `/dashboard`).
 *
 * @param children - React children to be wrapped in the layout
 */
export const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith('/dashboard') ?? false;

  // Add dashboard class to body for dashboard pages
  useEffect(() => {
    if (isDashboardPage) {
      document.body.classList.add('dashboard-page');
    } else {
      document.body.classList.remove('dashboard-page');
    }

    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, [isDashboardPage]);

  return (
    <PageTransition>
      {!isDashboardPage && <Header />}
      <main className={isDashboardPage ? 'dashboard-main' : 'content-main'}>{children}</main>
      {!isDashboardPage && <Footer />}
    </PageTransition>
  );
};
