'use client';

import type { PopoverProps } from '@heroui/react';
import { Button, Divider, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';

export type PopoverFilterWrapperProps = Omit<PopoverProps, 'children'> & {
  title?: string;
  children: React.ReactNode;
  onApply?: () => void;
  onCancel?: () => void;
};

const PopoverFilterWrapper = React.forwardRef<HTMLDivElement, PopoverFilterWrapperProps>(
  ({ title, children, onApply, onCancel, ...props }, ref) => {
    return (
      <Popover ref={ref} {...props}>
        <PopoverTrigger>
          <Button
            className="bg-default-100 text-default-800"
            size="sm"
            endContent={<Icon icon="solar:alt-arrow-down-linear" />}
          >
            {title}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex max-w-xs flex-col items-start gap-1 md:gap-2 px-1 pt-2 md:px-2 md:pt-4">
          <div className="w-full px-1 md:px-2">{children}</div>
          <Divider className="mt-1 md:mt-2 bg-default-100" />
          <div className="flex w-full justify-end gap-2 py-2">
            <Button size="sm" variant="flat" onPress={onCancel}>
              Cancel
            </Button>
            <Button color="primary" size="sm" variant="flat" onPress={onApply}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

PopoverFilterWrapper.displayName = 'PopoverFilterWrapper';

export default PopoverFilterWrapper;
