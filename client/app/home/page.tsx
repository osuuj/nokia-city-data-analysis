'use client';

import dynamic from 'next/dynamic';

// Dynamically import the MapComponent to optimize loading
const MapComponent = dynamic(() => import('@/components/map/map'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

// Define Location interface
interface Location {
  name: string;
  coordinates: [number, number];
  industry: string;
}

// Define locations using the interface
const locations: Location[] = [
  { name: 'Location 1', coordinates: [-74.5, 40], industry: 'Tech' },
  { name: 'Location 2', coordinates: [-74.6, 40.2], industry: 'Tech' },
  { name: 'Location 3', coordinates: [-74.7, 40.4], industry: 'Tech' },
];

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider">
      <div className="flex-1 flex flex-col">
        <h1>My Mapbox Map</h1>
        <div className="relative flex-1 w-full">
          <MapComponent locations={locations} />
        </div>
      </div>
    </div>
  );
}
