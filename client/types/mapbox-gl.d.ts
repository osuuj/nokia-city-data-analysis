// Extend the mapbox-gl module to include the workerUrl property
import type * as mapboxgl from 'mapbox-gl';

declare module 'mapbox-gl' {
  export interface MapboxGlobal {
    workerUrl: string;
  }
}

// Extend the window object to include mapboxgl
declare global {
  interface Window {
    mapboxgl: typeof mapboxgl & {
      workerUrl: string;
    };
  }
}
