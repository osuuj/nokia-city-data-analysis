import type { SVGProps } from 'react';

/**
 * @interface IconSvgProps
 * @description Props for SVG icons with optional size.
 */
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
