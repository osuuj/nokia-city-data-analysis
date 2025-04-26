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
 * User role types
 */
export type UserRole = 'admin' | 'user' | 'guest';

/**
 * Authentication status types
 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'error';

/**
 * User interface
 */
interface User {
  /** User ID */
  id: string;
  /** User email */
  email: string;
  /** User name */
  name: string;
  /** User role */
  role: UserRole;
  /** User avatar URL */
  avatarUrl?: string;
  /** User preferences */
  preferences?: Record<string, string | number | boolean | null>;
}

/**
 * Authentication state interface
 */
interface AuthState {
  /** Current user */
  user: User | null;
  /** Authentication status */
  status: AuthStatus;
  /** Whether authentication is loading */
  isLoading: boolean;
  /** Error message if authentication failed */
  error: string | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether the user is an admin */
  isAdmin: boolean;
  /** Whether the user is a guest */
  isGuest: boolean;
}

/**
 * Authentication context interface
 */
interface AuthContextType extends AuthState {
  /** Login with email and password */
  login: (email: string, password: string) => Promise<void>;
  /** Logout the current user */
  logout: () => Promise<void>;
  /** Register a new user */
  register: (email: string, password: string, name: string) => Promise<void>;
  /** Reset the authentication state */
  reset: () => void;
  /** Update user preferences */
  updatePreferences: (
    preferences: Record<string, string | number | boolean | null>,
  ) => Promise<void>;
  /** Refresh the authentication token */
  refreshToken: () => Promise<void>;
}

/**
 * Default authentication state
 */
const defaultAuthState: AuthState = {
  user: null,
  status: 'unauthenticated',
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isAdmin: false,
  isGuest: true,
};

/**
 * Default authentication context value
 */
const defaultAuthContext: AuthContextType = {
  ...defaultAuthState,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  reset: () => {},
  updatePreferences: async () => {},
  refreshToken: async () => {},
};

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

/**
 * Authentication provider props
 */
interface AuthProviderProps {
  /** Children to wrap with the authentication provider */
  children: ReactNode;
  /** Default authentication state */
  defaultState?: Partial<AuthState>;
}

/**
 * Authentication provider component
 * Provides authentication context to the application
 *
 * @example
 * ```tsx
 * <AuthProvider defaultState={{ status: 'loading' }}>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children, defaultState = {} }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    ...defaultAuthState,
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
   * Login with email and password
   */
  const login = useCallback(async (email: string, password: string) => {
    if (!isMounted.current) return;

    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        status: 'loading',
        error: null,
      }));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const user: User = {
        id: '1',
        email,
        name: 'John Doe',
        role: 'user',
        avatarUrl: 'https://via.placeholder.com/150',
        preferences: {
          theme: 'light',
          notifications: true,
        },
      };

      setState((prev) => ({
        ...prev,
        user,
        status: 'authenticated',
        isLoading: false,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isGuest: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during login',
      }));
    }
  }, []);

  /**
   * Logout the current user
   */
  const logout = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        status: 'loading',
        error: null,
      }));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setState((prev) => ({
        ...prev,
        user: null,
        status: 'unauthenticated',
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
        isGuest: true,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during logout',
      }));
    }
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(async (email: string, password: string, name: string) => {
    if (!isMounted.current) return;

    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        status: 'loading',
        error: null,
      }));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const user: User = {
        id: '1',
        email,
        name,
        role: 'user',
        preferences: {
          theme: 'light',
          notifications: true,
        },
      };

      setState((prev) => ({
        ...prev,
        user,
        status: 'authenticated',
        isLoading: false,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isGuest: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during registration',
      }));
    }
  }, []);

  /**
   * Reset the authentication state
   */
  const reset = useCallback(() => {
    if (!isMounted.current) return;

    setState({
      ...defaultAuthState,
      ...defaultState,
    });
  }, [defaultState]);

  /**
   * Update user preferences
   */
  const updatePreferences = useCallback(
    async (preferences: Record<string, string | number | boolean | null>) => {
      if (!isMounted.current) return;

      try {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
        }));

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        setState((prev) => ({
          ...prev,
          user: prev.user
            ? {
                ...prev.user,
                preferences: {
                  ...prev.user.preferences,
                  ...preferences,
                },
              }
            : null,
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error ? error.message : 'An error occurred while updating preferences',
        }));
      }
    },
    [],
  );

  /**
   * Refresh the authentication token
   */
  const refreshToken = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred while refreshing token',
      }));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        reset,
        updatePreferences,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use the authentication context
 * @returns Authentication context value
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
