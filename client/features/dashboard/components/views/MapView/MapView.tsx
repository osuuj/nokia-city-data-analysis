'use client';

import { FeatureCardList } from '@/features/dashboard/components/controls/FeatureCardList';
import type { AddressType, CompanyProperties } from '@/features/dashboard/types';
import { Spinner } from '@heroui/react';
import type { FeatureCollection, Point } from 'geojson';
import type { GeoJSONSource } from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MapMouseEvent, MapRef } from 'react-map-gl/mapbox';
import MapboxMap from 'react-map-gl/mapbox';

export interface MapViewComponentProps {
  geojson: FeatureCollection<Point, CompanyProperties & { addressType?: AddressType }>;
  selectedBusinesses?: CompanyProperties[];
}

export function MapViewComponent({ geojson, selectedBusinesses = [] }: MapViewComponentProps) {
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<
    Array<{
      geometry: Point;
      properties: CompanyProperties & { addressType?: AddressType };
    }>
  >([]);
  const [activeFeature, setActiveFeature] = useState<{
    geometry: Point;
    properties: CompanyProperties & { addressType?: AddressType };
  } | null>(null);

  // Get theme from next-themes
  const { theme } = useTheme();

  // Get mapbox token from env
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Set map style based on theme
  const mapStyle = useMemo(() => {
    return theme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/light-v11';
  }, [theme]);

  // Selected color based on theme
  const selectedColor = theme === 'dark' ? '#2DD4BF' : '#0EA5E9';

  // Update map when geojson changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Update GeoJSON source
    const map = mapRef.current.getMap();
    const source = map.getSource('companies') as GeoJSONSource | undefined;

    if (source) {
      source.setData(geojson);
    } else {
      // Add source and layers on first load
      map.addSource('companies', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Add company points layer
      map.addLayer({
        id: 'company-icons',
        type: 'circle',
        source: 'companies',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            [
              'in',
              ['get', 'business_id'],
              ['literal', selectedBusinesses.map((b) => b.business_id)],
            ],
            selectedColor,
            theme === 'dark' ? '#94A3B8' : '#64748B',
          ],
          'circle-radius': 6,
          'circle-stroke-width': 1,
          'circle-stroke-color': theme === 'dark' ? '#1E293B' : '#F8FAFC',
        },
      });

      // Add cluster layer
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'companies',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': theme === 'dark' ? '#334155' : '#CBD5E1',
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
          'circle-stroke-width': 1,
          'circle-stroke-color': theme === 'dark' ? '#1E293B' : '#F8FAFC',
        },
      });

      // Add cluster count layer
      map.addLayer({
        id: 'cluster-count-layer',
        type: 'symbol',
        source: 'companies',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': theme === 'dark' ? '#E2E8F0' : '#1E293B',
        },
      });
    }
  }, [geojson, mapLoaded, selectedBusinesses, selectedColor, theme]);

  // Handle map click - show popup for company or expand cluster
  const handleMapClick = (event: MapMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const features = map.queryRenderedFeatures(event.point, {
      layers: ['company-icons', 'multi-marker-icons', 'cluster-count-layer', 'clusters'],
    });

    if (!features.length) {
      setSelectedFeatures([]);
      setActiveFeature(null);
      return;
    }

    const feature = features[0];

    // Handle cluster click
    if (feature.properties?.cluster_id) {
      const clusterId = feature.properties.cluster_id;
      const source = map.getSource('companies') as GeoJSONSource;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom === null || zoom === undefined) return;

        map.easeTo({
          center: (feature.geometry as Point).coordinates as [number, number],
          zoom: zoom + 1,
        });
      });
      return;
    }

    // Handle company click
    if (feature.properties?.business_id) {
      const featuresToShow = features
        .filter((f) => f.properties?.business_id)
        .map((f) => ({
          geometry: f.geometry as Point,
          properties: f.properties as CompanyProperties & { addressType?: AddressType },
        }));

      setSelectedFeatures(featuresToShow);
      setActiveFeature(featuresToShow[0]);
    }
  };

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
          interactiveLayerIds={[
            'company-icons',
            'multi-marker-icons',
            'cluster-count-layer',
            'clusters',
          ]}
          attributionControl={false}
        />
      ) : (
        <div className="p-4">Missing Mapbox token</div>
      )}

      {selectedFeatures.length > 0 && (
        <FeatureCardList
          features={selectedFeatures.map((f) => ({
            type: 'Feature',
            geometry: f.geometry,
            properties: f.properties,
          }))}
          activeFeature={
            activeFeature
              ? {
                  type: 'Feature',
                  geometry: activeFeature.geometry,
                  properties: activeFeature.properties,
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
          flyTo={(coordinates) => {
            if (mapRef.current) {
              mapRef.current.getMap().flyTo({
                center: coordinates as [number, number],
                zoom: 15,
              });
            }
          }}
          selectedColor={selectedColor}
        />
      )}
    </div>
  );
}
