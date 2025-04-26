import { Button } from '@heroui/react';
import { AlertCircle } from 'lucide-react';

interface DashboardErrorBoundaryProps {
  error: Error;
}

/**
 * DashboardErrorBoundary component
 *
 * Displays an error message when something goes wrong in the dashboard.
 * Provides a retry button to attempt recovery.
 *
 * @param props - Component props
 * @returns The rendered error boundary
 */
export function DashboardErrorBoundary({ error }: DashboardErrorBoundaryProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <Button variant="bordered" onClick={() => window.location.reload()}>
        Try again
      </Button>
    </div>
  );
}
