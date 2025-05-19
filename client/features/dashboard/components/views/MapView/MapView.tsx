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

export const MapView = ({ geojson, selectedBusinesses: _selectedBusinesses }: MapViewProps) => {
  // State for feature selection
  const [selectedFeatures, setSelectedFeatures] = useState<Feature<Point, CompanyProperties>[]>([]);
  const [activeFeature, setActiveFeature] = useState<Feature<
    Point,
    CompanyProperties & { addressType?: string }
  > | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const mapRef = useRef<MapRef | null>(null);

  // Flag to track if a feature card is visible
  const [isFeatureCardVisible, setIsFeatureCardVisible] = useState(false);

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

  // Use the environment variable for Mapbox token
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!mapboxToken && process.env.NODE_ENV === 'development') {
    // We could show a console warning in development if needed
  }

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
    isCardCollapsed: boolean;
    visibleFeatureId: string | null;
  }>({
    geojson: null,
    markers: null,
    isCardCollapsed: false,
    visibleFeatureId: null,
  });

  // Function to show a specific feature
  const showFeature = useCallback((feature: Feature<Point, CompanyProperties>) => {
    setSelectedFeatures([feature]);
    setActiveFeature(feature);
    setIsCardCollapsed(false);
    setIsFeatureCardVisible(true);

    // Update cache
    dataCache.current.visibleFeatureId = feature.properties.business_id;
    dataCache.current.isCardCollapsed = false;
  }, []);

  // Function to toggle card collapsed state
  const toggleCardCollapsed = useCallback((collapsed: boolean) => {
    setIsCardCollapsed(collapsed);

    // Update cache
    dataCache.current.isCardCollapsed = collapsed;
  }, []);

  // Function to close feature cards
  const closeFeatureCards = useCallback(() => {
    setSelectedFeatures([]);
    setActiveFeature(null);
    setIsFeatureCardVisible(false);

    // Update cache
    dataCache.current.visibleFeatureId = null;
  }, []);

  // Simplified map click handler
  const handleMapClick = useCallback(
    (e: mapboxgl.MapMouseEvent) => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      // Get rendered features at the clicked point
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['company-icons', 'multi-marker-icons', 'cluster-count-layer'],
      });

      // Check if we clicked a feature
      if (features.length > 0) {
        const clicked = features[0] as unknown as Feature<
          Point,
          CompanyProperties & { cluster_id?: number }
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

        // Show the feature card for this marker
        showFeature(clicked as Feature<Point, CompanyProperties>);
      } else {
        // Clicked on the map but not on a marker
        closeFeatureCards();
      }
    },
    [closeFeatureCards, showFeature],
  );

  // Separate effect to restore the collapsed state only on mount
  useEffect(() => {
    // Only restore on mount, not on every render
    setIsCardCollapsed(dataCache.current.isCardCollapsed);

    // If we had a visible feature, try to restore it
    if (dataCache.current.visibleFeatureId && filteredGeojson) {
      const cachedFeature = filteredGeojson.features.find(
        (f) => f.properties.business_id === dataCache.current.visibleFeatureId,
      );

      if (cachedFeature) {
        setSelectedFeatures([cachedFeature]);
        setActiveFeature(cachedFeature);
        setIsFeatureCardVisible(true);
      }
    }
  }, [filteredGeojson]);

  // Preserve data during remounts
  useEffect(() => {
    return () => {
      // This cleanup function runs when component unmounts

      // Cache current state
      if (filteredGeojson && filteredGeojson.features.length > 0) {
        dataCache.current.geojson = filteredGeojson;
      }

      if (selectedFeatures.length > 0) {
        dataCache.current.markers = selectedFeatures;
      }

      dataCache.current.isCardCollapsed = isCardCollapsed;

      if (activeFeature) {
        dataCache.current.visibleFeatureId = activeFeature.properties.business_id;
      }
    };
  }, [filteredGeojson, selectedFeatures, isCardCollapsed, activeFeature]);

  // Handle map load event
  const handleMapLoad = useCallback(() => {
    console.log('🗺️ Map loaded!');
    setMapLoaded(true);
  }, []);

  // Create a handler for theme changes
  const handleMapThemeChange = useCallback((_newIsDark: boolean) => {
    setMapLoaded(false);

    // Force reload sources on next render
    setTimeout(() => {
      setMapLoaded(true);
    }, 500);
  }, []);

  // Update map sources and layers when data or theme changes
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded || !filteredGeojson) return;

    console.log('👷 Adding layers to map...');

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
          map.setPaintProperty('active-marker-highlight', 'circle-color', selectedColor as string);
        }
      }
    } catch (error) {
      // Handle error silently in production
    }
  }, [mapLoaded, filteredGeojson, activeBusinessId, selectedColor, textColor]);

  // Extract layer creation to a separate function for clarity
  const addMapLayers = (
    map: mapboxgl.Map,
    sourceId: string,
    textColor: string,
    highlightColor: string,
  ) => {
    // Add cluster count layer
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

    // Add multiple markers layer
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

    // Add individual company markers
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

    // Add highlight for active marker
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
      if (!map || !map.isStyleLoaded()) {
        logger.debug('Map not ready for flyTo command');
        return;
      }

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
        showFeature(matching);
      }
    },
    [filteredGeojson.features, activeBusinessId, showFeature],
  );

  // Determine which layers should be interactive (only after they're created)
  const interactiveLayerIds = useMemo(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded) return [];

    return ['company-icons', 'multi-marker-icons', 'cluster-count-layer'].filter((layer) =>
      map.getLayer(layer),
    );
  }, [mapLoaded]);

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
          interactiveLayerIds={interactiveLayerIds}
          preserveDrawingBuffer={true}
          renderWorldCopies={true}
        />
      </ThemeAwareMapWrapper>

      {isFeatureCardVisible && activeFeature && (
        <FeatureCardList
          features={selectedFeatures}
          activeFeature={activeFeature}
          onSelect={showFeature}
          selectedColor={selectedColor}
          isDark={isDark}
          flyTo={flyTo}
          onClose={closeFeatureCards}
          isCollapsed={isCardCollapsed}
          onCollapseChange={toggleCardCollapsed}
        />
      )}
    </div>
  );
};
