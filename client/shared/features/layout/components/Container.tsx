'use client';

import { cn } from '@/shared/utils/cn';
import { useBreakpoint } from '../hooks/useBreakpoint';
import type { ContainerProps } from '../types';
import { getResponsiveValue } from '../utils/responsive';

/**
 * Container component for centering content and providing consistent padding
 *
 * @param props Component props
 * @returns Container component
 *
 * @example
 * ```tsx
 * <Container maxWidth="lg" padding={4}>
 *   <h1>My Page Content</h1>
 *   <p>This content is centered and has consistent padding.</p>
 * </Container>
 * ```
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 4,
  className,
}) => {
  const breakpoint = useBreakpoint();

  // Convert maxWidth to CSS value
  const maxWidthValue = getResponsiveValue(maxWidth, breakpoint);

  // Convert padding to CSS value
  const paddingValue = getResponsiveValue(padding, breakpoint);

  // Generate CSS styles
  const styles: React.CSSProperties = {
    maxWidth: typeof maxWidthValue === 'number' ? `${maxWidthValue}px` : maxWidthValue,
    padding: typeof paddingValue === 'number' ? `${paddingValue * 4}px` : paddingValue,
    margin: '0 auto',
    width: '100%',
  };

  return (
    <div className={cn('mx-auto w-full', className)} style={styles}>
      {children}
    </div>
  );
};
