'use client';

import type { AddressType, CompanyProperties } from '@/features/dashboard/types';
import type { FeatureCollection, Point } from 'geojson';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';

/**
 * Props for useMapData hook
 */
interface UseMapDataProps {
  /** GeoJSON data containing company locations */
  geojson: FeatureCollection<Point, CompanyProperties & { addressType?: AddressType }>;
  /** Current search term for filtering companies */
  searchTerm?: string;
  /** Array of selected businesses */
  selectedBusinesses?: CompanyProperties[];
  /** Initial map center coordinates */
  initialCenter?: [number, number];
  /** Initial zoom level */
  initialZoom?: number;
}

/**
 * Result interface for useMapData hook
 */
interface UseMapDataResult {
  /** Filtered GeoJSON based on search criteria */
  filteredGeoJSON: FeatureCollection<Point, CompanyProperties & { addressType?: AddressType }>;
  /** Whether the map data is currently loading */
  isLoading: boolean;
  /** Set of selected feature IDs for highlighting */
  selectedFeatureIds: Set<string>;
  /** Function to fly to a specific location on the map */
  flyToLocation: (coordinates: [number, number], zoom?: number) => void;
  /** Function to set the map reference */
  setMapRef: (ref: MapRef | null) => void;
  /** Current map bounds */
  mapBounds: [[number, number], [number, number]] | null;
  /** Function to update map bounds */
  updateMapBounds: () => void;
  /** Function to filter map by a specific industry */
  filterByIndustry: (industry: string | null) => void;
  /** Currently selected industry filter */
  industryFilter: string | null;
  /** Available industries for filtering */
  availableIndustries: string[];
  /** Clustered points count if clustering is enabled */
  clusteredPointsCount: number;
  /** Whether map features are currently loading */
  areFeaturesLoading: boolean;
}

/**
 * Custom hook for map data handling
 * Handles filtering, selection state, map interactions, and industry filtering
 *
 * @param props - Props for the useMapData hook
 * @returns UseMapDataResult object with map state and functions
 */
export function useMapData({
  geojson,
  searchTerm = '',
  selectedBusinesses = [],
  initialCenter = [24.945831, 60.192059], // Helsinki coordinates
  initialZoom = 10,
}: UseMapDataProps): UseMapDataResult {
  const [isLoading, setIsLoading] = useState(false);
  const [areFeaturesLoading, setAreFeaturesLoading] = useState(false);
  const [mapRef, setMapRef] = useState<MapRef | null>(null);
  const [mapBounds, setMapBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [clusteredPointsCount, setClusteredPointsCount] = useState(0);

  // Create a set of selected business IDs for quick lookup
  const selectedFeatureIds = useMemo(() => {
    return new Set(selectedBusinesses.map((business) => business.business_id));
  }, [selectedBusinesses]);

  // Extract all unique industries from the data
  const availableIndustries = useMemo(() => {
    const industries = new Set<string>();

    for (const feature of geojson.features) {
      if (feature.properties.industry) {
        industries.add(feature.properties.industry);
      }
    }

    return Array.from(industries).sort();
  }, [geojson]);

  // Filter GeoJSON based on search term and industry filter
  const filteredGeoJSON = useMemo(() => {
    setAreFeaturesLoading(true);

    // Start with base geojson
    let filtered = geojson;

    // Apply search term filter if provided
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      filtered = {
        ...filtered,
        features: filtered.features.filter((feature) => {
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
    }

    // Apply industry filter if selected
    if (industryFilter) {
      filtered = {
        ...filtered,
        features: filtered.features.filter(
          (feature) => feature.properties.industry === industryFilter,
        ),
      };
    }

    // Count the number of features for clustering information
    setClusteredPointsCount(filtered.features.length);

    // Delay to simulate loading (and avoid blocking the UI)
    setTimeout(() => {
      setAreFeaturesLoading(false);
    }, 50);

    return filtered;
  }, [geojson, searchTerm, industryFilter]);

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

  // Function to update the current map bounds
  const updateMapBounds = useCallback(() => {
    if (!mapRef) return;

    const map = mapRef.getMap();
    if (!map) return;

    try {
      const bounds = map.getBounds();
      if (bounds) {
        setMapBounds([
          [bounds.getWest(), bounds.getSouth()],
          [bounds.getEast(), bounds.getNorth()],
        ]);
      }
    } catch (error) {
      console.error('Error updating map bounds:', error);
    }
  }, [mapRef]);

  // Filter map data by industry
  const filterByIndustry = useCallback((industry: string | null) => {
    setIndustryFilter(industry);
  }, []);

  // Update bounds when map reference changes
  useEffect(() => {
    if (mapRef) {
      try {
        // Set initial view if provided
        const map = mapRef.getMap();
        if (!map) return;

        map.flyTo({
          center: initialCenter,
          zoom: initialZoom,
          duration: 0,
        });

        // Set up event listener for bounds changes
        map.on('moveend', updateMapBounds);

        // Initial bounds update
        updateMapBounds();

        return () => {
          map.off('moveend', updateMapBounds);
        };
      } catch (error) {
        console.error('Error setting up map:', error);
      }
    }
  }, [mapRef, initialCenter, initialZoom, updateMapBounds]);

  return {
    filteredGeoJSON,
    isLoading,
    selectedFeatureIds,
    flyToLocation,
    setMapRef,
    mapBounds,
    updateMapBounds,
    filterByIndustry,
    industryFilter,
    availableIndustries,
    clusteredPointsCount,
    areFeaturesLoading,
  };
}
