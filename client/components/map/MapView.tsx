'use client';
import type { Business } from '@/types/business';
import { filters } from '@/utils/filters';
import type { BBox } from 'geojson';
import { useMemo, useRef, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxMap, { Marker, Popup } from 'react-map-gl/mapbox';
import type { PointFeature } from 'supercluster';
import useSupercluster from 'use-supercluster';

export interface MapViewProps {
  businesses: Business[];
}

/**
 * MapView
 * Interactive map displaying business locations using react-map-gl and clustering.
 */
export function MapView({ businesses }: MapViewProps) {
  const [selected, setSelected] = useState<Business | null>(null);
  const [bounds, setBounds] = useState<BBox>();
  const [zoom, setZoom] = useState(4);
  const mapRef = useRef<MapRef | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const industryOptions = filters.find((f) => f.key === 'industries')?.options ?? [];

  function getIndustryMeta(code: string) {
    return industryOptions.find((opt) => opt.value === code);
  }

  // Convert businesses to clusterable points
  const points: PointFeature<{
    cluster: false;
    businessId: string;
    business: Business;
  }>[] = useMemo(() => {
    if (!bounds) return [];

    const [west, south, east, north] = bounds;

    return businesses
      .filter((b) => {
        return (
          b.longitude_wgs84 >= west &&
          b.longitude_wgs84 <= east &&
          b.latitude_wgs84 >= south &&
          b.latitude_wgs84 <= north
        );
      })
      .map((b) => ({
        type: 'Feature' as const,
        properties: {
          cluster: false,
          businessId: b.business_id,
          business: b,
        },
        geometry: {
          type: 'Point',
          coordinates: [b.longitude_wgs84, b.latitude_wgs84],
        },
      }));
  }, [businesses, bounds]);

  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 40, maxZoom: 12 },
  });

  return (
    <MapboxMap
      ref={mapRef}
      initialViewState={{
        longitude: 25.171,
        latitude: 64.296,
        zoom: 4,
      }}
      onLoad={() => {
        setTimeout(() => {
          if (!mapRef.current) return;

          const valid = businesses.filter(
            (b) => b.latitude_wgs84 != null && b.longitude_wgs84 != null,
          );

          if (valid.length === 0) return;

          const fitBounds = valid.reduce(
            (acc, b) => {
              acc[0][0] = Math.min(acc[0][0], b.longitude_wgs84);
              acc[0][1] = Math.min(acc[0][1], b.latitude_wgs84);
              acc[1][0] = Math.max(acc[1][0], b.longitude_wgs84);
              acc[1][1] = Math.max(acc[1][1], b.latitude_wgs84);
              return acc;
            },
            [
              [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
              [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
            ] as [[number, number], [number, number]],
          );

          mapRef.current.fitBounds(fitBounds, {
            padding: 80,
            duration: 1000,
            maxZoom: 13,
          });
        }, 100); // ⏳ Small delay to let map render first
      }}
      onMoveEnd={(e) => {
        const b = e.target.getBounds();
        const z = e.target.getZoom();

        if (!b) return; // ✅ guard

        setBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
        setZoom(z);
      }}
      style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
      mapStyle="mapbox://styles/superjuuso/cm7z31i3n00sn01r11pdkehua"
      mapboxAccessToken={mapboxToken}
      onClick={(e) => {
        if ((e.originalEvent.target as HTMLElement).tagName !== 'IMG') {
          setSelected(null);
        }
      }}
    >
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        if ('cluster' in cluster.properties && cluster.properties.cluster) {
          const pointCount = cluster.properties.point_count;
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              longitude={longitude}
              latitude={latitude}
              anchor="center"
              onClick={() => {
                const expansionZoom = Math.min(zoom + 2, 18);
                mapRef.current?.easeTo({
                  center: [longitude, latitude],
                  zoom: expansionZoom,
                  duration: 600,
                });
              }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shadow-md">
                {pointCount}
              </div>
            </Marker>
          );
        }

        const b: Business = cluster.properties.business;
        const meta = getIndustryMeta(b.industry_letter ?? '');
        const iconCode = meta?.value ?? b.industry_letter ?? 'default';
        const src = `/mapbox-icons/${iconCode}.svg`;

        return (
          <Marker
            key={b.business_id}
            longitude={b.longitude_wgs84}
            latitude={b.latitude_wgs84}
            anchor="bottom"
            onClick={() => setSelected(b)}
          >
            <img
              src={src}
              alt={meta?.title || 'Industry'}
              className="w-6 h-6 drop-shadow-md cursor-pointer"
              style={{ transform: 'translateY(-50%)' }}
            />
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
          <div className="text-sm font-medium text-black bg-white rounded-md shadow-lg p-2 max-w-[220px]">
            <strong className="block text-primary-700 truncate">{selected.company_name}</strong>
            <span className="text-xs text-gray-600">{selected.city}</span>
          </div>
        </Popup>
      )}
    </MapboxMap>
  );
}
