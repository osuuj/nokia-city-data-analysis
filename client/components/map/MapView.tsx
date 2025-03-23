'use client';
import type { Business } from '@/types/business';
import { filters } from '@/utils/filters';
import { useMemo, useState } from 'react';
import MapboxMap, { Marker, Popup } from 'react-map-gl/mapbox';

export interface MapViewProps {
  businesses: Business[];
}

/**
 * MapView
 * Interactive map displaying business locations using react-map-gl.
 */
export function MapView({ businesses }: MapViewProps) {
  const [selected, setSelected] = useState<Business | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const industryOptions = filters.find((f) => f.key === 'industries')?.options ?? [];

  function getIndustryMeta(code: string) {
    return industryOptions.find((opt) => opt.value === code);
  }

  const markers = useMemo(
    () => businesses.filter((b) => b.latitude_wgs84 != null && b.longitude_wgs84 != null),
    [businesses],
  );

  return (
    <MapboxMap
      initialViewState={{
        longitude: 25.171,
        latitude: 64.296,
        zoom: 4,
      }}
      style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
      mapStyle="mapbox://styles/superjuuso/cm7z31i3n00sn01r11pdkehua"
      mapboxAccessToken={mapboxToken}
    >
      {markers.map((b) => {
        const { longitude_wgs84, latitude_wgs84 } = b;

        return (
          <Marker
            key={b.business_id}
            longitude={b.longitude_wgs84}
            latitude={b.latitude_wgs84}
            anchor="bottom"
            onClick={() => setSelected(b)}
          >
            {(() => {
              const meta = getIndustryMeta(b.industry_letter ?? '');
              const iconCode = meta?.value ?? b.industry_letter ?? 'default';
              const src = `/mapbox-icons/${iconCode}.svg`;
              return (
                <img
                  src={src}
                  alt={meta?.title || 'Industry'}
                  className="w-6 h-6 drop-shadow-md cursor-pointer"
                  style={{ transform: 'translateY(-50%)' }}
                />
              );
            })()}
          </Marker>
        );
      })}

      {selected && selected.longitude_wgs84 != null && selected.latitude_wgs84 != null && (
        <Popup
          longitude={selected.longitude_wgs84}
          latitude={selected.latitude_wgs84}
          anchor="top"
          onClose={() => setSelected(null)}
          closeOnClick={false}
        >
          <div className="text-sm">
            <strong>{selected.company_name}</strong>
            <p>{selected.industry || 'No industry'}</p>
            <p>{selected.city}</p>
          </div>
        </Popup>
      )}
    </MapboxMap>
  );
}
