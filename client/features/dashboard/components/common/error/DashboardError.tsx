import type { DashboardError as DashboardErrorType } from '@/features/dashboard/types/common';
import type React from 'react';

interface DashboardErrorProps {
  error: DashboardErrorType;
}

export const DashboardError: React.FC<DashboardErrorProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-2">{error.message}</p>
        {error.code && <p className="text-sm text-gray-500">Error Code: {error.code}</p>}
      </div>
    </div>
  );
};
