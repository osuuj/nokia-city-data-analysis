import type React from 'react';
import { createContext, useContext } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import type { DashboardError } from '../types';

interface DashboardState {
  activeView: string;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  error: DashboardError | null;
  isLoading: boolean;
}

interface DashboardActions {
  setActiveView: (view: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setError: (error: DashboardError | null) => void;
  setLoading: (isLoading: boolean) => void;
}

interface DashboardContextType {
  state: DashboardState;
  actions: DashboardActions;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dashboardData = useDashboard();

  const value: DashboardContextType = {
    state: {
      activeView: dashboardData.activeView,
      theme: 'light' as const,
      sidebarCollapsed: false,
      error: dashboardData.error,
      isLoading: dashboardData.isLoading,
    },
    actions: dashboardData.actions as DashboardActions,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};
