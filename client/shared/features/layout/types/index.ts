import type { ReactNode } from 'react';

/**
 * Breakpoint type for responsive design
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Breakpoint values in pixels
 */
export const breakpointValues: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Container component props
 */
export interface ContainerProps {
  /** Content to be rendered inside the container */
  children: ReactNode;
  /** Maximum width of the container */
  maxWidth?: string | number;
  /** Padding of the container */
  padding?: string | number;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Grid component props
 */
export interface GridProps {
  /** Content to be rendered inside the grid */
  children: ReactNode;
  /** Number of columns or responsive column configuration */
  columns?: number | Record<Breakpoint, number>;
  /** Gap between grid items */
  gap?: number | string;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Grid item component props
 */
export interface GridItemProps {
  /** Content to be rendered inside the grid item */
  children: ReactNode;
  /** Column span or responsive column span configuration */
  colSpan?: number | Record<Breakpoint, number>;
  /** Row span or responsive row span configuration */
  rowSpan?: number | Record<Breakpoint, number>;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Stack component props
 */
export interface StackProps {
  /** Content to be rendered inside the stack */
  children: ReactNode;
  /** Direction of the stack */
  direction?: 'row' | 'column';
  /** Spacing between stack items */
  spacing?: number | string;
  /** Alignment of items along the cross axis */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Justification of items along the main axis */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Whether to wrap items to the next line */
  wrap?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Box component props
 */
export interface BoxProps {
  /** Content to be rendered inside the box */
  children: ReactNode;
  /** Padding of the box */
  padding?: string | number;
  /** Margin of the box */
  margin?: string | number;
  /** Border radius of the box */
  borderRadius?: string | number;
  /** Background color of the box */
  backgroundColor?: string;
  /** Border of the box */
  border?: string;
  /** Width of the box */
  width?: string | number;
  /** Height of the box */
  height?: string | number;
  /** Display property of the box */
  display?: string;
  /** Position of the box */
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  /** Additional CSS class name */
  className?: string;
}

/**
 * Media query hook options
 */
export interface MediaQueryOptions {
  /** Default value for the media query */
  defaultMatches?: boolean;
}

/**
 * Breakpoint hook options
 */
export interface BreakpointOptions {
  /** Default breakpoint */
  defaultBreakpoint?: Breakpoint;
}
