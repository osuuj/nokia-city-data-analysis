'use client';

import { FeatureCardList } from '@/components/ui/Card';
import type { CompanyProperties } from '@/types';
import { filters } from '@/utils';
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
  const [activeFeature, setActiveFeature] = useState<Feature<Point, CompanyProperties> | null>(
    null,
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<MapRef | null>(null);
  const { theme } = useTheme();

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const mapStyle =
    theme === 'dark'
      ? 'mapbox://styles/superjuuso/cm8q7y3c9000k01s50vbwbaeq'
      : 'mapbox://styles/superjuuso/cm8q81zh1008q01qq6r334txd';

  const selectedColor = useMemo(() => {
    const industryLetter = activeFeature?.properties?.industry_letter;
    const color = filters
      .find((filter) => filter.key === 'industries')
      ?.options?.find((option) => option.value === industryLetter)?.color;
    return color || '#fafafa';
  }, [activeFeature]);

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

      setSelectedFeatures(features);
      setActiveFeature(null);
    } else {
      setSelectedFeatures([]);
      setActiveFeature(null);
    }
  };

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded || !geojson) return;

    // Generate taggedGeojson (inline, no useMemo)
    const coordMap = new Map<string, number>();
    for (const feature of geojson.features) {
      const coords = feature.geometry.coordinates.join(',');
      coordMap.set(coords, (coordMap.get(coords) || 0) + 1);
    }

    const taggedGeojson: FeatureCollection<Point, CompanyProperties & { isOverlapping: boolean }> =
      {
        ...geojson,
        features: geojson.features.map((feature) => {
          const coords = feature.geometry.coordinates.join(',');
          return {
            ...feature,
            properties: {
              ...feature.properties,
              isOverlapping: (coordMap.get(coords) ?? 0) > 1,
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
          'text-color': '#ffffff',
        },
      });

      map.addLayer({
        id: 'multi-marker-icons',
        type: 'symbol',
        source: sourceId,
        filter: ['==', ['get', 'isOverlapping'], true],
        layout: {
          'icon-image': 'multi',
          'icon-size': 1.6,
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
    } else {
      (existingSource as GeoJSONSource).setData(taggedGeojson);
    }
  }, [mapLoaded, geojson]);

  return (
    <div className="relative w-full h-full">
      <MapboxMap
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
        />
      )}
    </div>
  );
};
