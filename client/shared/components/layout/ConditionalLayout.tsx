'use client';

import { Footer, Header } from '@/shared/components/layout';
import { PageTransition } from '@/shared/components/layout/PageTransition';
import { usePathname } from 'next/navigation';

/**
 * ConditionalLayout
 * A layout wrapper that hides Header/Footer on specific routes (e.g., `/dashboard`).
 * Uses CSS classes to maintain consistent layout while applying visibility changes.
 *
 * @param children - React children to be wrapped in the layout
 */
export const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith('/dashboard') ?? false;

  return (
    <PageTransition>
      <div className={isDashboardPage ? 'invisible opacity-0 absolute' : 'visible opacity-100'}>
        <Header />
      </div>
      <main className={isDashboardPage ? 'dashboard-main' : 'content-main'}>{children}</main>
      <div className={isDashboardPage ? 'invisible opacity-0 absolute' : 'visible opacity-100'}>
        <Footer />
      </div>
    </PageTransition>
  );
};
