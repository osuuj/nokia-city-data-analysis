'use client';

import mapboxgl from 'mapbox-gl';
import type React from 'react';
import { useEffect, useRef } from 'react';

// 🔥 Add Your Own Mapbox Token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

interface Location {
  name: string;
  coordinates: [number, number];
  industry: string;
}

interface MapProps {
  locations: Location[];
}

const MapComponent: React.FC<MapProps> = ({ locations }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/superjuuso/cm7z31i3n00sn01r11pdkehua',
      center: [27.95, 64.48],
      zoom: 3,
    });

    for (const location of locations) {
      new mapboxgl.Marker()
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${location.name}</h3>`))
        .addTo(map);
    }

    return () => map.remove();
  }, [locations]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-md border" />;
};

export default MapComponent;
