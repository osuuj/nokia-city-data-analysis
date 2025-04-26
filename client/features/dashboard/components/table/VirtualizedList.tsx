import type React from 'react';
import { FixedSizeList, type FixedSizeListProps } from 'react-window';

interface VirtualizedListProps extends Omit<FixedSizeListProps, 'children'> {
  children: (props: {
    index: number;
    style: React.CSSProperties;
  }) => React.ReactElement;
}

export const VirtualizedList: React.FC<VirtualizedListProps> = (props) => {
  return <FixedSizeList {...props} />;
};
