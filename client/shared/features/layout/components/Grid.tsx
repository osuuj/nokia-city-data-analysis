'use client';

import { cn } from '@/shared/utils/cn';
import { useBreakpoint } from '../hooks/useBreakpoint';
import type { GridItemProps, GridProps } from '../types';
import { getGridColumns, getGridGap } from '../utils/responsive';

/**
 * Grid component for creating responsive grid layouts
 *
 * @param props Component props
 * @returns Grid component
 *
 * @example
 * ```tsx
 * <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
 *   <GridItem>Item 1</GridItem>
 *   <GridItem>Item 2</GridItem>
 *   <GridItem>Item 3</GridItem>
 * </Grid>
 * ```
 */
export const Grid: React.FC<GridProps> = ({ children, columns, gap, className }) => {
  const breakpoint = useBreakpoint();

  // Generate CSS styles
  const styles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getGridColumns(columns, breakpoint),
    gap: getGridGap(gap, breakpoint),
  };

  return (
    <div className={cn('grid', className)} style={styles}>
      {children}
    </div>
  );
};

/**
 * GridItem component for grid items
 *
 * @param props Component props
 * @returns GridItem component
 *
 * @example
 * ```tsx
 * <GridItem colSpan={{ base: 1, md: 2 }} rowSpan={2}>
 *   Grid item content
 * </GridItem>
 * ```
 */
export const GridItem: React.FC<GridItemProps> = ({ children, colSpan, rowSpan, className }) => {
  const breakpoint = useBreakpoint();

  // Generate CSS styles
  const styles: React.CSSProperties = {
    gridColumn: colSpan
      ? `span ${typeof colSpan === 'number' ? colSpan : colSpan[breakpoint] || colSpan.xs}`
      : undefined,
    gridRow: rowSpan
      ? `span ${typeof rowSpan === 'number' ? rowSpan : rowSpan[breakpoint] || rowSpan.xs}`
      : undefined,
  };

  return (
    <div className={cn(className)} style={styles}>
      {children}
    </div>
  );
};
