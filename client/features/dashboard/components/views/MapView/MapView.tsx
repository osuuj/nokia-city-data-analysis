'use client';

import { useMapTheme } from '@/features/dashboard/hooks/useMapTheme';
import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { Filter, FilterOption } from '@/features/dashboard/types/filters';
import { filters } from '@/features/dashboard/utils/filters';
import { logger } from '@/shared/utils/logger';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { GeoJSONSource } from 'mapbox-gl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxMap from 'react-map-gl/mapbox';
import { FeatureCardList } from './FeatureCardList';
import { ThemeAwareMapWrapper } from './ThemeAwareMapWrapper';

export interface MapViewProps {
  geojson: FeatureCollection<Point, CompanyProperties>;
  selectedBusinesses?: CompanyProperties[];
}

export const MapView = ({ geojson, selectedBusinesses }: MapViewProps) => {
  const [selectedFeatures, setSelectedFeatures] = useState<Feature<Point, CompanyProperties>[]>([]);
  const [activeFeature, setActiveFeature] = useState<Feature<
    Point,
    CompanyProperties & { addressType?: string }
  > | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<MapRef | null>(null);

  // Use our custom map theme hook
  const { mapStyle, textColor, isDark } = useMapTheme();

  // Get selected keys directly from store for immediate reactivity
  const selectedKeys = useCompanyStore((state) => state.selectedKeys);
  const hasSelections = selectedKeys.size > 0;

  // Filter geojson based on selected keys from store
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

  // Use the environment variable or a fallback for development
  const mapboxToken =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    'pk.eyJ1Ijoic3VwZXJqdXVzbyIsImEiOiJjbW00dnJueTcxeHZmM3FxbXgyYmgyaHg2In0.nNFxwPP_XXLKQrfmUFoTdw';

  const activeBusinessId = activeFeature?.properties?.business_id ?? null;

  // Get color for the industry based on current theme
  const selectedColor = useMemo(() => {
    const industryLetter = activeFeature?.properties?.industry_letter;
    const colorConfig = filters
      .find((filter: Filter) => filter.key === 'industries')
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

  // Add a data cache reference to preserve GeoJSON across theme changes
  const dataCache = useRef<{
    geojson: FeatureCollection<Point, CompanyProperties> | null;
    markers: Feature<Point, CompanyProperties>[] | null;
  }>({
    geojson: null,
    markers: null,
  });

  // Handle map click event
  const handleMapClick = useCallback((e: mapboxgl.MapMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const features = map.queryRenderedFeatures(e.point, {
      layers: ['company-icons', 'multi-marker-icons', 'cluster-count-layer'],
    }) as unknown as Feature<Point, CompanyProperties & { cluster_id?: number }>[];

    if (features.length > 0) {
      const clicked = features[0];

      if ('cluster_id' in clicked.properties && clicked.properties.cluster_id !== undefined) {
        const source = map.getSource('visiting-companies') as GeoJSONSource;
        const clusterId = clicked.properties.cluster_id;

        if (clusterId == null) return;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !clicked.geometry || zoom == null) return;
          const [lng, lat] = clicked.geometry.coordinates as [number, number];
          map.easeTo({ center: [lng, lat], zoom: zoom ?? 10, duration: 500 });
        });
        return;
      }

      logger.debug('[Click] Set activeFeature:', clicked.properties.company_name);
      setSelectedFeatures(features);
      setActiveFeature(clicked);
    } else {
      setSelectedFeatures([]);
      setActiveFeature(null);
    }
  }, []);

  // Add a cleanup effect to preserve data during remounts
  useEffect(() => {
    // Store original data reference
    if (filteredGeojson && filteredGeojson.features.length > 0) {
      dataCache.current.geojson = filteredGeojson;
    }

    return () => {
      // This cleanup function runs when component unmounts
      logger.debug('MapView unmounting, preserving data state', {
        features: filteredGeojson?.features.length ?? 0,
        selectedFeatures: selectedFeatures.length,
        hasActiveFeature: !!activeFeature,
      });

      // Cache current state before unmounting
      if (filteredGeojson) {
        dataCache.current.geojson = filteredGeojson;
      }
      if (selectedFeatures.length > 0) {
        dataCache.current.markers = selectedFeatures;
      }
    };
  }, [filteredGeojson, selectedFeatures, activeFeature]);

  // Handle map load event with improved error handling
  const handleMapLoad = useCallback(() => {
    logger.debug('Map loaded event fired', {
      cachedData: !!dataCache.current.geojson,
      selectedMarkers: dataCache.current.markers?.length ?? 0,
    });
    const map = mapRef.current?.getMap();

    if (!map) {
      logger.warn('Map reference not available');
      return;
    }

    // Clean up existing listener first
    map.off('style.load', () => {});

    // Add style.load listener with proper error handling
    const onStyleLoad = () => {
      logger.debug('Map style.load event fired');
      try {
        // Set mapLoaded to true immediately to trigger data reload
        setMapLoaded(true);

        // Restore selected features if available in cache
        if (dataCache.current.markers && dataCache.current.markers.length > 0) {
          setTimeout(() => {
            logger.debug('Restoring selected features after style load');
            // Fix non-null assertion with proper null check
            const cachedMarkers = dataCache.current.markers;
            if (cachedMarkers) {
              setSelectedFeatures(cachedMarkers);
              // If there was an active feature, restore it
              if (activeFeature) {
                setActiveFeature(activeFeature);
              }
            }
          }, 100);
        }
      } catch (error) {
        logger.error('Error in style.load handler:', error);
      }
    };

    map.on('style.load', onStyleLoad);

    // If the style is already loaded, trigger immediately
    if (map.isStyleLoaded()) {
      logger.debug('Style already loaded, setting mapLoaded = true immediately');
      setMapLoaded(true);
    } else {
      logger.debug('Style not yet loaded, waiting for style.load event');
    }
  }, [activeFeature]);

  // Clean up map event listeners
  useEffect(() => {
    return () => {
      const map = mapRef.current?.getMap();
      if (map) {
        logger.debug('Cleaning up map event listeners');
        map.off('style.load', () => {});
      }
    };
  }, []);

  // Create a handler for theme changes from the wrapper
  const handleMapThemeChange = useCallback(
    (newIsDark: boolean) => {
      logger.debug('Map received theme change notification:', newIsDark, {
        dataPresent: !!dataCache.current.geojson,
        featureCount: dataCache.current.geojson?.features.length ?? 0,
      });

      // Cache the current data before resetting state
      if (filteredGeojson && filteredGeojson.features.length > 0) {
        dataCache.current.geojson = filteredGeojson;
      }
      if (selectedFeatures.length > 0) {
        dataCache.current.markers = selectedFeatures;
      }

      // Force reload sources on next render
      setMapLoaded(false);

      // Add a longer timeout to ensure style is fully loaded first
      const reloadTimer = setTimeout(() => {
        if (mapRef.current?.getMap()) {
          logger.debug('Reloading map sources after theme change with cached data', {
            dataPresent: !!dataCache.current.geojson,
            featureCount: dataCache.current.geojson?.features.length ?? 0,
          });

          // First set map as loaded
          setMapLoaded(true);

          // Then restore any selected features if they were previously selected
          if (dataCache.current.markers && dataCache.current.markers.length > 0) {
            logger.debug('Restoring selected features from cache', {
              count: dataCache.current.markers.length,
            });
            const cachedMarkers = dataCache.current.markers;
            if (cachedMarkers) {
              setSelectedFeatures(cachedMarkers);
              if (activeFeature) {
                setActiveFeature(activeFeature);
              }
            }
          }
        }
      }, 500); // Increase timeout for more reliable loading

      return () => clearTimeout(reloadTimer);
    },
    [filteredGeojson, selectedFeatures, activeFeature],
  );

  // Update map sources and layers when data or theme changes
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded || !filteredGeojson) return;

    logger.debug('Attempting to update map sources and layers', {
      isStyleLoaded: map.isStyleLoaded(),
      hasMarkers: filteredGeojson.features.length,
    });

    // Check if the style is loaded before adding sources
    if (!map.isStyleLoaded()) {
      logger.debug('Map style is not loaded yet, waiting...');

      // Wait for the style to load before adding sources
      const onStyleLoad = () => {
        logger.debug('Style loaded event fired, updating sources');
        updateMapSources(map);
        map.off('style.load', onStyleLoad);
      };

      map.on('style.load', onStyleLoad);
      return;
    }

    // Otherwise, proceed with adding sources
    logger.debug('Map style is loaded, updating sources directly');
    updateMapSources(map);

    function updateMapSources(map: mapboxgl.Map) {
      try {
        // Count overlapping markers
        const coordMap = new Map<string, number>();
        for (const feature of filteredGeojson.features) {
          const coords = feature.geometry.coordinates.join(',');
          coordMap.set(coords, (coordMap.get(coords) || 0) + 1);
        }

        // Tag features with overlap status and active state
        const taggedGeojson: FeatureCollection<
          Point,
          CompanyProperties & { isOverlapping: boolean; isActive: boolean }
        > = {
          ...filteredGeojson,
          features: filteredGeojson.features.map((feature) => {
            const coords = feature.geometry.coordinates.join(',');
            const isOverlapping = (coordMap.get(coords) ?? 0) > 1;
            const isActive = feature.properties.business_id === activeBusinessId;

            if (isActive) {
              logger.debug('[Map] Highlighting feature:', feature.properties.company_name);
            }

            return {
              ...feature,
              properties: {
                ...feature.properties,
                isOverlapping,
                isActive,
                industry_letter: feature.properties.industry_letter || 'broken',
              },
            };
          }),
        };

        // Source and layer setup
        const sourceId = 'visiting-companies';
        const existingSource = map.getSource(sourceId);

        logger.debug('Updating map source', {
          hasExistingSource: !!existingSource,
          featureCount: taggedGeojson.features.length,
          activeBusinessId,
        });

        if (!existingSource) {
          // Initial source and layer creation
          map.addSource(sourceId, {
            type: 'geojson',
            data: taggedGeojson,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          });

          // Add all required layers
          addMapLayers(map, sourceId, textColor, selectedColor as string);
        } else {
          // Update existing source with new data
          (existingSource as GeoJSONSource).setData(taggedGeojson);

          // Update theme-dependent properties
          if (map.getLayer('cluster-count-layer')) {
            map.setPaintProperty('cluster-count-layer', 'text-color', textColor);
          }

          if (map.getLayer('active-marker-highlight')) {
            map.setPaintProperty(
              'active-marker-highlight',
              'circle-color',
              selectedColor as string,
            );
          }
        }
      } catch (error) {
        logger.error('Error updating map:', error);
      }
    }
  }, [mapLoaded, filteredGeojson, activeBusinessId, selectedColor, textColor]);

  // Extract layer creation to a separate function for clarity
  const addMapLayers = (
    map: mapboxgl.Map,
    sourceId: string,
    textColor: string,
    highlightColor: string,
  ) => {
    // Cluster count layer
    map.addLayer({
      id: 'cluster-count-layer',
      type: 'symbol',
      source: sourceId,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-size': 14,
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      },
      paint: {
        'text-color': textColor,
      },
    });

    // Multiple markers at same location
    map.addLayer({
      id: 'multi-marker-icons',
      type: 'symbol',
      source: sourceId,
      filter: ['==', ['get', 'isOverlapping'], true],
      layout: {
        'icon-image': 'multi',
        'icon-size': 1.4,
        'icon-allow-overlap': true,
      },
    });

    // Individual company markers
    map.addLayer({
      id: 'company-icons',
      type: 'symbol',
      source: sourceId,
      filter: ['==', ['get', 'isOverlapping'], false],
      layout: {
        'icon-image': ['get', 'industry_letter'],
        'icon-size': 1.4,
        'icon-allow-overlap': true,
      },
    });

    // Highlight for active marker
    map.addLayer({
      id: 'active-marker-highlight',
      type: 'circle',
      source: sourceId,
      filter: ['==', ['get', 'isActive'], true],
      paint: {
        'circle-radius': 25,
        'circle-color': highlightColor,
        'circle-opacity': 0.25,
        'circle-blur': 0.2,
        'circle-stroke-color': '#333',
        'circle-stroke-width': 1,
      },
    });

    // Ensure highlight appears below the markers
    map.moveLayer('active-marker-highlight', 'company-icons');
  };

  // Fly to a location on the map
  const flyTo = useCallback(
    (coords: [number, number], addressType?: string) => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      map.flyTo({ center: coords, zoom: 14, duration: 800 });

      // Attempt to find the feature that matches the coordinates and address type
      const matching = filteredGeojson.features.find((f) => {
        const [lng, lat] = f.geometry.coordinates;
        const matchesCoords = lng === coords[0] && lat === coords[1];
        const matchesId = activeBusinessId ? f.properties.business_id === activeBusinessId : true;
        const matchesType = addressType ? f.properties.addressType === addressType : true;

        return matchesCoords && matchesId && matchesType;
      });

      if (matching) {
        setActiveFeature(matching);
        setSelectedFeatures([matching]);
      }
    },
    [filteredGeojson.features, activeBusinessId],
  );

  return (
    <div className="relative w-full h-full">
      <ThemeAwareMapWrapper onThemeChange={handleMapThemeChange}>
        <MapboxMap
          key={`mapbox-${isDark ? 'dark' : 'light'}-${mapStyle}`}
          ref={mapRef}
          initialViewState={{ longitude: 25.171, latitude: 64.296, zoom: 5 }}
          style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
          mapStyle={mapStyle}
          mapboxAccessToken={mapboxToken}
          onLoad={handleMapLoad}
          onClick={handleMapClick}
          interactiveLayerIds={['company-icons', 'multi-marker-icons', 'cluster-count-layer']}
          preserveDrawingBuffer={true}
          renderWorldCopies={true}
        />
      </ThemeAwareMapWrapper>

      {(selectedFeatures.length > 0 || dataCache.current.markers?.length) && (
        <FeatureCardList
          features={
            selectedFeatures.length > 0 ? selectedFeatures : dataCache.current.markers || []
          }
          activeFeature={activeFeature}
          onSelect={setActiveFeature}
          selectedColor={selectedColor}
          isDark={isDark}
          flyTo={flyTo}
        />
      )}
    </div>
  );
};
