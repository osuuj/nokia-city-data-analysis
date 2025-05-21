'use client';

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * Loading type options
 */
export type LoadingType = 'spinner' | 'progress' | 'skeleton' | 'overlay';

/**
 * Loading priority options
 */
export type LoadingPriority = 'high' | 'low' | 'auto';

/**
 * Loading state interface
 */
export interface LoadingState {
  /** Whether loading is active */
  isLoading: boolean;
  /** Loading message to display */
  message: string;
  /** Type of loading indicator */
  type: LoadingType;
  /** Priority of the loading state */
  priority: LoadingPriority;
  /** Error message if loading failed */
  error: string | null;
  /** Progress percentage (0-100) */
  progress: number;
  /** Whether the loading state is transitioning */
  isTransitioning: boolean;
}

/**
 * Loading context interface
 */
export interface LoadingContextType {
  /**
   * Start the loading state with configuration
   */
  startLoading: (options?: {
    message?: string;
    type?: LoadingType;
    priority?: LoadingPriority;
  }) => string;
  /**
   * Stop the loading state
   */
  stopLoading: (id: string) => void;
  /**
   * Update the loading message
   */
  updateLoadingMessage: (id: string, message: string) => void;
  /**
   * Update the loading progress
   */
  updateLoadingProgress: (id: string, progress: number) => void;
  /**
   * Set an error in the loading state
   */
  setError: (id: string, error: string) => void;
  /**
   * Reset the loading state
   */
  clearError: (id: string) => void;
  /**
   * Whether loading is active
   */
  isLoading: boolean;
  /**
   * The current loading state
   */
  currentLoadingState: LoadingState | null;
}

/**
 * Default loading state
 */
const defaultLoadingState: LoadingState = {
  isLoading: false,
  message: 'Loading...',
  type: 'spinner',
  priority: 'auto',
  error: null,
  progress: 0,
  isTransitioning: false,
};

/**
 * Loading context
 */
export const LoadingContext = createContext<LoadingContextType | null>(null);

/**
 * Loading provider props
 */
interface LoadingProviderProps {
  /**
   * The children to wrap with the loading context
   */
  children: ReactNode;
  /**
   * Default loading state
   */
  defaultState?: Partial<LoadingState>;
}

// Add a function to detect if we're handling navigation to or from the landing page
const isLandingNavigation = (pathname: string): boolean => {
  // Check if navigating from landing page (/) to another page
  return pathname === '/' || pathname.startsWith('/dashboard');
};

/**
 * LoadingProvider component
 * Provides responsive loading state management to the application
 *
 * @example
 * ```tsx
 * <LoadingProvider defaultState={{ type: 'overlay', priority: 'high' }}>
 *   <App />
 * </LoadingProvider>
 * ```
 */
export function LoadingProvider({ children, defaultState = {} }: LoadingProviderProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    ...defaultLoadingState,
    ...defaultState,
  });

  // Get the current pathname for navigation checks
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);

  // Use a ref to store transition timeouts
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Start loading with the provided configuration
   */
  const startLoading = useCallback(
    (options?: { message?: string; type?: LoadingType; priority?: LoadingPriority }) => {
      if (!isMounted.current) return '';

      // Don't show loading for navigation between landing page and dashboard
      if (isLandingNavigation(pathname)) {
        return '';
      }

      setLoadingState((prev) => ({
        ...prev,
        isLoading: true,
        isTransitioning: true,
        error: null,
        ...options,
      }));

      // Clear any existing transition timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      // Set new transition timeout
      transitionTimeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
          setLoadingState((prev) => ({
            ...prev,
            isTransitioning: false,
          }));
        }
      }, 300);

      return `loading_${Math.random().toString(36).substring(2)}`;
    },
    [pathname],
  );

  /**
   * Stop loading
   */
  const stopLoading = useCallback((_id: string) => {
    if (!isMounted.current) return;

    setLoadingState((prev) => ({
      ...prev,
      isTransitioning: true,
    }));

    // Clear any existing transition timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Set new transition timeout
    transitionTimeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        setLoadingState((prev) => ({
          ...prev,
          isLoading: false,
          isTransitioning: false,
          progress: 0,
        }));
      }
    }, 300);
  }, []);

  /**
   * Update loading message
   */
  const updateLoadingMessage = useCallback((_id: string, message: string) => {
    if (!isMounted.current) return;

    setLoadingState((prev) => ({
      ...prev,
      message,
    }));
  }, []);

  /**
   * Update loading progress
   */
  const updateLoadingProgress = useCallback((_id: string, progress: number) => {
    if (!isMounted.current) return;

    setLoadingState((prev) => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
  }, []);

  /**
   * Set loading error
   */
  const setError = useCallback((_id: string, error: string) => {
    if (!isMounted.current) return;

    setLoadingState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  /**
   * Reset loading state
   */
  const clearError = useCallback(
    (_id: string) => {
      if (!isMounted.current) return;

      setLoadingState({
        ...defaultLoadingState,
        ...defaultState,
      });
    },
    [defaultState],
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      startLoading,
      stopLoading,
      updateLoadingMessage,
      updateLoadingProgress,
      setError,
      clearError,
      isLoading: loadingState.isLoading,
      currentLoadingState: loadingState,
    }),
    [
      startLoading,
      stopLoading,
      updateLoadingMessage,
      updateLoadingProgress,
      setError,
      clearError,
      loadingState,
    ],
  );

  return <LoadingContext.Provider value={contextValue}>{children}</LoadingContext.Provider>;
}

/**
 * Hook to use the loading context
 * @returns Loading context value
 * @throws Error if used outside of LoadingProvider
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
