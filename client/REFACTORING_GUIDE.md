# Detailed Refactoring Guide

## Overview

This guide provides specific steps for refactoring the codebase to address the issues we've identified, particularly focusing on data fetching duplication, component structure, and state management.

## Progress and Learnings

### Completed Tasks
- Created centralized API client structure ✅
  - Created `shared/api/types.ts` with base types ✅
  - Created `shared/api/errors.ts` with error handling ✅
  - Created `shared/api/endpoints.ts` with API endpoints ✅
  - Created `shared/api/client.ts` with API client implementation ✅
  - Created `shared/api/index.ts` with API client instance ✅
- Standardized on React Query ✅
  - Installed React Query dependencies ✅
  - Updated React Query provider with optimal configuration ✅
  - Created base data fetching hooks in `shared/hooks/useApi.ts` ✅
- Created feature-specific data hooks ✅
  - Created `features/dashboard/hooks/useCities.ts` with city data hooks ✅
  - Created `features/dashboard/hooks/useCompanies.ts` with company data hooks ✅
  - Created `features/dashboard/hooks/usePrefetchData.ts` with prefetching utilities ✅
- Started breaking down AnalyticsView component ✅
  - Created initial directory structure for components ✅
  - Separated card components into their own files ✅
  - Separated selection components into their own files ✅
  - Identified type issues in data transformations ✅
  - Created utility functions for data transformations ✅
  - Fixed type issues in data transformations ✅
  - Created proper interfaces for component props ✅
- Implemented error handling system ✅
  - Created `shared/components/ErrorBoundary.tsx` for catching errors ✅
  - Created `shared/components/ErrorMessage.tsx` for displaying errors ✅
  - Created `shared/components/withErrorBoundary.tsx` HOC for easy wrapping ✅
  - Integrated error boundaries in AnalyticsView components ✅
  - Added proper error messages for each card component ✅
- Implemented loading state management ✅
  - Created `shared/components/LoadingSpinner.tsx` for basic loading states ✅
  - Created `shared/components/SkeletonLoader.tsx` for content placeholders ✅
  - Created `shared/components/LoadingOverlay.tsx` for full-screen loading ✅
  - Created `shared/context/LoadingContext.tsx` for global loading state ✅
  - Created `shared/utils/cn.ts` for class name utilities ✅
  - Added proper TypeScript types and documentation ✅

### Key Learnings
1. **API Client Structure**
   - Centralized API client significantly reduced code duplication
   - TypeScript interfaces improved type safety across the application
   - Consistent error handling improved debugging experience

2. **React Query Migration**
   - React Query provides better caching and state management than SWR
   - Custom hooks with React Query are more maintainable
   - The transition requires careful attention to loading states and error handling

3. **Component Structure**
   - Breaking down large components requires careful type management
   - Data transformation logic should be moved to separate utilities
   - Component composition improves maintainability and reusability

4. **Type Safety**
   - Proper type definitions are crucial for data transformations
   - Generic types help create reusable data structures
   - Type assertions should be used sparingly and with caution

5. **Error Handling**
   - Error boundaries provide a clean way to handle component errors
   - Custom error messages improve user experience
   - HOC pattern simplifies error boundary integration

6. **Loading State Management**
   - Centralized loading state improves user experience
   - Skeleton loaders reduce perceived loading time
   - Context-based loading state enables global loading management
   - Proper TypeScript types ensure type safety

### Current Focus Areas
1. **Component Documentation** ⚠️
   - Need to add JSDoc comments to components
   - Must create component usage examples
   - Should document props and interfaces
   - Need to create a component library documentation

2. **Testing Implementation** ⚠️
   - Need to set up testing framework
   - Must add component tests
   - Should add hook tests
   - Need to add integration tests

### Next Immediate Tasks
1. **Component Documentation** ⚠️
   - Add JSDoc comments
   - Create component usage examples
   - Document props and interfaces
   - Create component library documentation

2. **Testing Setup** ⚠️
   - Set up testing framework
   - Add component tests
   - Add hook tests
   - Add integration tests

### Legend
✅ - Completed
⚠️ - In Progress
❌ - Not Started

## Next Steps

### Phase 2: Loading State Management (Current Focus)

1. **Create Loading Components**
   - [ ] Create `shared/components/LoadingSpinner.tsx`
   - [ ] Create `shared/components/SkeletonLoader.tsx`
   - [ ] Create `shared/components/LoadingOverlay.tsx`
   - [ ] Add proper TypeScript types

2. **Implement Loading Context**
   - [ ] Create `shared/context/LoadingContext.tsx`
   - [ ] Implement loading state management
   - [ ] Add proper TypeScript types
   - [ ] Add proper documentation

3. **Create Loading Hooks**
   - [ ] Create `shared/hooks/useLoading.ts`
   - [ ] Implement loading state hooks
   - [ ] Add proper TypeScript types
   - [ ] Add proper documentation

### Phase 3: Component Documentation

1. **Add JSDoc Comments**
   - [ ] Add JSDoc comments to components
   - [ ] Add JSDoc comments to hooks
   - [ ] Add JSDoc comments to utilities
   - [ ] Add proper documentation

