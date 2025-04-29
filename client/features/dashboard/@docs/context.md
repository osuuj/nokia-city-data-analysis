# Dashboard Context

This document provides information about the React Context providers used in the Dashboard feature.

## Context Overview

While the Dashboard feature primarily uses Zustand for global state management, React Context is used for specific scenarios where prop drilling would be cumbersome, or where state needs to be shared within a specific component tree rather than globally.

## Dashboard Context

### DashboardContext

The main context for sharing dashboard state and actions within the dashboard component tree.

```typescript
import { useDashboardContext } from '@/features/dashboard/context/DashboardContext';

function DashboardFeature() {
  const { state, actions } = useDashboardContext();
  
  return (
    <div>
      <h1>Current View: {state.activeView}</h1>
      <button onClick={() => actions.setActiveView('analytics')}>
        Switch to Analytics
      </button>
    </div>
  );
}
```

#### State Properties

- `activeView`: Currently active dashboard view
- `theme`: Current theme ('light' or 'dark')
- `sidebarCollapsed`: Whether the sidebar is collapsed
- `error`: Current dashboard error, if any
- `isLoading`: Whether dashboard data is loading

#### Actions

- `setActiveView(view: string)`: Changes the active view
- `setTheme(theme: 'light' | 'dark')`: Sets the theme
- `toggleSidebar()`: Toggles the sidebar collapsed state
- `setError(error: DashboardError | null)`: Sets the error state
- `setLoading(isLoading: boolean)`: Sets the loading state

### Implementation

The DashboardContext is implemented using the React Context API with a provider component that manages state using the useDashboard hook.

```typescript
import type React from 'react';
import { createContext, useContext } from 'react';
import { useDashboard } from '../hooks/useDashboard';

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
  
  const value = {
    state: {
      activeView: dashboardData.activeView,
      theme: 'light' as const,
      sidebarCollapsed: false,
      error: dashboardData.error,
      isLoading: dashboardData.isLoading,
    },
    actions: dashboardData.actions,
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
```

## Analytics Context

### AnalyticsContext

Context provider for analytics-specific state and functions.

```typescript
import { useAnalyticsContext } from '@/features/dashboard/context/AnalyticsContext';

function AnalyticsComponent() {
  const { selectedCities, addCity, removeCity } = useAnalyticsContext();
  
  return (
    <div>
      <h2>Selected Cities: {selectedCities.size}</h2>
      <button onClick={() => addCity('Helsinki')}>Add Helsinki</button>
    </div>
  );
}
```

## Map Context

### MapContext

Context provider for map-specific state and functions.

```typescript
import { useMapContext } from '@/features/dashboard/context/MapContext';

function MapControl() {
  const { center, zoom, setCenter, setZoom } = useMapContext();
  
  return (
    <button onClick={() => {
      setCenter([60.1699, 24.9384]); // Helsinki coordinates
      setZoom(10);
    }}>
      Center on Helsinki
    </button>
  );
}
```

## Context Usage Patterns

### Composition with Hooks

Combining context with hooks for cleaner component logic:

```typescript
function useCitySelection() {
  const { selectedCities, addCity, removeCity } = useAnalyticsContext();
  const { isLoading, error } = useCitiesQuery();
  
  return {
    selectedCities,
    addCity,
    removeCity,
    isLoading,
    error
  };
}

function CitySelector() {
  const { selectedCities, addCity, removeCity, isLoading } = useCitySelection();
  // Component logic
}
```

### Context Nesting

Nesting context providers for specialized functionality:

```tsx
<DashboardProvider>
  <AnalyticsProvider>
    <MapProvider>
      <DashboardContent />
    </MapProvider>
  </AnalyticsProvider>
</DashboardProvider>
```

## Best Practices

1. Use context for component tree state rather than global application state
2. Combine context with hooks to encapsulate complex logic
3. Split context by domain or feature rather than having a single global context
4. Provide meaningful error messages when context is used outside its provider
5. Use TypeScript for better type safety and documentation
6. Keep context values stable to prevent unnecessary re-renders
7. Memoize complex derived values with useMemo
8. Consider using useCallback for context actions 