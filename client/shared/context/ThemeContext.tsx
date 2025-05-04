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

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme change with error handling
  const setTheme = useCallback(
    (theme: ThemeType) => {
      try {
        setIsChanging(true);
        setError(null);

        // Add class to disable transitions during theme change
        document.documentElement.classList.add('theme-transition-disabled');

        // Apply theme
        setNextTheme(theme);

        // Apply theme directly to DOM for immediate effect
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);

        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', theme);

          // Dispatch storage event to notify other components
          try {
            const storageEvent = new StorageEvent('storage', {
              key: 'theme',
              newValue: theme,
              oldValue: localStorage.getItem('theme'),
              storageArea: localStorage,
            });
            window.dispatchEvent(storageEvent);
          } catch (e) {
            console.error('Failed to dispatch storage event:', e);
          }
        }
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
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

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
        theme: (resolvedTheme as ThemeType) || defaultTheme,
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
