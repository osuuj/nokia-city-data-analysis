'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef } from 'react';

interface MapTheme {
  mapStyle: string;
  textColor: string;
  isDark: boolean;
}

/**
 * Custom hook to handle map theme synchronization with the app theme
 * Ensures maps properly react to theme changes without flashing
 */
export function useMapTheme(): MapTheme {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const prevThemeRef = useRef(resolvedTheme);

  // Mapbox style URLs - light and dark versions
  const lightStyle = 'mapbox://styles/superjuuso/cm8q81zh1008q01qq6r334txd';
  const darkStyle = 'mapbox://styles/superjuuso/cm8q7y3c9000k01s50vbwbaeq';

  // Apply theme-specific styles to map elements
  useEffect(() => {
    if (prevThemeRef.current !== resolvedTheme) {
      // Add a class to all map containers to handle theme transition
      const mapContainers = document.querySelectorAll('.mapboxgl-map');
      for (const container of mapContainers) {
        // Add data-theme attribute for CSS targeting
        container.setAttribute('data-theme', isDark ? 'dark' : 'light');
      }

      prevThemeRef.current = resolvedTheme;
    }
  }, [resolvedTheme, isDark]);

  return {
    mapStyle: isDark ? darkStyle : lightStyle,
    textColor: isDark ? '#ffffff' : '#000000',
    isDark,
  };
}