2. **Create Component Documentation**
   - [ ] Create documentation for UI components
   - [ ] Create documentation for data fetching hooks
   - [ ] Create documentation for state management
   - [ ] Add usage examples

### Phase 4: Testing Implementation

1. **Set Up Testing Framework**
   - [ ] Install testing dependencies
   - [ ] Configure testing framework
   - [ ] Add proper documentation

2. **Implement Component Tests**
   - [ ] Create tests for UI components
   - [ ] Create tests for data fetching hooks
   - [ ] Create tests for state management
   - [ ] Add proper documentation

## Implementation Priority

1. **High Priority (Current Sprint)**
   - Create loading components
   - Implement loading context
   - Add JSDoc comments
   - Set up testing framework

2. **Medium Priority (Next Sprint)**
   - Create component documentation
   - Implement component tests
   - Add hook tests
   - Add integration tests

3. **Lower Priority**
   - Performance optimization
   - Code splitting
   - Additional testing
   - Extended documentation

## Notes

- Keep functionality intact while refactoring
- Test thoroughly after each component extraction
- Maintain type safety throughout the refactoring
- Document changes and update this guide as we progress
- Consider creating a shared components library for reusable elements
- Monitor bundle size and performance metrics during refactoring

## Phase 1: Data Layer Refactoring

### Step 1: Create Centralized API Client

1. **Create API Client Structure**
   - [ ] Create `shared/api/client.ts`
   - [ ] Define API endpoint constants in `shared/api/endpoints.ts`
   - [ ] Create base request/response types in `shared/api/types.ts`
   - [ ] Implement error handling utilities in `shared/api/errors.ts`

2. **Implement API Client Methods**
   - [ ] Implement `get`, `post`, `put`, `delete` methods
   - [ ] Add request/response interceptors
   - [ ] Implement retry logic for failed requests
   - [ ] Add request cancellation support
   - [ ] Add proper TypeScript types

3. **Create API Client Instance**
   - [ ] Create a singleton instance in `shared/api/index.ts`
   - [ ] Export the instance for use throughout the app
   - [ ] Add proper environment variable handling

### Step 2: Standardize Data Fetching Library

1. **Choose React Query**
   - [ ] Install React Query dependencies
   - [ ] Set up React Query provider in `app/layout.tsx`
   - [ ] Configure default options (staleTime, cacheTime, etc.)

2. **Create Base Data Fetching Hooks**
   - [ ] Create `shared/hooks/useApi.ts` with base hooks
   - [ ] Implement `useQuery` and `useMutation` wrappers
   - [ ] Add proper error handling and loading states
   - [ ] Implement caching strategies

3. **Migrate from SWR to React Query**
   - [ ] Identify all SWR usages
   - [ ] Create equivalent React Query hooks
   - [ ] Update components to use React Query hooks
   - [ ] Remove SWR dependencies

### Step 3: Create Feature-Specific Data Hooks

1. **Create Cities Data Hook**
   - [ ] Create `features/dashboard/hooks/useCities.ts`
   - [ ] Implement cities data fetching
   - [ ] Add proper error handling and loading states
   - [ ] Add caching strategies

2. **Create Companies Data Hook**
   - [ ] Create `features/dashboard/hooks/useCompanies.ts`
   - [ ] Implement companies data fetching
   - [ ] Add proper error handling and loading states
   - [ ] Add caching strategies

3. **Create Prefetching Hooks**
   - [ ] Create `features/dashboard/hooks/usePrefetchData.ts`
   - [ ] Implement data prefetching logic
   - [ ] Add proper error handling
   - [ ] Add caching strategies

## Phase 2: Component Structure Optimization

### Step 1: Refactor Preloader Component

1. **Update Preloader Component**
   - [ ] Update `shared/components/data/Preloader.tsx`
   - [ ] Use the centralized API client
   - [ ] Use React Query's prefetching capabilities
   - [ ] Implement proper error handling
   - [ ] Add proper TypeScript types

2. **Test Preloader Component**
   - [ ] Verify that data is prefetched correctly
   - [ ] Verify that errors are handled properly
   - [ ] Verify that caching works correctly

### Step 2: Refactor DataLoader Component

1. **Update DataLoader Component**
   - [ ] Update `shared/components/data/DataLoader.tsx`
   - [ ] Use the centralized API client
   - [ ] Use React Query's data fetching capabilities
   - [ ] Implement proper error handling
   - [ ] Add proper TypeScript types
   - [ ] Make it more generic and reusable

2. **Test DataLoader Component**
   - [ ] Verify that data is loaded correctly
   - [ ] Verify that loading states are handled properly
   - [ ] Verify that errors are handled properly
   - [ ] Verify that caching works correctly

### Step 3: Break Down Dashboard Page

1. **Extract Data Fetching Logic**
   - [ ] Create custom hooks for data fetching
   - [ ] Move data fetching logic out of `app/dashboard/page.tsx`
   - [ ] Use the centralized API client
   - [ ] Use React Query's data fetching capabilities

