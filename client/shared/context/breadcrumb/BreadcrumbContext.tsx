'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';

/**
 * Breadcrumb item interface
 */
interface BreadcrumbItem {
  /** Title of the breadcrumb item */
  title: string;
  /** URL of the breadcrumb item */
  url?: string;
  /** Whether the item is currently active */
  isActive?: boolean;
  /** Whether the item is loading */
  isLoading?: boolean;
  /** Error message if the item failed to load */
  error?: string | null;
}

/**
 * Breadcrumb context state interface
 */
interface BreadcrumbContextState {
  /** Current page title */
  currentPageTitle: string;
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Whether the breadcrumb is loading */
  isLoading: boolean;
  /** Error message if breadcrumb failed to load */
  error: string | null;
}

/**
 * Breadcrumb context interface
 */
interface BreadcrumbContextType extends BreadcrumbContextState {
  /** Set the current page title */
  setCurrentPageTitle: (title: string) => void;
  /** Add a breadcrumb item */
  addItem: (item: BreadcrumbItem) => void;
  /** Remove a breadcrumb item */
  removeItem: (title: string) => void;
  /** Update a breadcrumb item */
  updateItem: (title: string, updates: Partial<BreadcrumbItem>) => void;
  /** Clear all breadcrumb items */
  clearItems: () => void;
  /** Reset the breadcrumb state */
  reset: () => void;
}

/**
 * Default breadcrumb context value
 */
const defaultBreadcrumbContext: BreadcrumbContextType = {
  currentPageTitle: '',
  items: [],
  isLoading: false,
  error: null,
  setCurrentPageTitle: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateItem: () => {},
  clearItems: () => {},
  reset: () => {},
};

/**
 * Breadcrumb context
 */
const BreadcrumbContext = createContext<BreadcrumbContextType>(defaultBreadcrumbContext);

/**
 * Breadcrumb provider props
 */
interface BreadcrumbProviderProps {
  /** Children to wrap with the breadcrumb provider */
  children: ReactNode;
  /** Default breadcrumb state */
  defaultState?: Partial<BreadcrumbContextState>;
}

/**
 * Breadcrumb provider component
 * Provides breadcrumb context to the application
 *
 * @example
 * ```tsx
 * <BreadcrumbProvider defaultState={{ currentPageTitle: 'Home' }}>
 *   <App />
 * </BreadcrumbProvider>
 * ```
 */
export function BreadcrumbProvider({ children, defaultState = {} }: BreadcrumbProviderProps) {
  const [state, setState] = useState<BreadcrumbContextState>({
    currentPageTitle: '',
    items: [],
    isLoading: false,
    error: null,
    ...defaultState,
  });

  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * Set the current page title
   */
  const setCurrentPageTitle = useCallback((title: string) => {
    if (!isMounted.current) return;

    setState((prev) => ({
      ...prev,
      currentPageTitle: title,
      error: null,
    }));
  }, []);

  /**
   * Add a breadcrumb item
   */
  const addItem = useCallback((item: BreadcrumbItem) => {
    if (!isMounted.current) return;

    setState((prev) => ({
      ...prev,
      items: [...prev.items, { ...item, isActive: true }],
      error: null,
    }));
  }, []);

  /**
   * Remove a breadcrumb item
   */
  const removeItem = useCallback((title: string) => {
    if (!isMounted.current) return;

    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.title !== title),
      error: null,
    }));
  }, []);

  /**
   * Update a breadcrumb item
   */
  const updateItem = useCallback((title: string, updates: Partial<BreadcrumbItem>) => {
    if (!isMounted.current) return;

    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.title === title ? { ...item, ...updates } : item)),
      error: null,
    }));
  }, []);

  /**
   * Clear all breadcrumb items
   */
  const clearItems = useCallback(() => {
    if (!isMounted.current) return;

    setState((prev) => ({
      ...prev,
      items: [],
      error: null,
    }));
  }, []);

  /**
   * Reset the breadcrumb state
   */
  const reset = useCallback(() => {
    if (!isMounted.current) return;

    setState({
      currentPageTitle: '',
      items: [],
      isLoading: false,
      error: null,
      ...defaultState,
    });
  }, [defaultState]);

  return (
    <BreadcrumbContext.Provider
      value={{
        ...state,
        setCurrentPageTitle,
        addItem,
        removeItem,
        updateItem,
        clearItems,
        reset,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

/**
 * Hook to use the breadcrumb context
 * @returns Breadcrumb context value
 * @throws Error if used outside of BreadcrumbProvider
 */
export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}
