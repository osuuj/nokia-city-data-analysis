# Dashboard Refactoring Plan

## Current Status Update

We've made significant progress on fixing the dashboard issues. Here's what we've accomplished:

1. ✅ Fixed the ViewSwitcher component - now properly displays map and table views
2. ✅ Fixed the MapView component to work with GeoJSON data 
3. ✅ Fixed the FeatureCardList component to display company details
4. ✅ Fixed the ViewModeToggle component to switch between views
5. ✅ Created DashboardView as a main container component
6. ✅ Cleaned up the MapDebugger component which is no longer needed
7. ✅ Fixed the GeoJSON data processing for mapping
8. ✅ Added proper address type handling and toggle functionality
9. ✅ Fixed map icon display and styling with industry-based colors
10. ✅ Fixed table filtering to maintain selection state across pagination

The next steps focus on integrating the remaining parts and fixing specific issues with industry filtering.

## Remaining Issues

1. ~~**Map Icons Issue**:~~
   - ~~Icons are not displaying correctly on the map~~
   - ~~Need to investigate icon loading and path configuration~~
   - ~~Check if the industry SVG icons are accessible to the map component~~
   ✅ **Resolved:** Map icons now display correctly using symbol layers with proper industry letter-based styling

2. ~~**Table Data and Pagination**:~~
   - ~~Fix table filtering to maintain selection state across pagination~~
   - ~~Ensure that filtered rows remain consistent with the map view~~
   - ~~Handle proper sorting and filtering in the table view~~
   ✅ **Resolved:** Table now properly maintains selection state across pagination and synchronizes with the map view

3. **Industry Filtering**:
   - Restore industry filtering functionality
   - Fix distance-based filtering
   - Ensure selection state is properly maintained
   - Update the CompanyStore to handle selection properly

4. **Performance Optimization**:
   - Optimize render cycles using React.memo and useMemo
   - Ensure proper loading states are displayed

## Implementation Steps

### 1. Fix Map Icons

- [x] Investigate why map icons are not displaying - discovered that map is using colored circles instead of actual SVG icons
- [x] Updated map layers to use symbol layers with icon images like in the working implementation
- [x] Add proper loading of icon sprites in the Mapbox style for industry icons to display
- [x] Verify that icon images are correctly referenced in the map style

### 2. Fix Table Filtering and Pagination

- [x] Update the CompanyStore to maintain selection state across pagination
- [x] Ensure filtering is applied consistently between table and map views
- [x] Fix issues with the TableView component to work with GeoJSON data
- [x] Ensure selected rows in table are properly highlighted in the map

### 3. Fix Industry Filtering

- [ ] Restore industry filtering functionality
- [ ] Fix distance-based filtering
- [ ] Ensure selection state is properly maintained
- [ ] Update the CompanyStore to handle selection properly

### 4. Complete Address Navigation

- [x] Implement proper navigation between postal and visiting addresses
- [x] Add clear visual indication of current address type in the UI
- [x] Update the flyTo function to properly zoom to the selected address
- [x] Ensure the feature card shows both addresses when they differ

### 5. Optimize Performance

- [x] Implement proper lazy loading
- [x] Add suspense boundaries with appropriate loading states
- [ ] Optimize re-renders using memoization
- [ ] Implement proper data fetching strategies with caching

## Next Steps (Immediate Actions)

1. ~~**Fix Map Icons Issue**:~~
   - ~~Check icon paths and SVG availability~~
   - ~~Investigate potential Mapbox style issues~~
   - ~~File paths to check: public/industries-dark/ and public/industries-light/ directories~~
   ✅ **Completed:** Map icons are now displaying correctly with symbol layers and proper industry-based styling

2. ~~**Fix Table Filtering**:~~
   - ~~Ensure consistency between table and map views~~
   - ~~Make sure filtering works with pagination~~
   - ~~File: `client/features/dashboard/components/table/TableView.tsx`~~
   ✅ **Completed:** Table filtering now works correctly across pagination and maintains selection state

3. **Fix Industry Filtering**:
   - Restore industry filtering functionality in combination with map view
   - File: `client/features/dashboard/components/table/toolbar/FilterGroup.tsx`

## File-by-File Status

### Data Hooks
- `hooks/data/useGeoJSONData.ts`: ✅ Created with proper React Query implementation
- `hooks/data/useCitiesData.ts`: ✅ Implemented as part of useGeoJSONData.ts
- `hooks/data/index.ts`: ✅ Updated exports for new hooks

### Utilities
- `utils/geo.ts`: ✅ Updated address type handling logic
- `utils/table.ts`: ✅ Updated for consistent filtering across pagination
- `utils/index.ts`: ✅ No changes needed, already exports geo utilities

### Components
- `components/map/MapView.tsx`: ✅ Fixed GeoJSON handling, address toggling, and map icon display
- `components/map/FeatureCardList.tsx`: ✅ Updated to better distinguish between address types and added toggle functionality
- `components/table/TableView.tsx`: ✅ Updated to maintain selection state across pagination and sync with map
- `components/ViewSwitcher/ViewSwitcher.tsx`: ✅ Consolidated implementation and fixed linter errors
- `components/ViewSwitcher/index.tsx`: ✅ Created but may need updates
- `components/controls/ViewModeToggle/index.tsx`: ✅ Created and fixed onPress issues

### Store
- `store/useCompanyStore.ts`: ✅ Updated to handle address types and pagination selection

## Recent Accomplishments (Latest Updates)

Today we made several important improvements to the codebase:

1. **Fixed Table Filtering and Selection State**:
   - Updated TableView component to properly maintain selection state across pagination
   - Added synchronization between table selection and map selection
   - Enhanced the selection mechanism to work with the filteredBusinessIds from the store
   - Fixed the issue where selection would be lost when changing pages

2. **Improved Cross-View Data Consistency**:
   - Ensured that when a row is selected in the table, the corresponding marker is highlighted in the map
   - Updated the TableToolbar component to work with the full filtered dataset
   - Fixed issues with pagination display showing incorrect counts

3. **Enhanced User Experience**:
   - Improved loading state handling to prevent unnecessary flickering during filtering
   - Added better caching of data when changing page size
   - Optimized TableView re-renders for better performance

4. **Fixed Data Synchronization**:
   - Implemented proper two-way binding between the local state and the global store
   - Ensured that filtered data is properly tracked across all components
   - Fixed the issue where selection state was not persisted when navigating between views

The next focus will be on fixing the industry filtering functionality and improving performance optimization. 