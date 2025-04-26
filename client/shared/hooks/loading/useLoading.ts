import { useCallback, useContext, useEffect, useRef } from 'react';
import { LoadingContext } from '../../context/loading/LoadingContext';
import type { LoadingPriority, LoadingType } from '../../context/loading/LoadingContext';

/**
 * Hook for managing loading states
 * @returns An object containing functions to start and stop loading indicators
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  const loadingIdRef = useRef<string | null>(null);

  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }

  const {
    startLoading,
    stopLoading,
    updateLoadingMessage,
    updateLoadingProgress,
    isLoading,
    currentLoadingState,
  } = context;

  // Memoize the startLoading function to prevent unnecessary re-renders
  const memoizedStartLoading = useCallback(
    (options?: {
      message?: string;
      type?: LoadingType;
      priority?: LoadingPriority;
    }) => {
      const id = startLoading(options);
      loadingIdRef.current = id;
      return id;
    },
    [startLoading],
  );

  // Memoize the stopLoading function to prevent unnecessary re-renders
  const memoizedStopLoading = useCallback(
    (id?: string) => {
      const idToStop = id || loadingIdRef.current;
      if (idToStop) {
        stopLoading(idToStop);
        if (!id) {
          loadingIdRef.current = null;
        }
      }
    },
    [stopLoading],
  );

  // Memoize the updateLoadingMessage function to prevent unnecessary re-renders
  const memoizedUpdateLoadingMessage = useCallback(
    (message: string, id?: string) => {
      const idToUpdate = id || loadingIdRef.current;
      if (idToUpdate) {
        updateLoadingMessage(idToUpdate, message);
      }
    },
    [updateLoadingMessage],
  );

  // Memoize the updateLoadingProgress function to prevent unnecessary re-renders
  const memoizedUpdateLoadingProgress = useCallback(
    (progress: number, id?: string) => {
      const idToUpdate = id || loadingIdRef.current;
      if (idToUpdate) {
        updateLoadingProgress(idToUpdate, progress);
      }
    },
    [updateLoadingProgress],
  );

  // Cleanup function to stop loading when component unmounts
  useEffect(() => {
    return () => {
      if (loadingIdRef.current) {
        stopLoading(loadingIdRef.current);
      }
    };
  }, [stopLoading]);

  return {
    startLoading: memoizedStartLoading,
    stopLoading: memoizedStopLoading,
    updateLoadingMessage: memoizedUpdateLoadingMessage,
    updateLoadingProgress: memoizedUpdateLoadingProgress,
    isLoading,
    currentLoadingState,
  };
}
