import { useCallback, useState } from 'react';
import type { DashboardError } from '../types/common';

interface DashboardState {
  activeView: string;
  isLoading: boolean;
  error: DashboardError | null;
}

interface DashboardActions {
  setActiveView: (view: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: DashboardError | null) => void;
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    activeView: 'overview',
    isLoading: false,
    error: null,
  });

  const actions: DashboardActions = {
    setActiveView: useCallback((view: string) => {
      setState((prev) => ({ ...prev, activeView: view }));
    }, []),

    setLoading: useCallback((loading: boolean) => {
      setState((prev) => ({ ...prev, isLoading: loading }));
    }, []),

    setError: useCallback((error: DashboardError | null) => {
      setState((prev) => ({ ...prev, error }));
    }, []),
  };

  return {
    state,
    actions,
    error: state.error,
    isLoading: state.isLoading,
    activeView: state.activeView,
  };
}
