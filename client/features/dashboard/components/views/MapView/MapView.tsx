'use client';

import { useMapTheme } from '@/features/dashboard/hooks/useMapTheme';
import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { Filter, FilterOption } from '@/features/dashboard/types/filters';
import { filters } from '@/features/dashboard/utils/filters';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { GeoJSONSource } from 'mapbox-gl';
import { useEffect, useMemo, useRef, useState } from 'react';
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

  // Store theme state in a ref to track changes
  const themeChangeRef = useRef(isDark);

  // Get selected keys directly from store for immediate reactivity
  const selectedKeys = useCompanyStore((state) => state.selectedKeys);
  const hasSelections = selectedKeys.size > 0;

  // Filter geojson based on selectedBusinesses if they exist, or selectedKeys from store
  const filteredGeojson = useMemo(() => {
    // If there are no selections, show all markers
    if (!hasSelections) {
      return geojson;
    }

    // Create a set of selected IDs for faster lookup
    // Use selectedKeys directly from store for immediate reactivity
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
    // Temporary fallback token - should be replaced with your own token
    'pk.eyJ1Ijoic3VwZXJqdXVzbyIsImEiOiJjbW00dnJueTcxeHZmM3FxbXgyYmgyaHg2In0.nNFxwPP_XXLKQrfmUFoTdw';

  const activeBusinessId = activeFeature?.properties?.business_id ?? null;

  // Get color for the industry, ensuring it's always a string based on current theme
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
    return '#FAFAFA'; // fallback yellow
  }, [activeFeature, isDark]);

  // Add theme-dependent text color for clusters
  const clusterTextColor = useMemo(() => {
    return textColor;
  }, [textColor]);

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
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
  };

  // Handle map load event
  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  // Update ref when theme changes
  useEffect(() => {
    if (themeChangeRef.current !== isDark) {
      themeChangeRef.current = isDark;
      setMapLoaded(false);

      // Short timeout to ensure map reloads with new theme
      const timer = setTimeout(() => {
        if (mapRef.current?.getMap()) {
          setMapLoaded(true);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isDark]);

  // Reset map when component mounts
  useEffect(() => {
    // Initial load
    setMapLoaded(false);
  }, []);

  // Update map when filteredGeojson changes
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded || !filteredGeojson) return;

    const coordMap = new Map<string, number>();
    for (const feature of filteredGeojson.features) {
      const coords = feature.geometry.coordinates.join(',');
      coordMap.set(coords, (coordMap.get(coords) || 0) + 1);
    }

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

    const sourceId = 'visiting-companies';
    const existingSource = map.getSource(sourceId);

    if (!existingSource) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: taggedGeojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

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
          'text-color': clusterTextColor,
        },
      });

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

      map.addLayer({
        id: 'active-marker-highlight',
        type: 'circle',
        source: sourceId,
        filter: ['==', ['get', 'isActive'], true],
        paint: {
          'circle-radius': 25,
          'circle-color': selectedColor as string, // Type assertion needed for Mapbox
          'circle-opacity': 0.25,
          'circle-blur': 0.2,
          'circle-stroke-color': '#333',
          'circle-stroke-width': 1,
        },
      });

      map.moveLayer('active-marker-highlight', 'company-icons');
    } else {
      (existingSource as GeoJSONSource).setData(taggedGeojson);

      if (map.getLayer('cluster-count-layer')) {
        map.setPaintProperty('cluster-count-layer', 'text-color', clusterTextColor);
      }

      if (map.getLayer('active-marker-highlight')) {
        map.setPaintProperty('active-marker-highlight', 'circle-color', selectedColor as string);
      }
    }
  }, [mapLoaded, filteredGeojson, activeBusinessId, selectedColor, clusterTextColor]);

  const flyTo = (coords: [number, number], targetBusinessId?: string, addressType?: string) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.flyTo({ center: coords, zoom: 14, duration: 800 });

    // Attempt to find the feature that matches the coordinates and address type
    const matching = filteredGeojson.features.find((f) => {
      const [lng, lat] = f.geometry.coordinates;
      const matchesCoords = lng === coords[0] && lat === coords[1];
      const matchesId = targetBusinessId ? f.properties.business_id === targetBusinessId : true;
      const matchesType = addressType ? f.properties.addressType === addressType : true;

      return matchesCoords && matchesId && matchesType;
    });

    if (matching) {
      setActiveFeature(matching);
      setSelectedFeatures([matching]);
    }
  };

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
          flyTo={(coords: [number, number], addressType?: string) =>
            flyTo(coords, activeFeature?.properties.business_id, addressType)
          }
        />
      )}
    </div>
  );
};
