# Dashboard Data Fetching & Visualization Improvement Plan

## Overview
This document outlines the plan to fix current issues with data fetching and dashboard visualization logic in our application. These improvements will enhance reliability, performance, and maintainability.

## Current Issues Identified

1. **Inconsistent Data Fetching Approaches**
   - Mixture of direct fetch API calls and React Query
   - Inconsistent error handling between approaches
   - Redundant data transformation logic in multiple places

2. **Unreliable Data Parsing**
   - Multiple parsing fallbacks suggest inconsistent API responses
   - Debug logs indicate potential format issues with API responses
   - Excessive try/catch blocks dealing with unpredictable data structures

3. **Component-Level Complexity**
   - Complex data transformation happening in component code
   - Multiple transformation steps performed in renders
   - Insufficient separation of data fetching, transformation, and presentation

4. **Backend Response Inconsistencies**
   - GeoJSON endpoints returning variable data structures
   - Direct SQL queries used where ORM would be more maintainable
   - Lack of standardized error handling in API responses

## Implementation Plan

### Phase 1: Standardize Data Fetching (Week 1)

1. **Migrate All Direct Fetches to React Query**
   - Replace implementation in `useDashboardData.ts` with pattern from `useDashboardDataQuery.ts`
   - Ensure all data access is centralized through React Query hooks
   - Tasks:
     - Refactor `useDashboardData.ts` to use React Query
     - Update all component imports to use the standardized hooks
     - Add proper caching strategies for all queries

2. **Implement Consistent Error Handling**
   - Create centralized error handling utilities
   - Standardize error response format across all data fetches
   - Tasks:
     - Create `useErrorHandler.ts` hook for unified error handling
     - Update all query hooks to use standardized error format
     - Implement proper retry logic for transient failures

### Phase 2: Optimize Data Transformation (Week 2)

1. **Move Transformation Logic to Service Layer**
   - Create dedicated transformation services
   - Remove transformation logic from components
   - Tasks:
     - Create `transformationService.ts` with pure functions for data transformation
     - Move complex transformations from `AnalyticsView.tsx` to the service
     - Implement unit tests for transformation functions

2. **Standardize Data Structures**
   - Define clear interface contracts between backend and frontend
   - Ensure consistent typing across the application
   - Tasks:
     - Update TypeScript interfaces to match actual data
     - Add runtime validation using Zod or similar
     - Create schema validation utilities

### Phase 3: Backend Improvements (Week 3)

1. **Standardize API Response Formats**
   - Ensure all endpoints return consistent data structures
   - Implement proper error handling on all endpoints
   - Tasks:
     - Update `geojson_companies.py` to return consistent format
     - Standardize error response format across all endpoints
     - Add request validation for all parameters

2. **Improve Backend Query Efficiency**
   - Optimize SQL queries for better performance
   - Implement proper pagination for large datasets
   - Tasks:
     - Refactor direct SQL to use ORM where appropriate
     - Add indexing for frequently queried columns
     - Implement caching for expensive queries

### Phase 4: Dashboard Component Improvements (Week 4)

1. **Simplify Dashboard Views**
   - Reduce complexity in view components
   - Implement proper code splitting and lazy loading
   - Tasks:
     - Refactor `AnalyticsView.tsx` to use simplified data hooks
     - Break down large components into smaller, focused ones
     - Implement proper loading states and error boundaries

2. **Enhance Visualization Components**
   - Improve chart and map performance
   - Standardize visualization components
   - Tasks:
     - Optimize chart rendering with memoization
     - Standardize map data handling
     - Implement progressive loading for large datasets

## Testing Strategy

1. **Unit Tests**
   - Add tests for all transformation functions
   - Test error handling edge cases
   - Verify data processing logic

2. **Integration Tests**
   - Test full data flow from API to UI
   - Verify correct handling of different API responses
   - Test error states and recovery

3. **End-to-End Tests**
   - Create E2E tests for critical dashboard flows
   - Test different filter combinations
   - Verify visualization accuracy

## Rollout Plan

1. **Phased Deployment**
   - Deploy backend changes first
   - Roll out frontend changes incrementally
   - Monitor performance and error rates

2. **Feature Flags**
   - Use feature flags to control rollout
   - Enable quick rollback if issues are detected
   - Test with subset of users before full release

## Success Metrics

1. **Performance**
   - Reduce initial load time by 30%
   - Decrease time-to-interactive for dashboard by 40%
   - Reduce API response time by 25%

2. **Reliability**
   - Reduce error rate by 80%
   - Eliminate data parsing errors
   - Improve cache hit rate to 70%

3. **Developer Experience**
   - Simplify codebase with clear patterns
   - Improve test coverage to 80%
   - Reduce lines of code by 15% through elimination of duplication 