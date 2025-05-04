'use client';

/**
 * Dashboard footer component
 */
export function DashboardFooter() {
  return (
    <footer className="w-full py-3 px-4 border-t border-divider bg-background flex items-center justify-between">
      <div className="text-sm text-default-500">
        © {new Date().getFullYear()} Nokia City Data Analysis
      </div>
      <div className="text-sm text-default-500">
        <span>Version 1.0.0</span>
      </div>
    </footer>
  );
}
