'use client';

import { Icon } from '@iconify/react';
import type React from 'react';

interface AccessibleIconifyProps {
  icon: string;
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
  color?: string;
  role?: string;
}

/**
 * AccessibleIconify
 * A wrapper for Iconify icons that properly handles accessibility attributes.
 * This component ensures that icons are accessible to screen readers while avoiding
 * the "aria-hidden on focused element" accessibility error.
 *
 * @example
 * ```tsx
 * <AccessibleIconify
 *   icon="lucide:home"
 *   ariaLabel="Home icon"
 *   className="text-primary"
 * />
 * ```
 */
export const AccessibleIconify: React.FC<AccessibleIconifyProps> = ({
  icon,
  width = 24,
  height = 24,
  className = '',
  ariaLabel,
  color,
  role = 'img',
}) => {
  // Extract the icon name from the iconify string (e.g., "solar:home-bold" -> "home")
  const iconName = icon.split(':').pop()?.split('-')[0] || 'icon';

  return (
    <Icon
      icon={icon}
      width={width}
      height={height}
      className={className}
      color={color}
      // Remove problematic attributes that cause accessibility errors
      // aria-hidden="true" - removed
      // focusable="false" - removed
      // tabindex="-1" - removed
      // Add proper accessibility attributes
      role={role}
      aria-label={ariaLabel || iconName}
    />
  );
};
