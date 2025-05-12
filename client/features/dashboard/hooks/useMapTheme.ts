'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const [isDark, setIsDark] = useState(resolvedTheme === 'dark');
  const prevThemeRef = useRef(resolvedTheme);

  // Mapbox style URLs from environment variables with fallbacks
  const lightStyle =
    process.env.NEXT_PUBLIC_MAPBOX_STYLE_LIGHT ||
    'mapbox://styles/superjuuso/cm8q81zh1008q01qq6r334txd';
  const darkStyle =
    process.env.NEXT_PUBLIC_MAPBOX_STYLE_DARK ||
    'mapbox://styles/superjuuso/cm8q7y3c9000k01s50vbwbaeq';

  // Get current theme from all sources
  const getCurrentTheme = useCallback(() => {
    // Check DOM first - most accurate for immediate state
    const domTheme = document.documentElement.getAttribute('data-theme');
    if (domTheme === 'light' || domTheme === 'dark') {
      return domTheme;
    }

    // Then localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    // Finally resolvedTheme from next-themes
    return resolvedTheme || 'dark';
  }, [resolvedTheme]);

  // Update theme state when resolvedTheme changes
  useEffect(() => {
    if (resolvedTheme && resolvedTheme !== prevThemeRef.current) {
      console.log('Theme changed from hook:', resolvedTheme);
      setIsDark(resolvedTheme === 'dark');
      prevThemeRef.current = resolvedTheme;
    }
  }, [resolvedTheme]);

  // Handle direct theme change events
  const handleThemeChange = useCallback(() => {
    const newTheme = getCurrentTheme();
    console.log('Map detected theme change:', { newTheme, prevTheme: prevThemeRef.current });

    if (newTheme !== prevThemeRef.current) {
      setIsDark(newTheme === 'dark');
      prevThemeRef.current = newTheme;
    }
  }, [getCurrentTheme]);

  // Listen for theme changes from various sources
  useEffect(() => {
    // Listen for our custom theme change events
    document.addEventListener('themechange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    // Initial theme setup
    const currentTheme = getCurrentTheme();
    setIsDark(currentTheme === 'dark');
    prevThemeRef.current = currentTheme;

    return () => {
      document.removeEventListener('themechange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, [handleThemeChange, getCurrentTheme]);

  // Apply theme-specific styles to map elements
  useEffect(() => {
    // Add a class to all map containers to handle theme transition
    const mapContainers = document.querySelectorAll('.mapboxgl-map');

    for (const container of mapContainers) {
      // Add data-theme attribute for CSS targeting
      container.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  return {
    mapStyle: isDark ? darkStyle : lightStyle,
    textColor: isDark ? '#ffffff' : '#000000',
    isDark,
  };
}
