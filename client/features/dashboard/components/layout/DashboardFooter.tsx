'use client';

import clsx from 'clsx';

interface DashboardFooterProps {
  className?: string;
}

/**
 * Dashboard footer component
 * Displays copyright information and year at the bottom of the dashboard
 */
export function DashboardFooter({ className }: DashboardFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={clsx('w-full py-3 px-4 bg-background flex items-center justify-center', className)}
    >
      <div className="text-sm text-default-500">© {currentYear} Osuuj Data Analysis</div>
    </footer>
  );
}
