'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'guest';
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requiredRole,
  redirectTo = '/login',
  fallback = null,
}: AuthGuardProps) {
  const { user, status, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && status === 'unauthenticated') {
      router.push(redirectTo);
    }
  }, [isLoading, status, redirectTo, router]);

  // Show fallback while loading
  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (status !== 'authenticated' || !user) {
    return null;
  }

  // Check if user has required role
  if (requiredRole && user.role !== requiredRole) {
    return fallback || <div>You don't have permission to access this page.</div>;
  }

  // User is authenticated and has required role
  return <>{children}</>;
}
