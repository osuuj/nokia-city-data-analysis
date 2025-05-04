'use client';

import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { FeatureCollection, Point } from 'geojson';

interface MapViewProps {
  geojson: FeatureCollection<Point, CompanyProperties & { addressType?: string }>;
  selectedBusinesses?: CompanyProperties[];
}

/**
 * Map View component
 * Displays businesses on an interactive map
 */
export function MapView({ geojson, selectedBusinesses = [] }: MapViewProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-default-50 rounded-lg border border-default-200">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Map View</h2>
        <p className="text-default-500">
          Interactive map will display {geojson.features.length} businesses
        </p>
        {selectedBusinesses.length > 0 && (
          <p className="text-sm text-primary">{selectedBusinesses.length} businesses selected</p>
        )}
      </div>
    </div>
  );
}
