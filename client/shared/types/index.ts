import type { SVGProps } from 'react';

/**
 * @interface IconSvgProps
 * @description Props for SVG icons with optional size.
 */
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown) => React.ReactNode;
}
