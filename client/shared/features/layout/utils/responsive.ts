import { type Breakpoint, breakpointValues } from '../types';

/**
 * Get the current breakpoint based on window width
 *
 * @param width Window width in pixels
 * @returns Current breakpoint
 */
export function getBreakpoint(width: number): Breakpoint {
  const breakpoints = Object.entries(breakpointValues).sort((a, b) => b[1] - a[1]); // Sort in descending order

  for (const [breakpoint, value] of breakpoints) {
    if (width >= value) {
      return breakpoint as Breakpoint;
    }
  }

  return 'xs';
}

/**
 * Convert a responsive value to a CSS value
 *
 * @param value Responsive value (number or record of breakpoints)
 * @param currentBreakpoint Current breakpoint
 * @returns CSS value
 */
export function getResponsiveValue<T>(
  value: T | Record<Breakpoint, T> | undefined,
  currentBreakpoint: Breakpoint,
): T | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<Breakpoint, T>;
    return record[currentBreakpoint] || record.xs;
  }

  return value as T;
}

/**
 * Generate CSS media query string
 *
 * @param breakpoint Breakpoint
 * @param direction Direction ('min' or 'max')
 * @returns Media query string
 */
export function getMediaQuery(breakpoint: Breakpoint, direction: 'min' | 'max' = 'min'): string {
  const value = breakpointValues[breakpoint];

  if (direction === 'min') {
    return `(min-width: ${value}px)`;
  }

  return `(max-width: ${value - 1}px)`;
}

/**
 * Generate CSS for responsive columns
 *
 * @param columns Number of columns or responsive column configuration
 * @param currentBreakpoint Current breakpoint
 * @returns CSS grid template columns
 */
export function getGridColumns(
  columns: number | Record<Breakpoint, number> | undefined,
  currentBreakpoint: Breakpoint,
): string {
  if (!columns) {
    return 'repeat(1, 1fr)';
  }

  const columnCount = getResponsiveValue(columns, currentBreakpoint);

  if (typeof columnCount === 'number') {
    return `repeat(${columnCount}, 1fr)`;
  }

  return 'repeat(1, 1fr)';
}

/**
 * Generate CSS for responsive gap
 *
 * @param gap Gap value or responsive gap configuration
 * @param currentBreakpoint Current breakpoint
 * @returns CSS gap value
 */
export function getGridGap(
  gap: number | string | Record<Breakpoint, number | string> | undefined,
  currentBreakpoint: Breakpoint,
): string {
  if (!gap) {
    return '0';
  }

  const gapValue = getResponsiveValue(gap, currentBreakpoint);

  if (typeof gapValue === 'number') {
    return `${gapValue * 4}px`; // Assuming 4px base unit
  }

  return gapValue as string;
}

/**
 * Generate CSS for responsive column span
 *
 * @param colSpan Column span or responsive column span configuration
 * @param currentBreakpoint Current breakpoint
 * @returns CSS grid column span
 */
export function getGridColumnSpan(
  colSpan: number | Record<Breakpoint, number> | undefined,
  currentBreakpoint: Breakpoint,
): string {
  if (!colSpan) {
    return 'auto';
  }

  const span = getResponsiveValue(colSpan, currentBreakpoint);

  if (typeof span === 'number') {
    return `span ${span}`;
  }

  return 'auto';
}

/**
 * Generate CSS for responsive row span
 *
 * @param rowSpan Row span or responsive row span configuration
 * @param currentBreakpoint Current breakpoint
 * @returns CSS grid row span
 */
export function getGridRowSpan(
  rowSpan: number | Record<Breakpoint, number> | undefined,
  currentBreakpoint: Breakpoint,
): string {
  if (!rowSpan) {
    return 'auto';
  }

  const span = getResponsiveValue(rowSpan, currentBreakpoint);

  if (typeof span === 'number') {
    return `span ${span}`;
  }

  return 'auto';
}
