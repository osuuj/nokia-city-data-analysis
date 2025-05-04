'use client';

/**
 * Dashboard footer component
 */
export function DashboardFooter() {
  return (
    <footer className="w-full py-3 px-4 bg-background flex items-center justify-center">
      <div className="text-sm text-default-500">
        © {new Date().getFullYear()} Nokia City Data Analysis
      </div>
    </footer>
  );
}
