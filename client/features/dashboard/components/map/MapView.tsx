'use client';

import { FeatureCardList } from '@/features/dashboard/components/controls/FeatureCardList';
import { filters } from '@/features/dashboard/data/filters';
import type { AddressType, CompanyProperties } from '@/features/dashboard/types';
import { Spinner } from '@heroui/react';
import type { FeatureCollection, Point } from 'geojson';
import type { GeoJSONSource } from 'mapbox-gl';
import type mapboxgl from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxMap from 'react-map-gl/mapbox';

export interface MapViewProps {
  geojson: FeatureCollection<Point, CompanyProperties & { addressType?: AddressType }>;
  selectedBusinesses?: CompanyProperties[];
}

export function MapView({ geojson, selectedBusinesses }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<mapboxgl.MapboxGeoJSONFeature[]>([]);
  const [activeFeature, setActiveFeature] = useState<mapboxgl.MapboxGeoJSONFeature | null>(null);

  const { theme } = useTheme();

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

  const mapStyle = useMemo(
    () =>
      theme === 'dark'
        ? 'mapbox://styles/superjuuso/cm8q7y3c9000k01s50vbwbaeq'
        : 'mapbox://styles/superjuuso/cm8q81zh1008q01qq6r334txd',
    [theme],
  );

  const activeBusinessId = activeFeature?.properties?.business_id ?? null;

  const selectedColor = useMemo(() => {
    const letter = activeFeature?.properties?.industry_letter;
    const option = filters
      .find((f) => f.key === 'industries')
      ?.options.find((o) => o.value === letter)?.color;
    if (typeof option === 'string') return option;
    if (option && typeof option === 'object') return theme === 'dark' ? option.dark : option.light;
    return '#9C27B0';
  }, [activeFeature, theme]);

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['company-icons', 'multi-marker-icons', 'cluster-count-layer'],
    });
    if (features.length === 0) {
      setSelectedFeatures([]);
      setActiveFeature(null);
      return;
    }
    const clicked = features[0];
    if ('cluster_id' in clicked.properties) {
      const source = map.getSource('companies') as GeoJSONSource;
      source.getClusterExpansionZoom(clicked.properties.cluster_id, (err, zoom) => {
        if (err || !clicked.geometry || zoom == null) return;
        const coords = clicked.geometry.coordinates as [number, number];
        map.easeTo({ center: coords, zoom, duration: 500 });
      });
      return;
    }
    setSelectedFeatures(features);
    setActiveFeature(clicked);
  };

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded) return;

    const coordMap = new Map<string, number>();
    for (const f of geojson.features) {
      const coords = f.geometry.coordinates.join(',');
      coordMap.set(coords, (coordMap.get(coords) || 0) + 1);
    }

    const enhancedGeojson = {
      ...geojson,
      features: geojson.features.map((f) => {
        const coords = f.geometry.coordinates.join(',');
        return {
          ...f,
          properties: {
            ...f.properties,
            isOverlapping: (coordMap.get(coords) ?? 0) > 1,
            isActive: f.properties.business_id === activeBusinessId,
            industry_letter: f.properties.industry_letter || 'U',
          },
        };
      }),
    };

    const sourceId = 'companies';
    const source = map.getSource(sourceId);

    if (!source) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: enhancedGeojson,
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
          'text-color': theme === 'dark' ? '#fff' : '#000',
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
      (source as GeoJSONSource).setData(enhancedGeojson);
    }
  }, [mapLoaded, geojson, activeBusinessId, theme, selectedColor]);

  const preferredAddressType = undefined;
  const setPreferredAddressType = () => {};

  return (
    <div className="relative w-full h-full rounded-lg border border-default-200">
      {!mapLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-default-100/80 backdrop-blur">
          <Spinner size="lg" color="primary" />
        </div>
      )}

      {mapboxToken ? (
        <MapboxMap
          ref={mapRef}
          initialViewState={{ longitude: 25.171, latitude: 64.296, zoom: 5 }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapStyle}
          mapboxAccessToken={mapboxToken}
          onLoad={() => setMapLoaded(true)}
          onClick={handleMapClick}
          interactiveLayerIds={['company-icons', 'multi-marker-icons', 'cluster-count-layer']}
          attributionControl={false}
        />
      ) : (
        <div className="p-4">Missing Mapbox token</div>
      )}

      {selectedFeatures.length > 0 && (
        <FeatureCardList
          features={selectedFeatures.map((f) => ({
            type: 'Feature',
            geometry: f.geometry as Point,
            properties: f.properties as CompanyProperties,
          }))}
          activeFeature={
            activeFeature
              ? {
                  type: 'Feature',
                  geometry: activeFeature.geometry as Point,
                  properties: activeFeature.properties as CompanyProperties,
                }
              : null
          }
          onSelect={(f) => {
            const match = selectedFeatures.find(
              (sf) => sf.properties.business_id === f.properties.business_id,
            );
            if (match) setActiveFeature(match);
          }}
          theme={theme || 'light'}
          flyTo={() => {}}
          selectedColor={selectedColor}
        />
      )}
    </div>
  );
}