2. **Extract UI Components**
   - [ ] Create separate components for UI elements
   - [ ] Move UI rendering logic out of `app/dashboard/page.tsx`
   - [ ] Implement proper component composition
   - [ ] Add proper TypeScript types

3. **Update Dashboard Page**
   - [ ] Update `app/dashboard/page.tsx`
   - [ ] Use the extracted hooks and components
   - [ ] Implement proper error handling and loading states
   - [ ] Add proper TypeScript types

## Phase 3: State Management Implementation

### Step 1: Improve Company Store

1. **Update Company Store**
   - [ ] Update `features/dashboard/store/useCompanyStore.ts`
   - [ ] Add proper TypeScript types
   - [ ] Implement state persistence
   - [ ] Create state selectors
   - [ ] Add proper documentation

2. **Test Company Store**
   - [ ] Verify that state is managed correctly
   - [ ] Verify that state persistence works correctly
   - [ ] Verify that state selectors work correctly

### Step 2: Create Global Loading State

1. **Create Loading Context**
   - [ ] Create `shared/context/LoadingContext.tsx`
   - [ ] Implement loading state management
   - [ ] Add proper TypeScript types
   - [ ] Add proper documentation

2. **Create Loading Provider**
   - [ ] Create `shared/providers/LoadingProvider.tsx`
   - [ ] Implement loading state provider
   - [ ] Add proper TypeScript types
   - [ ] Add proper documentation

3. **Create Loading Hooks**
   - [ ] Create `shared/hooks/useLoading.ts`
   - [ ] Implement loading state hooks
   - [ ] Add proper TypeScript types
   - [ ] Add proper documentation

## Phase 4: Performance Optimization

### Step 1: Implement Route-Based Code Splitting

1. **Update Next.js Configuration**
   - [ ] Update `next.config.js`
   - [ ] Configure code splitting options
   - [ ] Add proper documentation

2. **Implement Dynamic Imports**
   - [ ] Update route components to use dynamic imports
   - [ ] Add proper loading states
   - [ ] Add proper error handling
   - [ ] Add proper TypeScript types

### Step 2: Optimize Data Loading

1. **Implement Caching Strategies**
   - [ ] Configure React Query caching options
   - [ ] Implement optimistic updates
   - [ ] Add proper error handling
   - [ ] Add proper TypeScript types

2. **Implement Progressive Loading**
   - [ ] Update components to load data progressively
   - [ ] Add proper loading states
   - [ ] Add proper error handling
   - [ ] Add proper TypeScript types

## Phase 5: Testing and Documentation

### Step 1: Add Tests

1. **Set Up Testing Framework**
   - [ ] Install testing dependencies
   - [ ] Configure testing framework
   - [ ] Add proper documentation

2. **Implement Component Tests**
   - [ ] Create tests for UI components
   - [ ] Create tests for data fetching hooks
   - [ ] Create tests for state management
   - [ ] Add proper documentation

### Step 2: Add Documentation

1. **Add JSDoc Comments**
   - [ ] Add JSDoc comments to components
   - [ ] Add JSDoc comments to hooks
   - [ ] Add JSDoc comments to utilities
   - [ ] Add proper documentation

2. **Create Component Documentation**
   - [ ] Create documentation for UI components
   - [ ] Create documentation for data fetching hooks
   - [ ] Create documentation for state management
   - [ ] Add usage examples

## Implementation Checklist

### Phase 1: Data Layer Refactoring
- [ ] Create centralized API client
- [ ] Standardize on React Query
- [ ] Create feature-specific data hooks
- [ ] Migrate from SWR to React Query

### Phase 2: Component Structure Optimization
- [ ] Refactor Preloader component
- [ ] Refactor DataLoader component
- [ ] Break down Dashboard page
- [ ] Extract UI components

### Phase 3: State Management Implementation
- [ ] Improve Company store
- [ ] Create global loading state
- [ ] Implement state persistence
- [ ] Create state selectors

### Phase 4: Performance Optimization
- [ ] Implement route-based code splitting
- [ ] Optimize data loading
- [ ] Implement caching strategies
- [ ] Implement progressive loading

### Phase 5: Testing and Documentation
- [ ] Set up testing framework
- [ ] Implement component tests
- [ ] Add JSDoc comments
- [ ] Create component documentation

## Progress Tracking

Use this section to track your progress as you work through the refactoring guide.

### Completed Tasks
- Created centralized API client structure
  - Created `shared/api/types.ts` with base types
  - Created `shared/api/errors.ts` with error handling
  - Created `shared/api/endpoints.ts` with API endpoints
  - Created `shared/api/client.ts` with API client implementation
  - Created `shared/api/index.ts` with API client instance
- Standardized on React Query
  - Installed React Query dependencies
  - Updated React Query provider with optimal configuration
  - Created base data fetching hooks in `shared/hooks/useApi.ts`
- Created feature-specific data hooks
  - Created `features/dashboard/hooks/useCities.ts` with city data hooks
  - Created `features/dashboard/hooks/useCompanies.ts` with company data hooks
  - Created `features/dashboard/hooks/usePrefetchData.ts` with prefetching utilities
- Identified existing hooks to migrate
  - Found `