'use client';

/**
 * Dashboard footer component
 * Displays copyright information and year at the bottom of the dashboard
 */
export function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-3 px-4 bg-background flex items-center justify-center">
      <div className="text-sm text-default-500">© {currentYear} Nokia City Data Analysis</div>
    </footer>
  );
}
