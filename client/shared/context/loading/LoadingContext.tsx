'use client';

import { type ReactNode, createContext, useCallback, useContext, useState } from 'react';

export type LoadingType = 'overlay' | 'inline' | 'skeleton';
export type LoadingPriority = 'high' | 'medium' | 'low';

interface LoadingState {
  isLoading: boolean;
  message: string;
  type: LoadingType;
  priority: LoadingPriority;
}

interface LoadingContextType {
  /**
   * The current loading state
   */
  loadingState: LoadingState;
  /**
   * Start the loading state with configuration
   */
  startLoading: (config?: Partial<LoadingState>) => void;
  /**
   * Stop the loading state
   */
  stopLoading: () => void;
  /**
   * Update the loading message
   */
  updateLoadingMessage: (message: string) => void;
}

const defaultLoadingState: LoadingState = {
  isLoading: false,
  message: 'Loading...',
  type: 'overlay',
  priority: 'medium',
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  /**
   * The children to wrap with the loading context
   */
  children: ReactNode;
}

/**
 * LoadingProvider component
 * Provides responsive loading state management to the application
 */
export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>(defaultLoadingState);

  const startLoading = useCallback((config?: Partial<LoadingState>) => {
    setLoadingState((prev) => ({
      ...prev,
      isLoading: true,
      ...config,
    }));
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingState((prev) => ({
      ...prev,
      isLoading: false,
    }));
  }, []);

  const updateLoadingMessage = useCallback((message: string) => {
    setLoadingState((prev) => ({
      ...prev,
      message,
    }));
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        loadingState,
        startLoading,
        stopLoading,
        updateLoadingMessage,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

/**
 * Hook to use the loading context
 * @throws Error if used outside of LoadingProvider
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
