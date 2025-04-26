import type { UserRole } from '../context/AuthContext';

// Define permission levels
export type Permission =
  | 'read:data'
  | 'write:data'
  | 'delete:data'
  | 'manage:users'
  | 'view:admin'
  | 'access:api';

// Define role permissions
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: ['read:data', 'write:data', 'delete:data', 'manage:users', 'view:admin', 'access:api'],
  user: ['read:data', 'write:data', 'access:api'],
  guest: ['read:data'],
};

/**
 * Check if a user has a specific permission
 * @param role The user's role
 * @param permission The permission to check
 * @returns True if the user has the permission, false otherwise
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false;
}

/**
 * Check if a user has all of the specified permissions
 * @param role The user's role
 * @param permissions The permissions to check
 * @returns True if the user has all permissions, false otherwise
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Check if a user has any of the specified permissions
 * @param role The user's role
 * @param permissions The permissions to check
 * @returns True if the user has any of the permissions, false otherwise
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 * @param role The user's role
 * @returns An array of permissions for the role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] || [];
}
