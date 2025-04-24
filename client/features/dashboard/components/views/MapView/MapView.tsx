'use client';

import { FeatureCardList } from '@/features/dashboard/components/controls/FeatureCardList';
import { filters } from '@/features/dashboard/data/filters';
import type { CompanyProperties } from '@/features/dashboard/types';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { GeoJSONSource } from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxMap from 'react-map-gl/mapbox';

export interface MapViewProps {
  geojson: FeatureCollection<Point, CompanyProperties>;
  selectedBusinesses?: CompanyProperties[];
}

export const MapView = ({ geojson }: MapViewProps) => {
  const [selectedFeatures, setSelectedFeatures] = useState<Feature<Point, CompanyProperties>[]>([]);
  const [activeFeature, setActiveFeature] = useState<Feature<
    Point,
    CompanyProperties & { addressType?: string }
  > | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<MapRef | null>(null);
  const { theme } = useTheme();
  const prevThemeRef = useRef(theme);

  // Reset mapLoaded when theme changes
  useEffect(() => {
    if (prevThemeRef.current !== theme) {
      setMapLoaded(false);
      prevThemeRef.current = theme;
    }
  }, [theme]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const mapStyle =
    theme === 'dark'
      ? 'mapbox://styles/superjuuso/cm8q7y3c9000k01s50vbwbaeq'
      : 'mapbox://styles/superjuuso/cm8q81zh1008q01qq6r334txd';

  const activeBusinessId = activeFeature?.properties?.business_id ?? null;

  const selectedColor = useMemo(() => {
    const industryLetter = activeFeature?.properties?.industry_letter;
    const color = filters
      .find((filter) => filter.key === 'industries')
      ?.options?.find((option) => option.value === industryLetter)?.color;

    // Handle the case where color is an object with light and dark properties
    if (color && typeof color === 'object') {
      return theme === 'dark' ? color.dark : color.light;
    }

    return color || '#FAFAFA'; // fallback color
  }, [activeFeature, theme]);

  // Add theme-dependent text color for clusters
  const clusterTextColor = useMemo(() => {
    return theme === 'dark' ? '#ffffff' : '#000000';
  }, [theme]);

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

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded || !geojson) return;

    const coordMap = new Map<string, number>();
    for (const feature of geojson.features) {
      const coords = feature.geometry.coordinates.join(',');
      coordMap.set(coords, (coordMap.get(coords) || 0) + 1);
    }

    const taggedGeojson: FeatureCollection<
      Point,
      CompanyProperties & { isOverlapping: boolean; isActive: boolean }
    > = {
      ...geojson,
      features: geojson.features.map((feature) => {
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
          'circle-color': selectedColor,
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
        map.setPaintProperty('active-marker-highlight', 'circle-color', selectedColor);
      }
    }
  }, [mapLoaded, geojson, activeBusinessId, selectedColor, clusterTextColor]);

  const flyTo = (coords: [number, number], targetBusinessId?: string, addressType?: string) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.flyTo({ center: coords, zoom: 14, duration: 800 });

    // Attempt to find the feature that matches the coordinates and address type
    const matching = geojson.features.find((f) => {
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
      <MapboxMap
        key={theme}
        ref={mapRef}
        initialViewState={{ longitude: 25.171, latitude: 64.296, zoom: 5 }}
        style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
        mapStyle={mapStyle}
        mapboxAccessToken={mapboxToken}
        onLoad={() => setMapLoaded(true)}
        onClick={handleMapClick}
        interactiveLayerIds={['company-icons', 'multi-marker-icons', 'cluster-count-layer']}
      />

      {selectedFeatures.length > 0 && (
        <FeatureCardList
          features={selectedFeatures}
          activeFeature={activeFeature}
          onSelect={setActiveFeature}
          selectedColor={selectedColor}
          theme={theme}
          flyTo={(coords, addressType) =>
            flyTo(coords, activeFeature?.properties.business_id, addressType)
          }
        />
      )}
    </div>
  );
};
