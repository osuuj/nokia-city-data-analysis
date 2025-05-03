'use client';

import type { AddressType, CompanyProperties } from '@/features/dashboard/types';
import type { FeatureCollection, Point } from 'geojson';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';

interface UseMapDataProps {
  geojson: FeatureCollection<Point, CompanyProperties & { addressType?: AddressType }>;
  searchTerm?: string;
  selectedBusinesses?: CompanyProperties[];
}

interface UseMapDataResult {
  filteredGeoJSON: FeatureCollection<Point, CompanyProperties & { addressType?: AddressType }>;
  isLoading: boolean;
  selectedFeatureIds: Set<string>;
  flyToLocation: (coordinates: [number, number], zoom?: number) => void;
  setMapRef: (ref: MapRef | null) => void;
}

/**
 * Custom hook for map data handling
 * Handles filtering, selection state, and map interactions
 */
export function useMapData({
  geojson,
  searchTerm = '',
  selectedBusinesses = [],
}: UseMapDataProps): UseMapDataResult {
  const [isLoading, setIsLoading] = useState(false);
  const [mapRef, setMapRef] = useState<MapRef | null>(null);

  // Create a set of selected business IDs for quick lookup
  const selectedFeatureIds = useMemo(() => {
    return new Set(selectedBusinesses.map((business) => business.business_id));
  }, [selectedBusinesses]);

  // Filter GeoJSON based on search term
  const filteredGeoJSON = useMemo(() => {
    if (!searchTerm) return geojson;

    const lowercaseSearchTerm = searchTerm.toLowerCase();

    // Create a new GeoJSON with filtered features
    return {
      ...geojson,
      features: geojson.features.filter((feature) => {
        const properties = feature.properties;
        return (
          properties.company_name?.toLowerCase().includes(lowercaseSearchTerm) ||
          properties.business_id?.toLowerCase().includes(lowercaseSearchTerm) ||
          properties.industry_description?.toLowerCase().includes(lowercaseSearchTerm) ||
          properties.industry?.toLowerCase().includes(lowercaseSearchTerm) ||
          properties.addresses?.['Visiting address']?.street
            ?.toLowerCase()
            .includes(lowercaseSearchTerm) ||
          properties.addresses?.['Visiting address']?.city
            ?.toLowerCase()
            .includes(lowercaseSearchTerm)
        );
      }),
    };
  }, [geojson, searchTerm]);

  // Handle loading states during filtering
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Function to fly to a specific location on the map
  const flyToLocation = useCallback(
    (coordinates: [number, number], zoom = 14) => {
      if (!mapRef) return;

      mapRef.getMap().flyTo({
        center: coordinates,
        zoom,
        duration: 1000,
      });
    },
    [mapRef],
  );

  return {
    filteredGeoJSON,
    isLoading,
    selectedFeatureIds,
    flyToLocation,
    setMapRef,
  };
}
