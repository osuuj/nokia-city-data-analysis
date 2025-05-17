import React from 'react';
import type { SVGProps } from 'react';

/**
 * Unified icon type system supporting both string-based icons and SVG components
 */

/**
 * Base properties shared by all icon types
 */
export interface IconBaseProps {
  /** Optional CSS class to apply to the icon */
  className?: string;
  /** Optional color to apply to the icon (CSS color string) */
  color?: string;
  /** Optional ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Props specific to string-based icons (e.g., from Iconify)
 */
export interface IconStringProps extends IconBaseProps {
  /** Icon name/identifier (e.g., 'lucide:user' or 'material-symbols:home') */
  name: string;
  /** Width of the icon in pixels */
  width?: number;
  /** Height of the icon in pixels (defaults to width if not specified) */
  height?: number;
}

/**
 * Props for SVG-based icon components
 */
export type IconSvgProps = SVGProps<SVGSVGElement> &
  IconBaseProps & {
    /** Size of the icon (applied to both width and height) */
    size?: number;
  };

/**
 * Unified icon type that can be either a string identifier or an SVG component
 *
 * Usage examples:
 *
 * String-based icon: { name: 'lucide:user', width: 24, color: '#ff0000' }
 * SVG component: <UserIcon size={24} color="#ff0000" />
 */
export type IconType = IconStringProps | React.ReactElement<IconSvgProps>;

/**
 * Type guard to check if an icon is string-based
 */
export function isStringIcon(icon: IconType): icon is IconStringProps {
  return typeof icon === 'object' && !React.isValidElement(icon) && 'name' in icon;
}

/**
 * Type guard to check if an icon is an SVG component
 */
export function isSvgIcon(icon: IconType): icon is React.ReactElement<IconSvgProps> {
  return React.isValidElement(icon);
}

/**
 * Legacy type for backward compatibility
 * @deprecated Use IconStringProps instead
 */
export type IconConfig = IconStringProps;
