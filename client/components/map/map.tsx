'use client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox styles
import { useEffect, useRef } from 'react';

// Define the Location interface
interface Location {
  name: string;
  coordinates: [number, number]; // Tuple with exactly 2 numbers
}

// Define the MapComponent component props
interface MapComponentProps {
  locations: Location[];
}

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not defined');
}
mapboxgl.accessToken = accessToken;

export default function MapComponent({ locations }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/superjuuso/cm7z31i3n00sn01r11pdkehua',
      center: [-74.5, 40],
      zoom: 9,
    });

    for (const location of locations) {
      new mapboxgl.Marker()
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${location.name}</h3>`))
        .addTo(map.current);
    }

    // Resize the map when the window is resized
    const handleResize = () => {
      map.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [locations]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}
