'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface LoadingState {
  id: string;
  message?: string;
  type?: 'overlay' | 'inline' | 'full';
  timestamp: number;
}

export interface LoadingContextType {
  isLoading: boolean;
  currentLoadingState: LoadingState | null;
  startLoading: (options?: { message?: string; type?: 'overlay' | 'inline' | 'full' }) => string;
  stopLoading: (id: string) => void;
  clearAllLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for the loading context
 *
 * @param props - Provider props
 * @returns JSX.Element
 */
export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);

  const isLoading = loadingStates.length > 0;

  const currentLoadingState =
    loadingStates.length > 0 ? loadingStates[loadingStates.length - 1] : null;

  const startLoading = useCallback(
    (options?: { message?: string; type?: 'overlay' | 'inline' | 'full' }) => {
      const id = `loading-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newLoadingState: LoadingState = {
        id,
        message: options?.message,
        type: options?.type || 'overlay',
        timestamp: Date.now(),
      };

      setLoadingStates((prev) => [...prev, newLoadingState]);
      return id;
    },
    [],
  );

  const stopLoading = useCallback((id: string) => {
    setLoadingStates((prev) => prev.filter((state) => state.id !== id));
  }, []);

  const clearAllLoading = useCallback(() => {
    setLoadingStates([]);
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      currentLoadingState,
      startLoading,
      stopLoading,
      clearAllLoading,
    }),
    [isLoading, currentLoadingState, startLoading, stopLoading, clearAllLoading],
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};
