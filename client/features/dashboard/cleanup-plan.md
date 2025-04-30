# Dashboard Feature Cleanup Plan

## Changes Made

1. **Removed Duplicate View Component**:
   - Deleted `views/DashboardView.tsx` as it duplicated functionality in `components/DashboardPage.tsx`
   - Updated `index.ts` to export `DashboardPage` instead

2. **Simplified Component Hierarchy**:
   - Enhanced `ViewSwitcher` to handle error and loading states directly
   - Removed redundant state in `DashboardContent`
   - Simplified `DashboardContent` to be a pure passthrough component
   - **[Completed]** Eliminated `DashboardContent` entirely by using `ViewSwitcher` directly in `DashboardPage`

3. **Consolidated Responsibility**:
   - Moved error handling to `ViewSwitcher`
   - Consolidated loading states in `ViewSwitcher`
   - **[Completed]** Consolidated skeleton components into a unified system

4. **Fixed Import References**:
   - Updated import for `DashboardSkeleton` in `DashboardPage.tsx`
   - Updated import and usage of `AnalyticsCardSkeleton` to `AnalyticsSkeleton` in `BaseCard.tsx`
   - Updated import and usage of `AnalyticsCardSkeleton` to `AnalyticsSkeleton` in `AnalyticsView.tsx`

## Future Tasks

1. **Component Structure**:
   - ~~Consider whether `DashboardContent` is still needed as a separate component~~ (Completed)
   - Evaluate if some of the lazy-loaded components can be consolidated
   - Consider separating the ViewSwitcher code into smaller, focused components

2. **State Management**:
   - Move more state to the centralized store
   - Remove duplicate state tracking across components
   - Consider using context for dashboard-specific state that doesn't need persistence
   - Standardize state variable naming across components

3. **Code Duplication**:
   - Review analytics components for duplicate code
   - Check for redundancy in dashboard hooks
   - Consolidate map-related utility functions
   - Consolidate duplicate loading indicator implementations

4. **Performance Optimization**:
   - Evaluate if the current code splitting strategy is optimal
   - Check for unnecessary re-renders 
   - Improve data fetching patterns to minimize duplicate requests
   - Implement memoization for expensive calculations

5. **File Organization**:
   - Consider reorganizing the dashboard folder structure:
     - Group by functionality rather than component type
     - Ensure related components are co-located
     - Move shared utilities to appropriate locations
   - Update imports to use consistent paths

## Completed Items

1. ✅ Removed redundant `views/DashboardView.tsx` component
2. ✅ Enhanced `ViewSwitcher` to handle more responsibilities directly
3. ✅ Eliminated unnecessary `DashboardContent` component
4. ✅ Consolidated all skeleton components into a unified system in `loading/Skeletons.tsx`
5. ✅ Removed redundant `DashboardSkeleton.tsx` and `AnalyticsCardSkeleton.tsx` files
6. ✅ Fixed import references for new skeleton component structure

## Recommended Next Steps

1. Review `DashboardPage.tsx` and `AnalyticsView.tsx` for more opportunities to reduce duplication
2. Review the hooks folder for redundant data fetching logic
3. ~~Consider consolidating the various skeleton components for more consistent loading UX~~ (Completed)
4. Evaluate analytics components for further simplification
5. Add explicit typings for all component props and function parameters
6. Review and consolidate error handling approaches across components 