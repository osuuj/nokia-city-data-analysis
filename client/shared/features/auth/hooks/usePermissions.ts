'use client';

import { useAuth } from '../context/AuthContext';
import {
  type Permission,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '../utils/permissions';

/**
 * Custom hook for checking user permissions
 * @returns Permission checking functions
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role || 'guest';

  /**
   * Check if the current user has a specific permission
   * @param permission The permission to check
   * @returns True if the user has the permission, false otherwise
   */
  const can = (permission: Permission): boolean => {
    return hasPermission(role, permission);
  };

  /**
   * Check if the current user has all of the specified permissions
   * @param permissions The permissions to check
   * @returns True if the user has all permissions, false otherwise
   */
  const canAll = (permissions: Permission[]): boolean => {
    return hasAllPermissions(role, permissions);
  };

  /**
   * Check if the current user has any of the specified permissions
   * @param permissions The permissions to check
   * @returns True if the user has any of the permissions, false otherwise
   */
  const canAny = (permissions: Permission[]): boolean => {
    return hasAnyPermission(role, permissions);
  };

  return {
    can,
    canAll,
    canAny,
    role,
  };
}
