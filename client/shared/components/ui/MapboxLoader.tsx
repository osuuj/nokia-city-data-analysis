'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Check if the current page is a map-related page that needs Mapbox
 */
function isMapRelatedPage(pathname: string): boolean {
  // Only initialize Mapbox on dashboard pages or other map-related routes
  return pathname.startsWith('/dashboard');
}

/**
 * MapboxLoader
 * Ensures proper initialization of Mapbox GL with CSP compatibility
 * This component now only initializes Mapbox on relevant pages
 */
export function MapboxLoader() {
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only load Mapbox on dashboard or other map-related pages
    if (typeof window !== 'undefined' && isMapRelatedPage(pathname) && !isInitialized) {
      try {
        // This will execute in the browser environment only
        // Dynamically import the mapbox-gl module
        import('mapbox-gl')
          .then(() => {
            // For debugging in development only
            if (process.env.NODE_ENV === 'development') {
              console.debug('Mapbox GL initialized');
            }
            setIsInitialized(true);
          })
          .catch((err) => {
            console.error('Failed to load Mapbox GL:', err);
          });
      } catch (error) {
        console.error('Error initializing Mapbox GL:', error);
      }
    }
  }, [pathname, isInitialized]);

  // This component doesn't render anything
  return null;
}
