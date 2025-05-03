import type { TableColumnConfig } from '@/features/dashboard/types';
import type React from 'react';

interface TableSkeletonProps {
  columns: TableColumnConfig[];
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns }) => {
  // Generate random widths for skeleton cells to make it look more natural
  const getRandomWidth = () => {
    const widths = ['w-1/3', 'w-1/2', 'w-2/3', 'w-3/4', 'w-4/5'];
    return widths[Math.floor(Math.random() * widths.length)];
  };

  return (
    <div className="animate-pulse w-full">
      {/* Header row */}
      <div className="flex w-full border-b border-default-100 dark:border-default-800">
        {/* Checkbox column */}
        <div className="flex justify-center items-center w-10 flex-shrink-0 px-1 py-3">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Column headers */}
        {columns.map((column) => (
          <div
            key={column.key as string}
            className={`flex items-center px-4 py-3 ${
              column.key === 'company_name' ? 'flex-1 min-w-[200px]' : 'w-40 flex-shrink-0'
            }`}
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        ))}
      </div>

      {/* Table body rows */}
      {Array(10)
        .fill(0)
        .map((_, rowIndex) => (
          <div
            key={`skeleton-row-${Date.now()}-${rowIndex}`}
            className="flex w-full border-b border-default-100 dark:border-default-800"
          >
            {/* Checkbox column */}
            <div className="flex justify-center items-center w-10 flex-shrink-0 px-1 py-3">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>

            {/* Data cells */}
            {columns.map((column) => (
              <div
                key={`${column.key as string}-${Date.now()}-${rowIndex}`}
                className={`flex items-center px-4 py-3 ${
                  column.key === 'company_name' ? 'flex-1 min-w-[200px]' : 'w-40 flex-shrink-0'
                }`}
              >
                <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${getRandomWidth()}`} />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};
