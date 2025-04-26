'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Types
export type UserRole = 'admin' | 'user' | 'guest';
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'error';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  preferences?: Record<string, string | number | boolean | null>;
}

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Default state
const defaultAuthState: AuthState = {
  user: null,
  status: 'unauthenticated',
  error: null,
  isLoading: false,
};

// Create context
const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateUser: async () => {},
  clearError: () => {},
});

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(defaultAuthState);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setState((prev) => ({
            ...prev,
            user,
            status: 'authenticated',
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        setState((prev) => ({
          ...prev,
          error: 'Failed to load user session',
          status: 'error',
          isLoading: false,
        }));
      }
    };

    loadUser();
  }, []);

  // Login handler
  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        // TODO: Implement actual login API call
        const mockUser: User = {
          id: '1',
          email,
          name: 'Test User',
          role: 'user',
        };

        localStorage.setItem('user', JSON.stringify(mockUser));
        setState((prev) => ({
          ...prev,
          user: mockUser,
          status: 'authenticated',
          isLoading: false,
        }));
        router.push('/dashboard');
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Login failed',
          status: 'error',
          isLoading: false,
        }));
      }
    },
    [router],
  );

  // Logout handler
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      localStorage.removeItem('user');
      setState((prev) => ({
        ...prev,
        user: null,
        status: 'unauthenticated',
        isLoading: false,
      }));
      router.push('/login');
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Logout failed',
        status: 'error',
        isLoading: false,
      }));
    }
  }, [router]);

  // Register handler
  const register = useCallback(
    async (email: string, password: string, name: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        // TODO: Implement actual registration API call
        const mockUser: User = {
          id: '1',
          email,
          name,
          role: 'user',
        };

        localStorage.setItem('user', JSON.stringify(mockUser));
        setState((prev) => ({
          ...prev,
          user: mockUser,
          status: 'authenticated',
          isLoading: false,
        }));
        router.push('/dashboard');
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Registration failed',
          status: 'error',
          isLoading: false,
        }));
      }
    },
    [router],
  );

  // Update user handler
  const updateUser = useCallback(
    async (userData: Partial<User>) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        if (!state.user) throw new Error('No user logged in');

        const updatedUser = { ...state.user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setState((prev) => ({
          ...prev,
          user: updatedUser,
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to update user',
          status: 'error',
          isLoading: false,
        }));
      }
    },
    [state.user],
  );

  // Clear error handler
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value = {
    ...state,
    login,
    logout,
    register,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
