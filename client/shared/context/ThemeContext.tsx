'use client';

import { useTheme } from 'next-themes';
import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

/**
 * Theme types supported by the application
 */
export type ThemeType = 'light' | 'dark' | 'system';

/**
 * Theme context state interface
 */
interface ThemeContextState {
  /** The current theme */
  theme: ThemeType;
  /** Function to set the theme */
  setTheme: (theme: ThemeType) => void;
  /** Whether the theme is currently loading */
  isLoading: boolean;
  /** Whether the theme is currently changing */
  isChanging: boolean;
  /** Error message if theme change failed */
  error: string | null;
}

/**
 * Theme context interface
 */
interface ThemeContextType extends ThemeContextState {
  /** Function to toggle between light and dark themes */
  toggleTheme: () => void;
  /** Function to reset theme to system default */
  resetTheme: () => void;
}

/**
 * Default theme context value
 */
const defaultThemeContext: ThemeContextType = {
  theme: 'light',
  setTheme: () => {},
  isLoading: true,
  isChanging: false,
  error: null,
  toggleTheme: () => {},
  resetTheme: () => {},
};

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

/**
 * Hook to use the theme context
 * @returns Theme context value
 * @throws Error if used outside of ThemeProvider
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme provider props
 */
interface ThemeProviderProps {
  /** Children to wrap with the theme provider */
  children: React.ReactNode;
  /** Default theme to use */
  defaultTheme?: ThemeType;
  /** Whether to enable system theme detection */
  enableSystem?: boolean;
}

/**
 * Apply theme to DOM and synchronize all systems
 */
export const applyThemeToDOM = (theme: 'light' | 'dark') => {
  // Update DOM
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);

  // Update localStorage
  localStorage.setItem('theme', theme);

  // Force map reloads if they exist
  const mapElements = document.querySelectorAll('.mapboxgl-map');
  for (const map of mapElements) {
    map.setAttribute('data-theme', theme);
  }

  // Broadcast theme change event for components that need to react
  try {
    // Custom event for direct listeners
    const themeChangeEvent = new CustomEvent('themechange', {
      detail: { theme },
    });
    document.dispatchEvent(themeChangeEvent);

    // Storage event for cross-tab synchronization
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Error dispatching theme events', e);
  }
};

/**
 * Theme provider component
 * Provides theme context to the application
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="light" enableSystem={true}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  enableSystem = true,
}) => {
  const { resolvedTheme, setTheme: setNextTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    defaultTheme as 'light' | 'dark',
  );

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);

    // Get existing theme from DOM/localStorage
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const domTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
    const initialTheme = storedTheme || domTheme || 'dark';

    console.log('ThemeProvider: Initial theme detection', {
      storedTheme,
      domTheme,
      initialTheme,
    });

    setCurrentTheme(initialTheme);
    applyThemeToDOM(initialTheme);

    // Listen for changes from other sources
    const handleStorageChange = () => {
      const newTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (newTheme && newTheme !== currentTheme) {
        console.log('ThemeProvider: Theme change from storage', { newTheme });
        setCurrentTheme(newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentTheme]);

  // Handle theme change with error handling
  const setTheme = useCallback(
    (theme: ThemeType) => {
      try {
        setIsChanging(true);
        setError(null);

        // Add class to disable transitions during theme change
        document.documentElement.classList.add('theme-transition-disabled');

        // Apply theme using next-themes
        setNextTheme(theme);

        // Apply theme directly to DOM
        const effectiveTheme =
          theme === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
            : (theme as 'light' | 'dark');

        applyThemeToDOM(effectiveTheme);
        setCurrentTheme(effectiveTheme);

        console.log('ThemeProvider: Theme set', { theme, effectiveTheme });
      } catch (err) {
        setError(`Failed to set theme: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        // Small timeout to re-enable transitions after theme is applied
        setTimeout(() => {
          setIsChanging(false);
          document.documentElement.classList.remove('theme-transition-disabled');
        }, 100);
      }
    },
    [setNextTheme],
  );

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [currentTheme, setTheme]);

  // Reset theme to system default
  const resetTheme = useCallback(() => {
    setTheme('system');
  }, [setTheme]);

  // If not mounted, render children without theme context
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme as ThemeType,
        setTheme,
        isLoading: !mounted,
        isChanging,
        error,
        toggleTheme,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
