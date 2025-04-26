'use client';

import { cn } from '@/shared/utils/cn';
import type { StackProps } from '../types';

/**
 * Stack component for arranging elements vertically or horizontally with consistent spacing
 *
 * @param props Component props
 * @returns Stack component
 *
 * @example
 * ```tsx
 * <Stack direction="column" spacing={4} align="center" justify="between">
 *   <div>First item</div>
 *   <div>Second item</div>
 *   <div>Third item</div>
 * </Stack>
 * ```
 */
export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  spacing = 4,
  align = 'start',
  justify = 'start',
  wrap = false,
  className,
}) => {
  // Generate CSS styles
  const styles: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'column' ? 'column' : 'row',
    alignItems:
      align === 'start'
        ? 'flex-start'
        : align === 'center'
          ? 'center'
          : align === 'end'
            ? 'flex-end'
            : align === 'stretch'
              ? 'stretch'
              : align === 'baseline'
                ? 'baseline'
                : 'flex-start',
    justifyContent:
      justify === 'start'
        ? 'flex-start'
        : justify === 'center'
          ? 'center'
          : justify === 'end'
            ? 'flex-end'
            : justify === 'between'
              ? 'space-between'
              : justify === 'around'
                ? 'space-around'
                : justify === 'evenly'
                  ? 'space-evenly'
                  : 'flex-start',
    flexWrap: wrap ? 'wrap' : 'nowrap',
    gap: typeof spacing === 'number' ? `${spacing * 4}px` : spacing,
  };

  return (
    <div className={cn('flex', className)} style={styles}>
      {children}
    </div>
  );
};
