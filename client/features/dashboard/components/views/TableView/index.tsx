'use client';

import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import type React from 'react';
import { Suspense } from 'react';

// Table view loading component
const TableViewLoading = () => (
  <div className="p-4">
    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
    <div className="space-y-2">
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

interface TableViewProps {
  // Table specific props will be added here as needed
  children?: React.ReactNode;
}

export const TableView: React.FC<TableViewProps> = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage
          title="Table Error"
          message="There was an error loading the table data. Please try again later."
        />
      }
    >
      <Suspense fallback={<TableViewLoading />}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Table View</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Table component will be rendered here */}
            {props.children}
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
