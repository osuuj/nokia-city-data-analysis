'use client';

import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import type React from 'react';
import { Suspense } from 'react';

// Split view loading component
const SplitViewLoading = () => (
  <div className="p-4">
    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

interface SplitViewProps {
  // Split view specific props will be added here as needed
  children?: React.ReactNode;
}

export const SplitView: React.FC<SplitViewProps> = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage
          title="Split View Error"
          message="There was an error loading the split view data. Please try again later."
        />
      }
    >
      <Suspense fallback={<SplitViewLoading />}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Split View</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-[500px] bg-gray-50 border border-gray-200 rounded-lg">
              {/* Map component will be rendered here */}
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Table component will be rendered here */}
            </div>
            {props.children}
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
