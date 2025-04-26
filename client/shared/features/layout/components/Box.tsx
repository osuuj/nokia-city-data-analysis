'use client';

import { cn } from '@/shared/utils/cn';
import type { BoxProps } from '../types';

/**
 * Box component for creating custom containers with specific styling
 *
 * @param props Component props
 * @returns Box component
 *
 * @example
 * ```tsx
 * <Box
 *   padding={4}
 *   margin={2}
 *   borderRadius="md"
 *   backgroundColor="primary.100"
 * >
 *   Content in a box
 * </Box>
 * ```
 */
export const Box: React.FC<BoxProps> = ({
  children,
  padding,
  margin,
  borderRadius,
  backgroundColor,
  border,
  width,
  height,
  display,
  position,
  className,
}) => {
  // Generate CSS styles
  const styles: React.CSSProperties = {
    padding: typeof padding === 'number' ? `${padding * 4}px` : padding,
    margin: typeof margin === 'number' ? `${margin * 4}px` : margin,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius * 4}px` : borderRadius,
    backgroundColor,
    border,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    display,
    position,
  };

  return (
    <div className={cn(className)} style={styles}>
      {children}
    </div>
  );
};
