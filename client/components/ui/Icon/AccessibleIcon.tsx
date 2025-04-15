'use client';

import type React from 'react';

interface AccessibleIconProps {
  icon: string;
  width?: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * AccessibleIcon
 * A wrapper for SVG icons that properly handles accessibility attributes.
 * This component ensures that icons are accessible to screen readers while avoiding
 * the "aria-hidden on focused element" accessibility error.
 */
export const AccessibleIcon: React.FC<AccessibleIconProps> = ({
  icon,
  width = 24,
  height = 24,
  className = '',
  ariaLabel,
}) => {
  // Extract the icon name from the iconify string (e.g., "solar:home-bold" -> "home")
  const iconName = icon.split(':').pop()?.split('-')[0] || 'icon';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label={ariaLabel || iconName}
      // Remove problematic attributes that cause accessibility errors
      // aria-hidden="true" - removed
      // focusable="false" - removed
      // tabindex="-1" - removed
    >
      {/* This is a placeholder. In a real implementation, you would need to 
          map the icon name to the actual SVG path data */}
      <use href={`/icons/${icon}.svg#icon`} />
    </svg>
  );
};
