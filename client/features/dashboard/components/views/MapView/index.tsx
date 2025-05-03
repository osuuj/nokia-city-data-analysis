'use client';

import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import type React from 'react';
import { Suspense } from 'react';

// Map view loading component
const MapViewLoading = () => (
  <div className="p-4">
    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
    <div className="h-64 bg-gray-200 rounded animate-pulse" />
  </div>
);

interface MapViewProps {
  // Map specific props will be added here as needed
  children?: React.ReactNode;
}

export const MapView: React.FC<MapViewProps> = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage
          title="Map Error"
          message="There was an error loading the map data. Please try again later."
        />
      }
    >
      <Suspense fallback={<MapViewLoading />}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Map View</h2>
          <div className="h-[600px] bg-gray-50 border border-gray-200 rounded-lg">
            {/* Map component will be rendered here */}
            {props.children}
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
