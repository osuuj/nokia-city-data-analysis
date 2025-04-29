# Dashboard Store

This document provides information about the state management solutions used in the Dashboard feature, focusing on Zustand stores.

## Store Overview

The Dashboard feature uses Zustand for state management, providing a lightweight and flexible alternative to Redux or Context API. The stores manage global state across the dashboard components, including selected filters, view preferences, and data selections.

## Main Stores

### Company Store

The company store manages the main business data state and filtering options.

```typescript
import { useCompanyStore } from '@/features/dashboard/store';

// Select state from the store
const selectedCity = useCompanyStore((state) => state.selectedCity);
const selectedIndustries = useCompanyStore((state) => state.selectedIndustries);

// Update state
const setSelectedCity = useCompanyStore((state) => state.setSelectedCity);
setSelectedCity('Helsinki');
```

#### State Properties

- `selectedCity`: Currently selected city
- `selectedIndustries`: Array of selected industry codes
- `distanceLimit`: Maximum distance for location-based filtering
- `userLocation`: User's geographic location for distance calculations

#### Actions

- `setSelectedCity(city: string)`: Sets the selected city
- `setSelectedIndustries(industries: string[])`: Sets the selected industries
- `setDistanceLimit(limit: number | null)`: Sets the distance limit
- `setUserLocation(location: { latitude: number; longitude: number } | null)`: Sets the user location

### Selection Store

The selection store manages table row selections and multi-select functionality.

```typescript
import { useSelectionStore } from '@/features/dashboard/store';

// Select state from the store
const selectedRows = useSelectionStore((state) => state.selectedRows);
const selectedKeys = useSelectionStore((state) => state.selectedKeys);

// Update state
const toggleRow = useSelectionStore((state) => state.toggleRow);
toggleRow(businessData);
```

#### State Properties

- `selectedRows`: Record mapping business IDs to selected business objects
- `selectedKeys`: Set of selected business IDs
- `isMultiSelectMode`: Whether multi-select mode is active
- `lastSelectedKey`: Last selected business ID for range selection

#### Actions

- `setSelectedKeys(keys: Set<string> | 'all', allFilteredData?: CompanyProperties[])`: Sets the selected keys
- `toggleRow(business: CompanyProperties)`: Toggles selection of a single row
- `clearSelection()`: Clears all selections
- `toggleMultiSelectMode()`: Toggles multi-select mode
- `setLastSelectedKey(key: string | null)`: Sets the last selected key

## Implementation Details

### Store Creation

Stores are created using Zustand's `create` function with the devtools middleware for better debugging.

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useCompanyStore = create<CompanyState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedCity: '',
      selectedIndustries: [],
      distanceLimit: null,
      userLocation: null,
      
      // Actions
      setSelectedCity: (city) => set({ selectedCity: city }),
      setSelectedIndustries: (industries) => set({ selectedIndustries: industries }),
      setDistanceLimit: (limit) => set({ distanceLimit: limit }),
      setUserLocation: (location) => set({ userLocation: location }),
    }),
    {
      name: 'dashboard-company-store',
    }
  )
);
```

### Persistence

Some stores implement persistence using Zustand's persist middleware to maintain state across page refreshes.

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const usePersistentStore = create<PersistentState>()(
  devtools(
    persist(
      (set) => ({
        // State and actions
      }),
      {
        name: 'dashboard-persistent-store',
      }
    )
  )
);
```

## Usage Patterns

### Selective State Selection

When using store hooks in components, select only the specific state properties needed to prevent unnecessary re-renders.

```typescript
// Good - only subscribes to changes in selectedCity
const selectedCity = useCompanyStore((state) => state.selectedCity);

// Avoid - re-renders on any store state change
const state = useCompanyStore((state) => state);
const { selectedCity } = state;
```

### Memoized Selectors

For complex derived state, use memoized selectors to avoid unnecessary recalculations.

```typescript
import { useMemo } from 'react';
import { useCompanyStore } from '@/features/dashboard/store';

const FilteredBusinessCount = () => {
  const selectedCity = useCompanyStore((state) => state.selectedCity);
  const selectedIndustries = useCompanyStore((state) => state.selectedIndustries);
  const businesses = useCompanyStore((state) => state.businesses);
  
  const filteredCount = useMemo(() => {
    return businesses.filter(
      (b) => 
        b.city === selectedCity && 
        (selectedIndustries.length === 0 || selectedIndustries.includes(b.industry))
    ).length;
  }, [businesses, selectedCity, selectedIndustries]);
  
  return <div>Filtered Businesses: {filteredCount}</div>;
};
```

## Best Practices

1. Keep store state minimal and focused on global concerns
2. Use component state for local UI state
3. Split stores by domain or feature rather than having a single global store
4. Use selective state selection to prevent unnecessary re-renders
5. Implement middleware (devtools, persist) for better developer experience
6. Add TypeScript types for state and actions
7. Use action naming conventions (e.g., `set*` for setters)
8. Keep actions simple and focused on single responsibility
9. Avoid storing derived state that can be calculated from other state 