# Dashboard Refactoring Plan

## Current Status Update

We've made significant progress on fixing the dashboard issues. Here's what we've accomplished:

1. ✅ Fixed the ViewSwitcher component - now properly displays map and table views
2. ✅ Fixed the MapView component to work with GeoJSON data 
3. ✅ Fixed the FeatureCardList component to display company details
4. ✅ Fixed the ViewModeToggle component to switch between views
5. ✅ Created DashboardView as a main container component

The next steps focus on integrating the remaining parts and fixing any issues.

## Remaining Issues

1. **Complete Data Flow**: 
   - Ensure proper data passing from DashboardView to child components
   - Fix any type errors in the TableView component

2. **Testing**:
   - Test all view modes: Table, Map, Split, Analytics
   - Test address navigation in the feature cards
   - Test filtering functionality

3. **Performance Optimization**:
   - Optimize render cycles using React.memo and useMemo
   - Ensure proper loading states are displayed

## Implementation Steps

### 1. Fix Data Fetching Strategy

The first step is to restore the proper GeoJSON fetching mechanism:

- [x] Create the `useGeoJSONData` hook for fetching GeoJSON
- [x] Create the `useCitiesData` hook for fetching available cities
- [x] Update components to use these hooks instead of the current approach
- [x] Ensure error handling and loading states are properly managed

### 2. Fix GeoJSON Data Processing

- [x] Implement proper GeoJSON data transformation utilities
- [x] Fix the duplicate `filterByDistance` function in geo.ts
- [x] Ensure proper handling of postal and visiting addresses
- [ ] Update the store to properly handle address types

### 3. Fix MapView Component

- [x] Update MapView to correctly render GeoJSON data
- [x] Restore proper industry icon mapping
- [x] Fix clustering functionality
- [x] Restore FeatureCardList interaction
- [x] Ensure proper handling of zoom/pan events

### 4. Consolidate ViewSwitcher Components

- [x] Create a single ViewSwitcher index file
- [x] Create implementation plan for ViewSwitcher
- [x] Consolidate duplicate implementations into one robust component
- [x] Fix linter errors in ViewSwitcher component
- [x] Fix ViewModeToggle onClick/onPress issues
- [ ] Remove redundant code across components

### 5. Fix Split View

- [x] Ensure the table properly displays in split view mode
- [x] Ensure the map properly renders in split view mode
- [x] Fix layout issues between table and map
- [ ] Maintain consistent state between both views

### 6. Fix Feature Cards

- [x] Restore feature card functionality
- [x] Fix navigation between postal and visiting addresses
- [x] Ensure proper card display and interaction
- [x] Fix the flyTo functionality

### 7. Fix Selection and Filtering

- [ ] Restore industry filtering functionality
- [ ] Fix distance-based filtering
- [ ] Ensure selection state is properly maintained
- [ ] Update the CompanyStore to handle selection properly

### 8. Optimize Performance

- [x] Implement proper lazy loading
- [x] Add suspense boundaries with appropriate loading states
- [ ] Optimize re-renders using memoization
- [ ] Implement proper data fetching strategies with caching

## Next Steps (Immediate Actions)

1. **Finalize the TableView component**:
   - Create/update TableView to work with GeoJSON data
   - Ensure proper filtering and sorting

2. **Update the CompanyStore**:
   - Update the store to properly handle address types and selection
   - File: `client/features/dashboard/store/useCompanyStore.ts`

3. **Integration testing**:
   - Test the complete flow from selecting a city to displaying data
   - Test all view modes with real data

## File-by-File Status

### Data Hooks
- `hooks/data/useGeoJSONData.ts`: ✅ Created with proper React Query implementation
- `hooks/data/useCitiesData.ts`: ✅ Implemented as part of useGeoJSONData.ts
- `hooks/data/index.ts`: ✅ Updated exports for new hooks

### Utilities
- `utils/geo.ts`: ✅ Implemented GeoJSON transformation and fixed duplicate filterByDistance
- `utils/table.ts`: May need updates for proper table data handling
- `utils/index.ts`: ✅ No changes needed, already exports geo utilities

### Components
- `components/map/MapView.tsx`: ✅ Updated for proper GeoJSON handling and fixed linter errors
- `components/map/FeatureCardList.tsx`: ✅ Restored functionality
- `components/table/TableView.tsx`: Need to update for GeoJSON data
- `components/ViewSwitcher/ViewSwitcher.tsx`: ✅ Consolidated implementation and fixed linter errors
- `components/ViewSwitcher/index.tsx`: ✅ Created but may need updates
- `components/controls/ViewModeToggle/index.tsx`: ✅ Created and fixed onPress issues

### Views
- `views/DashboardView.tsx`: ✅ Created main dashboard component

### Store
- `store/useCompanyStore.ts`: Need to update for proper address handling and selection 