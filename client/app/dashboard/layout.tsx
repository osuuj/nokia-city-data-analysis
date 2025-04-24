'use client';

import { DashboardFooter } from '@/features/layout/components/footer/DashboardFooter';
import { SidebarWrapper } from '@/features/layout/components/sidebar/SidebarWrapper';
import { Providers } from '@/providers/Providers';

/**
 * Layout for the `/dashboard` route.
 * Clean layout with sidebar handled internally.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-row w-full">
      <SidebarWrapper />
      <div className="flex-1 flex-grow min-w-0 h-full flex flex-col overflow-y-auto">
        <Providers>
          <main className="flex-1 w-full overflow-y-auto overflow-x-auto p-2 sm:p-3 md:p-4">
            {children}
          </main>
        </Providers>
        <DashboardFooter />
      </div>
    </div>
  );
}
