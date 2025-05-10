// Re-export all types from feature-specific files
export * from './business';
export * from './companyStore';
export * from './filters';
export * from './table';
export * from './view';

import type { SVGProps } from 'react';

/**
 * Shared props for SVG-based icons across the project
 */
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
