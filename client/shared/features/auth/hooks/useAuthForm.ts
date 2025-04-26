'use client';

import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface UseAuthFormOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UseAuthFormResult {
  isLoading: boolean;
  error: string | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleRegister: (email: string, password: string, name: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for handling authentication forms with HeroUI components
 * @param options Configuration options
 * @returns Authentication form handlers and state
 */
export function useAuthForm(options: UseAuthFormOptions = {}): UseAuthFormResult {
  const { login, logout, register, isLoading, error, clearError } = useAuth();
  const { onSuccess, onError } = options;

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await login(email, password);
        onSuccess?.();
      } catch (err) {
        onError?.(err instanceof Error ? err.message : 'Login failed');
      }
    },
    [login, onSuccess, onError],
  );

  const handleRegister = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        await register(email, password, name);
        onSuccess?.();
      } catch (err) {
        onError?.(err instanceof Error ? err.message : 'Registration failed');
      }
    },
    [register, onSuccess, onError],
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      onSuccess?.();
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Logout failed');
    }
  }, [logout, onSuccess, onError]);

  return {
    isLoading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    clearError,
  };
}
