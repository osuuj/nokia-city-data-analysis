'use client';

import { type ReactNode, createContext, useCallback, useContext, useState } from 'react';

interface LoadingContextType {
  /**
   * Whether the global loading state is active
   */
  isLoading: boolean;
  /**
   * The current loading message
   */
  loadingMessage: string;
  /**
   * Start the loading state with an optional message
   */
  startLoading: (message?: string) => void;
  /**
   * Stop the loading state
   */
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  /**
   * The children to wrap with the loading context
   */
  children: ReactNode;
}

/**
 * LoadingProvider component
 * Provides loading state management to the application
 */
export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const startLoading = useCallback((message = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingMessage,
        startLoading,
        stopLoading,
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
