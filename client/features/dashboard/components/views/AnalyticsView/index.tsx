'use client';

import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import type React from 'react';
import { Suspense } from 'react';

// Analytics view loading component
const AnalyticsViewLoading = () => (
  <div className="p-4">
    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

interface AnalyticsViewProps {
  // Analytics specific props will be added here as needed
  children?: React.ReactNode;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage
          title="Analytics Error"
          message="There was an error loading the analytics data. Please try again later."
        />
      }
    >
      <Suspense fallback={<AnalyticsViewLoading />}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Analytics cards will be rendered here */}
            {props.children}
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
