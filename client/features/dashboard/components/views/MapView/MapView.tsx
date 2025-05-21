'use client';

import { useMapTheme } from '@/features/dashboard/hooks/useMapTheme';
import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { Filter as AppFilter, FilterOption } from '@/features/dashboard/types/filters';
import { filters } from '@/features/dashboard/utils/filters';
import { logger } from '@/shared/utils/logger';
import { Spinner } from '@heroui/react';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { ExpressionSpecification, FilterSpecification, GeoJSONSource } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxMap from 'react-map-gl/mapbox';
import { FeatureCardList } from './FeatureCardList';
import { ThemeAwareMapWrapper } from './ThemeAwareMapWrapper';

export interface MapViewProps {
  geojson: FeatureCollection<Point, CompanyProperties>;
  selectedBusinesses?: CompanyProperties[];
  isLoading?: boolean;
  /**
   * Coordinates of the selected city, or undefined/null if no city is selected.
   * When set, the map will fly to this city.
   */
  selectedCityCoords?: { latitude: number; longitude: number } | undefined;
}

export const MapView = ({
  geojson,
  selectedBusinesses: _selectedBusinesses,
  selectedCityCoords,
  isLoading,
}: MapViewProps) => {
  // ======== STATE MANAGEMENT ========
  // Simplify state to the minimum needed
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature<Point, CompanyProperties>[]>([]);
  const [activeFeature, setActiveFeature] = useState<Feature<
    Point,
    CompanyProperties & { addressType?: string }
  > | null>(null);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [isFeatureCardVisible, setIsFeatureCardVisible] = useState(false);
  const [showListView, setShowListView] = useState(false);

  // References
  const mapRef = useRef<MapRef | null>(null);
  const sourceAddedRef = useRef(false);

  // Persistent cache for map state between theme changes
  const dataCache = useRef<{
    geojson: FeatureCollection<Point, CompanyProperties> | null;
    selectedFeatureId: string | null;
    isCardCollapsed: boolean;
    mapPosition: { center?: [number, number]; zoom?: number } | null;
  }>({
    geojson: null,
    selectedFeatureId: null,
    isCardCollapsed: false,
    mapPosition: null,
  });

  // ======== HOOKS AND DERIVED STATE ========
  const { mapStyle, textColor, isDark } = useMapTheme();
  const selectedKeys = useCompanyStore((state) => state.selectedKeys);
  const hasSelections = selectedKeys.size > 0;
  const activeBusinessId = activeFeature?.properties?.business_id ?? null;
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // Filter GeoJSON based on selected keys
  const filteredGeojson = useMemo(() => {
    if (!hasSelections) {
      return geojson;
    }
    return {
      ...geojson,
      features: geojson.features.filter((feature) =>
        selectedKeys.has(feature.properties.business_id),
      ),
    };
  }, [geojson, hasSelections, selectedKeys]);

  // Get color for selected industry
  const selectedColor = useMemo(() => {
    const industryLetter = activeFeature?.properties?.industry_letter;
    const colorConfig = filters
      .find((filter: AppFilter) => filter.key === 'industries')
      ?.options?.find((option: FilterOption) => option.value === industryLetter)?.color;

    if (typeof colorConfig === 'string') {
      return colorConfig;
    }
    if (
      colorConfig &&
      typeof colorConfig === 'object' &&
      'light' in colorConfig &&
      'dark' in colorConfig
    ) {
      return isDark ? colorConfig.dark : colorConfig.light;
    }
    return '#FAFAFA'; // fallback color
  }, [activeFeature, isDark]);

  // Helper to get all features at the same coordinates as the provided feature
  const getFeaturesAtSameLocation = useCallback(
    (feature: Feature<Point, CompanyProperties>) => {
      const [lng, lat] = feature.geometry.coordinates;
      const features = filteredGeojson.features.filter((f) => {
        const [fLng, fLat] = f.geometry.coordinates;
        return Math.abs(fLng - lng) < 0.00001 && Math.abs(fLat - lat) < 0.00001; // Use a small epsilon for float comparison
      });
      return features;
    },
    [filteredGeojson.features],
  );

  // ======== MAP SOURCE AND LAYER MANAGEMENT ========
  // Central function to setup/update map source and layers
  const setupMapSourceAndLayers = useCallback(
    (map: mapboxgl.Map) => {
      if (!map.isStyleLoaded()) {
        return false;
      }

      logger.info('Setting up map source and layers', {
        hasSource: !!map.getSource('visiting-companies'),
        features: filteredGeojson.features.length,
        sourceAdded: sourceAddedRef.current,
      });

      // Get current data with overrides for selected/highlighted states
      const prepareGeoJSON = () => {
        const coordMap = new Map<string, number>();

        // Count overlapping markers
        for (const feature of filteredGeojson.features) {
          const coords = feature.geometry.coordinates.join(',');
          coordMap.set(coords, (coordMap.get(coords) || 0) + 1);
        }

        return {
          ...filteredGeojson,
          features: filteredGeojson.features.map((feature) => ({
            ...feature,
            properties: {
              ...feature.properties,
              isOverlapping: (coordMap.get(feature.geometry.coordinates.join(',')) ?? 0) > 1,
              isActive: feature.properties.business_id === activeBusinessId,
              industry_letter: feature.properties.industry_letter || 'broken',
            },
          })),
        };
      };

      const sourceId = 'visiting-companies';
      const taggedGeojson = prepareGeoJSON();
      const existingSource = map.getSource(sourceId);

      // Source doesn't exist, create it
      if (!existingSource) {
        logger.info('Creating new source and layers', {
          features: taggedGeojson.features.length,
        });

        try {
          // Add the source
          map.addSource(sourceId, {
            type: 'geojson',
            data: taggedGeojson,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          });

          // Add cluster count layer
          map.addLayer({
            id: 'cluster-count-layer',
            type: 'symbol' as const,
            source: sourceId,
            filter: ['has', 'point_count'] as FilterSpecification,
            layout: {
              'text-field': ['get', 'point_count_abbreviated'] as ExpressionSpecification,
              'text-size': 14,
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            },
            paint: {
              'text-color': textColor,
            },
          });

          // Add multiple markers layer
          map.addLayer({
            id: 'multi-marker-icons',
            type: 'symbol' as const,
            source: sourceId,
            filter: ['==', ['get', 'isOverlapping'], true] as FilterSpecification,
            layout: {
              'icon-image': 'multi',
              'icon-size': 1.4,
              'icon-allow-overlap': true,
            },
          });

          // Add individual company markers
          map.addLayer({
            id: 'company-icons',
            type: 'symbol' as const,
            source: sourceId,
            filter: ['==', ['get', 'isOverlapping'], false] as FilterSpecification,
            layout: {
              'icon-image': ['get', 'industry_letter'] as ExpressionSpecification,
              'icon-size': 1.4,
              'icon-allow-overlap': true,
            },
          });

          // Add highlight for active marker
          map.addLayer({
            id: 'active-marker-highlight',
            type: 'circle' as const,
            source: sourceId,
            filter: ['==', ['get', 'isActive'], true] as FilterSpecification,
            paint: {
              'circle-radius': 25,
              'circle-color': selectedColor,
              'circle-opacity': 0.25,
              'circle-blur': 0.2,
              'circle-stroke-color': '#333',
              'circle-stroke-width': 1,
            },
          });

          // Ensure highlight appears below the markers
          map.moveLayer('active-marker-highlight', 'company-icons');
          sourceAddedRef.current = true;
          logger.info('Successfully created source and layers');
          return true;
        } catch (error) {
          logger.error('Error creating map source and layers:', error);
          return false;
        }
      }

      // Source exists, update it
      logger.info('Updating existing source with new data', {
        features: taggedGeojson.features.length,
      });

      try {
        (existingSource as GeoJSONSource).setData(taggedGeojson);
        logger.info('Successfully updated source data');
      } catch (error) {
        logger.error('Error updating source data:', error);
      }

      // Update theme-dependent properties
      if (map.getLayer('cluster-count-layer')) {
        map.setPaintProperty('cluster-count-layer', 'text-color', textColor);
      }

      if (map.getLayer('active-marker-highlight')) {
        map.setPaintProperty('active-marker-highlight', 'circle-color', selectedColor);
      }
      return true;
    },
    [filteredGeojson, activeBusinessId, textColor, selectedColor],
  );

  // ======== MAP EVENT HANDLERS ========
  // Feature selection handlers
  const showFeature = useCallback(
    (feature: Feature<Point, CompanyProperties>, fromListSelection = false) => {
      // For a multi-marker, we need to find all features at the same coordinates
      const featuresAtSameLocation = getFeaturesAtSameLocation(feature);

      // If multiple features at this location AND not coming from list selection,
      // show the list view
      if (featuresAtSameLocation.length > 1 && !fromListSelection) {
        setSelectedFeatures(featuresAtSameLocation);
        setActiveFeature(null); // No specific feature is active yet
        setIsCardCollapsed(false);
        setIsFeatureCardVisible(true);
        setShowListView(true); // Show list view
        dataCache.current.selectedFeatureId = null; // No single feature selected
      } else {
        // Single feature OR selection from list - show details for this specific feature
        setSelectedFeatures(featuresAtSameLocation); // Keep all features in case user wants to go back to list
        setActiveFeature(feature); // Set the active feature to show details for
        setIsCardCollapsed(false);
        setIsFeatureCardVisible(true);
        setShowListView(false); // Turn off list view
        dataCache.current.selectedFeatureId = feature.properties.business_id;
      }
    },
    [getFeaturesAtSameLocation],
  );

  const toggleCardCollapsed = useCallback((collapsed: boolean) => {
    setIsCardCollapsed(collapsed);
    dataCache.current.isCardCollapsed = collapsed;
  }, []);

  const closeFeatureCards = useCallback(() => {
    setSelectedFeatures([]);
    setActiveFeature(null);
    setIsFeatureCardVisible(false);
    dataCache.current.selectedFeatureId = null;
  }, []);

  // Add a ref to track if map is initialized
  const isInitialized = useRef(false);
  const hasAddedSource = useRef(false);

  // Map event handlers
  const handleMapLoad = useCallback(() => {
    logger.info('Map loaded event fired');
    const map = mapRef.current?.getMap();
    if (map) {
      logger.info('Map state:', {
        styleLoaded: map.isStyleLoaded(),
        style: map.getStyle().name,
        initialized: isInitialized.current,
        hasSource: hasAddedSource.current,
      });

      isInitialized.current = true;
      setMapLoaded(true);

      // If we have data when map loads, set it up immediately
      if (filteredGeojson && filteredGeojson.features.length > 0) {
        logger.info('Setting up data on map load', {
          features: filteredGeojson.features.length,
        });
        setupMapSourceAndLayers(map);
      }
    }
  }, [filteredGeojson, setupMapSourceAndLayers]);

  // Add this flag to track theme transitions
  const isThemeChanging = useRef(false);

  // Update handleMapThemeChange to set the flag during transitions
  const handleMapThemeChange = useCallback(
    (newIsDark: boolean) => {
      // Set the theme changing flag
      isThemeChanging.current = true;

      // Store current state
      const map = mapRef.current?.getMap();
      if (map) {
        dataCache.current.mapPosition = {
          center: map.getCenter().toArray() as [number, number],
          zoom: map.getZoom(),
        };
      }

      if (activeFeature) {
        dataCache.current.selectedFeatureId = activeFeature.properties.business_id;
      }

      // CRITICAL: Set this to false to force source re-creation
      sourceAddedRef.current = false;

      // Store the current GeoJSON data
      if (filteredGeojson && filteredGeojson.features.length > 0) {
        dataCache.current.geojson = filteredGeojson;
      }

      // Force a cleanup and reinitialization after theme change
      // This is crucial to ensure the map is properly re-initialized
      setMapLoaded(false);

      // After a short delay, mark the map as loaded to trigger re-initialization
      setTimeout(() => {
        setMapLoaded(true);

        // Allow interactions again after a delay to ensure layers are loaded
        setTimeout(() => {
          isThemeChanging.current = false;
        }, 500);
      }, 150);
    },
    [activeFeature, filteredGeojson],
  );

  // Update handleMapClick to prevent interactions during theme changes and add error handling
  const handleMapClick = useCallback(
    (e: mapboxgl.MapMouseEvent) => {
      // Do nothing if theme is changing
      if (isThemeChanging.current) {
        return;
      }

      const map = mapRef.current?.getMap();
      if (!map) return;

      try {
        // Ensure the map style is loaded before querying features
        if (!map.isStyleLoaded()) {
          logger.info('Map style not fully loaded, ignoring click');
          return;
        }

        // Check if our layers exist before querying
        const layersExist = ['company-icons', 'multi-marker-icons', 'cluster-count-layer'].some(
          (layer) => map.getLayer(layer),
        );

        if (!layersExist) {
          logger.info('Map layers not ready, ignoring click');
          return;
        }

        // Get features at the clicked point
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['company-icons', 'multi-marker-icons', 'cluster-count-layer'],
        });

        if (features.length > 0) {
          const clicked = features[0] as unknown as Feature<
            Point,
            CompanyProperties & { cluster_id?: number; isOverlapping?: boolean }
          >;

          // Handle cluster click
          if ('cluster_id' in clicked.properties && clicked.properties.cluster_id) {
            const source = map.getSource('visiting-companies') as GeoJSONSource;
            if (source) {
              const clusterId = clicked.properties.cluster_id;
              source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err || !clicked.geometry) return;
                const [lng, lat] = clicked.geometry.coordinates as [number, number];
                map.easeTo({ center: [lng, lat], zoom: zoom ?? 10, duration: 500 });
              });
            }
            return;
          }

          // Simplified approach - let showFeature handle multi-markers
          // The fromListSelection=false parameter ensures it shows the list for multi-markers
          showFeature(clicked as Feature<Point, CompanyProperties>, false);
        } else {
          // Clicked on empty space
          setShowListView(false);
          closeFeatureCards();
        }
      } catch (error) {
        // Handle errors gracefully
        logger.error('Error handling map click:', error);
      }
    },
    [closeFeatureCards, showFeature],
  );

  // ======== EFFECTS ========
  // Initial data restoration on mount
  useEffect(() => {
    setIsCardCollapsed(dataCache.current.isCardCollapsed);

    // Try to restore selected feature
    if (dataCache.current.selectedFeatureId && filteredGeojson) {
      const cachedFeature = filteredGeojson.features.find(
        (f) => f.properties.business_id === dataCache.current.selectedFeatureId,
      );

      if (cachedFeature) {
        setSelectedFeatures([cachedFeature]);
        setActiveFeature(cachedFeature);
        setIsFeatureCardVisible(true);
      }
    }
  }, [filteredGeojson]);

  // Clean up on unmount - preserve state
  useEffect(() => {
    return () => {
      if (filteredGeojson?.features.length > 0) {
        dataCache.current.geojson = filteredGeojson;
      }

      if (activeFeature) {
        dataCache.current.selectedFeatureId = activeFeature.properties.business_id;
      }

      dataCache.current.isCardCollapsed = isCardCollapsed;
    };
  }, [filteredGeojson, activeFeature, isCardCollapsed]);

  // Add logging for initial render and data changes
  useEffect(() => {
    logger.info('MapView data changed:', {
      hasData: !!geojson,
      features: geojson?.features.length,
      isLoading,
      mapLoaded,
    });
  }, [geojson, isLoading, mapLoaded]);

  // Main effect for adding/updating map data
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded || !filteredGeojson) {
      logger.info('Map not ready:', {
        hasMap: !!map,
        mapLoaded,
        hasData: !!filteredGeojson,
        features: filteredGeojson?.features.length,
        initialized: isInitialized.current,
        hasSource: hasAddedSource.current,
      });
      return;
    }

    // Only proceed if we have features to show
    if (filteredGeojson.features.length === 0) {
      logger.info('No features to display');
      return;
    }

    logger.info('Attempting to setup map source and layers', {
      styleLoaded: map.isStyleLoaded(),
      hasSource: !!map.getSource('visiting-companies'),
      features: filteredGeojson.features.length,
      initialized: isInitialized.current,
      hasAddedSource: hasAddedSource.current,
    });

    // Function to ensure map source and layers are properly added
    const ensureMapSourceAndLayers = () => {
      if (!isInitialized.current) {
        logger.info('Map not initialized yet, waiting...');
        return;
      }

      if (map.isStyleLoaded()) {
        if (!hasAddedSource.current || !map.getSource('visiting-companies')) {
          const success = setupMapSourceAndLayers(map);
          if (success) {
            hasAddedSource.current = true;
          }
          logger.info('Setup result:', { success, hasAddedSource: hasAddedSource.current });
        } else {
          // Update existing source
          const source = map.getSource('visiting-companies');
          if (source) {
            logger.info('Updating existing source with new data');
            (source as mapboxgl.GeoJSONSource).setData(filteredGeojson);
          }
        }
      } else {
        logger.info('Map style not loaded, waiting for style.load event');
        map.once('style.load', () => {
          logger.info('Style loaded, setting up sources and layers');
          const success = setupMapSourceAndLayers(map);
          if (success) {
            hasAddedSource.current = true;
          }
          logger.info('Setup result after style load:', {
            success,
            hasAddedSource: hasAddedSource.current,
          });
        });
      }
    };

    // Initial setup
    ensureMapSourceAndLayers();

    // Add a more robust styledata handler that ensures sources are added
    const handleStyleData = () => {
      logger.info('Style data event fired');
      if (!map.getSource('visiting-companies')) {
        logger.info('Source missing after style change, recreating');
        hasAddedSource.current = false;
        setupMapSourceAndLayers(map);
      }
    };

    // Add the handler for style changes
    map.on('styledata', handleStyleData);

    // Clean up event handler on unmount
    return () => {
      map.off('styledata', handleStyleData);
    };
  }, [mapLoaded, filteredGeojson, setupMapSourceAndLayers]);

  // Reset source flag when unmounting
  useEffect(() => {
    return () => {
      hasAddedSource.current = false;
    };
  }, []);

  // Reset source when data changes
  useEffect(() => {
    if (isLoading) {
      logger.info('Data loading, resetting source flag');
      sourceAddedRef.current = false;
    }
  }, [isLoading]);

  // Force source recreation when view becomes visible
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (map && mapLoaded && filteredGeojson) {
      logger.info('View became visible, checking source');
      if (!map.getSource('visiting-companies')) {
        sourceAddedRef.current = false;
        setupMapSourceAndLayers(map);
      }
    }
  }, [mapLoaded, filteredGeojson, setupMapSourceAndLayers]);

  // Fly to selected city if coordinates are provided
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !selectedCityCoords) return;

    map.flyTo({
      center: [selectedCityCoords.longitude, selectedCityCoords.latitude],
      zoom: 11,
      essential: true,
    });
  }, [selectedCityCoords]);

  // Fly to specific coordinates (used by feature cards)
  const flyTo = useCallback(
    (coords: [number, number], addressType?: string) => {
      const map = mapRef.current?.getMap();
      if (!map || !map.isStyleLoaded()) {
        logger.info('Map not ready for flyTo command');
        return;
      }

      map.flyTo({ center: coords, zoom: 14, duration: 800 });

      // Find and show the feature at these coordinates
      const matching = filteredGeojson.features.find((f) => {
        const [lng, lat] = f.geometry.coordinates;
        const matchesCoords = lng === coords[0] && lat === coords[1];
        const matchesId = activeBusinessId ? f.properties.business_id === activeBusinessId : true;
        const matchesType = addressType ? f.properties.addressType === addressType : true;
        return matchesCoords && matchesId && matchesType;
      });

      if (matching) {
        setShowListView(false); // Turn off list view when flying to a specific feature
        showFeature(matching, true); // Use fromListSelection=true to show details directly
      }
    },
    [filteredGeojson.features, activeBusinessId, showFeature],
  );

  // Determine which layers should be interactive
  const interactiveLayerIds = useMemo(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded) return [];

    return ['company-icons', 'multi-marker-icons', 'cluster-count-layer'].filter((layer) =>
      map.getLayer(layer),
    );
  }, [mapLoaded]);

  // Add this new handler for the "Back to list" button
  const handleBackToList = useCallback(() => {
    // Keep the same features, but clear the active one and show the list
    setActiveFeature(null);
    setShowListView(true);
    dataCache.current.selectedFeatureId = null;
  }, []);

  // Add this function after showFeature and before handleBackToList
  const handleFeatureSelect = useCallback(
    (feature: Feature<Point, CompanyProperties>) => {
      // When a feature is selected from the list, pass true to indicate it's from list selection
      showFeature(feature, true);
    },
    [showFeature],
  );

  // Show loading state ONLY when loading AND no data available
  if (isLoading && (!geojson || geojson.features.length === 0)) {
    return (
      <div className="relative w-full h-full min-h-[70vh] bg-default-50/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-default-500">Loading map data...</p>
          </div>
        </div>
      </div>
    );
  }

  // ======== RENDER ========
  return (
    <div className="relative w-full h-full">
      <ThemeAwareMapWrapper onThemeChange={handleMapThemeChange}>
        <MapboxMap
          key={`mapbox-${isDark ? 'dark' : 'light'}-${mapStyle}`}
          ref={mapRef}
          mapLib={mapboxgl}
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            latitude: 64.5,
            longitude: 26.0,
            zoom: 5,
          }}
          style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
          mapStyle={mapStyle}
          onLoad={handleMapLoad}
          onClick={handleMapClick}
          interactiveLayerIds={interactiveLayerIds}
          preserveDrawingBuffer={true}
          renderWorldCopies={true}
        />
      </ThemeAwareMapWrapper>

      {isFeatureCardVisible && (activeFeature || showListView) && (
        <FeatureCardList
          features={selectedFeatures}
          activeFeature={activeFeature}
          onSelect={handleFeatureSelect}
          selectedColor={selectedColor}
          isDark={isDark}
          flyTo={flyTo}
          onClose={closeFeatureCards}
          isCollapsed={isCardCollapsed}
          onCollapseChange={toggleCardCollapsed}
          forceListView={showListView}
          onBackToList={handleBackToList}
        />
      )}
    </div>
  );
};
