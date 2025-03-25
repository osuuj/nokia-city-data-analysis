'use client';

import type { CompanyProperties } from '@/types';
import { Card, CardBody, Link } from '@heroui/react';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { GeoJSONSource } from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxMap, { Popup } from 'react-map-gl/mapbox';

export interface MapViewProps {
  geojson: FeatureCollection<Point, CompanyProperties>;
}

export const MapView = function MapView({ geojson }: MapViewProps) {
  const [selected, setSelected] = useState<Feature<Point, CompanyProperties> | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<MapRef | null>(null);
  const { theme } = useTheme();

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded || !geojson) return;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUV'.split('');

    for (const letter of letters) {
      const url = `/mapbox-icons/${letter}.png`;
      map.loadImage(url, (err, image) => {
        if (err) {
          console.error(`Error loading icon "${letter}":`, err);
          return;
        }
        if (image && !map.hasImage(letter)) {
          map.addImage(letter, image);
        }
      });
    }

    if (!map.getSource('companies')) {
      map.addSource('companies', {
        type: 'geojson',
        data: geojson,
      });

      map.addLayer({
        id: 'company-icons',
        type: 'symbol',
        source: 'companies',
        layout: {
          'icon-image': [
            'case',
            ['has', 'industry_letter'],
            [
              'case',
              ['in', ['get', 'industry_letter'], ['literal', letters]],
              ['get', 'industry_letter'],
              'marker-15',
            ],
            'marker-15',
          ],
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            0.6, // At zoom level 0, icon size is 0.6
            22,
            1.2, // At zoom level 22, icon size is 1.2
          ],
          'icon-allow-overlap': true,
        },
      });
    } else {
      const source = map.getSource('companies');
      if (source && 'setData' in source) {
        (source as GeoJSONSource).setData(geojson);
      }
    }
  }, [mapLoaded, geojson]);

  return (
    <MapboxMap
      ref={mapRef}
      initialViewState={{
        longitude: 25.171,
        latitude: 64.296,
        zoom: 5,
      }}
      style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
      mapStyle="mapbox://styles/superjuuso/cm7z31i3n00sn01r11pdkehua"
      mapboxAccessToken={mapboxToken}
      onLoad={() => setMapLoaded(true)}
      onClick={(e) => {
        const feature = e.features?.[0] as Feature<Point, CompanyProperties> | undefined;
        setSelected(feature?.properties ? feature : null);
      }}
      interactiveLayerIds={['company-icons']}
    >
      {selected?.geometry && (
        <>
          <style>
            {`
              /* Light theme */
              .mapboxgl-popup-content {
                background-color: ${theme === 'dark' ? '#52525b' : 'white'} !important;
                border: 1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'} !important;
              }
              .mapboxgl-popup-tip {
                background-color: transparent !important;
              }
              .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
                border-bottom-color: ${theme === 'dark' ? '#52525b' : 'white'} !important;
              }
              .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
                border-top-color: ${theme === 'dark' ? '#52525b' : 'white'} !important;
              }
              .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
                border-right-color: ${theme === 'dark' ? '#52525b' : 'white'} !important;
              }
              .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
                border-left-color: ${theme === 'dark' ? '#52525b' : 'white'} !important;
              }
              .mapboxgl-popup-close-button {
                color: white;
                font-size: 16px;
                font-weight: bold;
                padding: 5px 10px;
              }
              .mapboxgl-popup-close-button:hover {
                background-color: rgba(0,0,0,0.2);
              }
            `}
          </style>
          <Popup
            longitude={selected.geometry.coordinates[0]}
            latitude={selected.geometry.coordinates[1]}
            anchor="top"
            onClose={() => setSelected(null)}
            closeOnClick={false}
            className={`!p-0 !bg-transparent !shadow-none ${theme === 'dark' ? 'dark' : ''}`}
          >
            <Card className="max-w-[220px] p-0 shadow-small">
              <CardBody className="p-2">
                <strong className="block text-primary truncate">
                  {selected.properties.company_name}
                </strong>
                <span className="text-xs text-default-600">{selected.properties.street}</span>
                <span className="text-xs text-default-600">
                  {selected.properties.street} {selected.properties.building_number}{' '}
                  {selected.properties.entrance}
                </span>
                <span className="text-xs block mt-1 text-default-500">
                  {selected.properties.industry_description}
                </span>
                {selected.properties.website && (
                  <Link
                    href={selected.properties.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs mt-1 underline"
                    color="primary"
                  >
                    {selected.properties.website}
                  </Link>
                )}
              </CardBody>
            </Card>
          </Popup>
        </>
      )}
    </MapboxMap>
  );
};
