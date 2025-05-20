'use client';

import { useMapTheme } from '@/features/dashboard/hooks/useMapTheme';
import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { Filter, FilterOption } from '@/features/dashboard/types/filters';
import { filters } from '@/features/dashboard/utils/filters';
import { logger } from '@/shared/utils/logger';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { GeoJSONSource, LayerSpecification } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
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
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [tilesLoaded, setTilesLoaded] = useState(false);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [layersAdded, setLayersAdded] = useState(false);
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

  // Use the environment variable for Mapbox token with validation
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!mapboxToken) {
    console.error('Mapbox access token is required. Please check your environment variables.');
    // You might want to show a user-friendly error message here
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

  // Debug function to check available layers
  const debugMapLayers = useCallback((map: mapboxgl.Map) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        'Available map layers:',
        map.getStyle()?.layers?.map((l) => l.id),
      );
    }
  }, []);

  // Handle map load event and setup
  const handleMapLoad = useCallback(() => {
    console.log('🗺️ Map loaded!');
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Add event listeners with enhanced logging
    const handleStyleLoad = () => {
      console.log('✅ style.load fired');
      setStyleLoaded(true);
    };

    const handleIdle = () => {
      console.log('✅ map idle (tiles loaded)');
      setTilesLoaded(true);
    };

    map.on('style.load', handleStyleLoad);
    map.on('idle', handleIdle);

    // Handle missing style images with detailed logging
    map.on('styleimagemissing', (e) => {
      const id = e.id;
      console.warn('🎨 Image missing:', id);
      map.loadImage(`/images/markers/${id.toLowerCase()}.png`, (err, img) => {
        if (!err && img && !map.hasImage(id)) {
          map.addImage(id, img);
          console.log(`✅ Added missing image: ${id}`);
        } else {
          console.warn(`❌ Failed to load image for ${id}:`, err);
        }
      });
    });

    // Set map as loaded
    setMapLoaded(true);

    // Cleanup function
    return () => {
      map.off('style.load', handleStyleLoad);
      map.off('idle', handleIdle);
    };
  }, []);

  // Simplified map click handler with safe layer checks
  const handleMapClick = useCallback(
    (e: mapboxgl.MapMouseEvent) => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      console.log('🖱️ Map clicked! Checking layers:', {
        company: map.getLayer('company-icons'),
        multi: map.getLayer('multi-marker-icons'),
        cluster: map.getLayer('cluster-count-layer'),
      });

      // Define layer IDs
      const layerIds = {
        companies: 'company-icons',
        multiMarkers: 'multi-marker-icons',
        clusters: 'cluster-count-layer',
      };

      // Check which layers exist and are queryable
      const queryableLayers = Object.values(layerIds).filter((id) => map.getLayer(id));

      if (queryableLayers.length === 0) {
        console.warn('No queryable layers found');
        return;
      }

      // Get rendered features at the clicked point
      const features = map.queryRenderedFeatures(e.point, {
        layers: queryableLayers,
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

  // Create a handler for theme changes with proper style loading check
  const handleMapThemeChange = useCallback((_newIsDark: boolean) => {
    setMapLoaded(false);
    setStyleLoaded(false);
    setTilesLoaded(false);
    setLayersAdded(false);

    // Force reload sources on next render
    setTimeout(() => {
      setMapLoaded(true);
    }, 500);
  }, []);

  // Add a debounce utility with proper typing
  const debounce = <T extends unknown[]>(func: (...args: T) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: T) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Debounced version of setData with proper typing
  const debouncedSetData = useCallback(
    debounce((source: GeoJSONSource, data: FeatureCollection<Point, CompanyProperties>) => {
      source.setData(data);
    }, 300),
    [],
  );

  // Extract layer creation to a separate function for clarity
  const addMapLayers = useCallback(
    (map: mapboxgl.Map, sourceId: string, textColor: string, selectedColor: string) => {
      console.log(`[🧪 addMapLayers] Called for source: ${sourceId}`);
      console.log('🧪 Layers to add:', [
        'company-icons',
        'cluster-count-layer',
        'multi-marker-icons',
        'active-marker-highlight',
      ]);

      try {
        if (!map.getSource(sourceId)) {
          console.warn('⚠️ Source not found:', sourceId);
          return;
        }

        const layers: LayerSpecification[] = [
          {
            id: 'company-icons',
            type: 'symbol',
            source: sourceId,
            filter: ['==', ['get', 'isOverlapping'], false],
            layout: {
              'icon-image': ['get', 'industry_letter'],
              'icon-size': 1.4,
              'icon-allow-overlap': true,
            },
          },
          {
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
          },
          {
            id: 'multi-marker-icons',
            type: 'symbol',
            source: sourceId,
            filter: ['==', ['get', 'isOverlapping'], true],
            layout: {
              'icon-image': 'multi',
              'icon-size': 1.4,
              'icon-allow-overlap': true,
            },
          },
          {
            id: 'active-marker-highlight',
            type: 'circle',
            source: sourceId,
            filter: ['==', ['get', 'isActive'], true],
            paint: {
              'circle-radius': 25,
              'circle-color': selectedColor,
              'circle-opacity': 0.25,
              'circle-blur': 0.2,
              'circle-stroke-color': '#333',
              'circle-stroke-width': 1,
            },
          },
        ];

        for (const layer of layers) {
          console.log(`🔍 Checking layer ${layer.id}`);
          if (!map.getLayer(layer.id)) {
            map.addLayer(layer);
            console.log(`✅ Layer ${layer.id} added!`);
          } else {
            console.log(`ℹ️ Layer ${layer.id} already exists`);
          }
        }

        // Fix z-order
        if (map.getLayer('active-marker-highlight') && map.getLayer('company-icons')) {
          map.moveLayer('active-marker-highlight', 'company-icons');
          console.log('✅ Adjusted z-order: active-marker-highlight moved below company-icons');
        }

        setLayersAdded(true);
      } catch (err) {
        console.error('❌ Error in addMapLayers:', err);
      }
    },
    [],
  );

  // Update map sources and layers when data or theme changes
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();

    const onLoad = () => {
      console.log('🧭 Map loaded');

      // Validate GeoJSON data
      if (!filteredGeojson) {
        console.error('❌ GeoJSON data is undefined');
        return;
      }

      if (!filteredGeojson.type || filteredGeojson.type !== 'FeatureCollection') {
        console.error('❌ Invalid GeoJSON: missing or incorrect "type" property', {
          type: filteredGeojson.type,
        });
        return;
      }

      if (!Array.isArray(filteredGeojson.features)) {
        console.error('❌ Invalid GeoJSON: "features" is not an array', {
          features: filteredGeojson.features,
        });
        return;
      }

      if (filteredGeojson.features.length === 0) {
        console.warn('⚠️ GeoJSON has no features - map will be empty');
      } else {
        console.log('✅ GeoJSON data validated:', {
          featureCount: filteredGeojson.features.length,
          firstFeature: filteredGeojson.features[0],
        });
      }

      const sourceId = 'visiting-companies';
      const geojsonSource: mapboxgl.GeoJSONSourceSpecification = {
        type: 'geojson',
        data: filteredGeojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      };

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, geojsonSource);
        console.log(
          `✅ Source '${sourceId}' added with ${filteredGeojson.features.length} features`,
        );
      } else {
        console.log(
          `ℹ️ Source '${sourceId}' already exists, updating with ${filteredGeojson.features.length} features`,
        );
        (map.getSource(sourceId) as GeoJSONSource).setData(filteredGeojson);
      }

      addMapLayers(map, sourceId, textColor, selectedColor as string);
    };

    map.on('load', onLoad);

    return () => {
      map.off('load', onLoad);
    };
  }, [filteredGeojson, textColor, selectedColor, addMapLayers]);

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
    <div className="relative w-full h-full min-h-[400px]">
      <ThemeAwareMapWrapper onThemeChange={handleMapThemeChange}>
        <MapboxMap
          key={`mapbox-${isDark ? 'dark' : 'light'}-${mapStyle}`}
          ref={mapRef}
          mapLib={mapboxgl}
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            longitude: 0,
            latitude: 30,
            zoom: 2.5,
          }}
          style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
          mapStyle={mapStyle}
          onLoad={handleMapLoad}
          onClick={handleMapClick}
          interactiveLayerIds={interactiveLayerIds}
          preserveDrawingBuffer={true}
          renderWorldCopies={true}
          reuseMaps={true}
          attributionControl={true}
          maxZoom={16}
          minZoom={1}
          cooperativeGestures={true}
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
