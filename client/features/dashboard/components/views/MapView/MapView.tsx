'use client';

import { useMapTheme } from '@/features/dashboard/hooks/useMapTheme';
import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { Filter, FilterOption } from '@/features/dashboard/types/filters';
import { filters } from '@/features/dashboard/utils/filters';
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

      console.log('[Click] Set activeFeature:', clicked.properties.company_name);
      setSelectedFeatures(features);
      setActiveFeature(clicked);
    } else {
      setSelectedFeatures([]);
      setActiveFeature(null);
    }
  }, []);

  // Handle map load event with improved error handling
  const handleMapLoad = useCallback(() => {
    console.log('Map loaded event fired');
    const map = mapRef.current?.getMap();

    if (!map) {
      console.error('Map reference not available');
      return;
    }

    // Clean up existing listener first
    map.off('style.load', () => {});

    // Add style.load listener with proper error handling
    const onStyleLoad = () => {
      console.log('Map style.load event fired');
      try {
        // Set a timeout to ensure the style is fully processed
        setTimeout(() => {
          console.log('Setting mapLoaded = true after style load');
          setMapLoaded(true);
        }, 200);
      } catch (error) {
        console.error('Error in style.load handler:', error);
      }
    };

    map.on('style.load', onStyleLoad);

    // If the style is already loaded, trigger immediately
    if (map.isStyleLoaded()) {
      console.log('Style already loaded, setting mapLoaded = true immediately');
      setMapLoaded(true);
    } else {
      console.log('Style not yet loaded, waiting for style.load event');
    }
  }, []);

  // Clean up map event listeners
  useEffect(() => {
    return () => {
      const map = mapRef.current?.getMap();
      if (map) {
        console.log('Cleaning up map event listeners');
        map.off('style.load', () => {});
      }
    };
  }, []);

  // Reset mapLoaded when theme changes
  useEffect(() => {
    console.log('Theme changed, resetting mapLoaded state');
    setMapLoaded(false);
  }, []);

  // Update map sources and layers when data or theme changes
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded || !filteredGeojson) return;

    // Check if the style is loaded before adding sources
    if (!map.isStyleLoaded()) {
      console.log('Map style is not loaded yet, waiting...');

      // Wait for the style to load before adding sources
      const onStyleLoad = () => {
        updateMapSources(map);
        map.off('style.load', onStyleLoad);
      };

      map.on('style.load', onStyleLoad);
      return;
    }

    // Otherwise, proceed with adding sources
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
              console.log('[Map] Highlighting feature:', feature.properties.company_name);
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
          // Update existing source and style properties
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
        console.error('Error updating map:', error);
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
      <ThemeAwareMapWrapper>
        <MapboxMap
          key={`mapbox-${isDark ? 'dark' : 'light'}`}
          ref={mapRef}
          initialViewState={{ longitude: 25.171, latitude: 64.296, zoom: 5 }}
          style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
          mapStyle={mapStyle}
          mapboxAccessToken={mapboxToken}
          onLoad={handleMapLoad}
          onClick={handleMapClick}
          interactiveLayerIds={['company-icons', 'multi-marker-icons', 'cluster-count-layer']}
        />
      </ThemeAwareMapWrapper>

      {selectedFeatures.length > 0 && (
        <FeatureCardList
          features={selectedFeatures}
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
