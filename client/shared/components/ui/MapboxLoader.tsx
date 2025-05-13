'use client';

import { useEffect } from 'react';

/**
 * Type definition for MapboxGL with workerUrl property
 * This extends the default module with the property we need to set
 */
interface MapboxGL {
  workerUrl: string;
}

/**
 * MapboxLoader
 * Ensures proper initialization of Mapbox GL with CSP compatibility
 * This component should be included in the layout or any parent component
 * that uses Mapbox GL to ensure proper initialization
 */
export function MapboxLoader() {
  useEffect(() => {
    // Load the CSP-compatible Mapbox GL worker
    if (typeof window !== 'undefined') {
      try {
        // This will execute in the browser environment only
        // Dynamically import the mapbox-gl module
        import('mapbox-gl')
          .then((mapboxgl) => {
            // Set the worker URL to our proxy endpoint
            // This avoids CORS issues by serving the worker from our own domain
            (mapboxgl.default as MapboxGL).workerUrl = '/api/mapbox-worker';

            console.log('Mapbox GL initialized with proxied CSP-compatible worker');
          })
          .catch((err) => {
            console.error('Failed to load Mapbox GL:', err);
          });
      } catch (error) {
        console.error('Error initializing Mapbox GL:', error);
      }
    }
  }, []);

  // This component doesn't render anything
  return null;
}
