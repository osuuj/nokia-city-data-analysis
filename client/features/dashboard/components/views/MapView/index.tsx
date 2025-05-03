'use client';

import type { AddressType, CompanyProperties } from '@/features/dashboard/types';
import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import type { FeatureCollection, Point } from 'geojson';
import type React from 'react';
import { Suspense } from 'react';
import { MapViewComponent } from './MapView';

// Map view loading component
const MapViewLoading = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-center">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4 mx-auto" />
      <div className="h-64 w-full max-w-3xl bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

interface MapViewProps {
  geojson: FeatureCollection<Point, CompanyProperties & { addressType?: AddressType }>;
  selectedBusinesses?: CompanyProperties[];
}

export const MapView: React.FC<MapViewProps> = ({ geojson, selectedBusinesses = [] }) => {
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
        <div className="w-full h-full">
          <MapViewComponent geojson={geojson} selectedBusinesses={selectedBusinesses} />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
