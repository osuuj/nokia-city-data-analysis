// Re-export all types from feature-specific files
export * from './business';
export * from './companyStore';
export * from './filters';
export * from './table';

import type { SVGProps } from 'react';

/**
 * Shared props for SVG-based icons across the project.
 * Extends standard SVG attributes with an optional `size` shorthand.
 *
 * @example
 * const Icon = (props: IconSvgProps) => <svg width={props.size} ... />
 */
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
