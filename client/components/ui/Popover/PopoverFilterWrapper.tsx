'use client';

import type { PopoverFilterWrapperProps } from '@/types';
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';

/**
 * PopoverFilterWrapper
 * A generic wrapper for filter components with Apply/Cancel logic in a popover layout.
 */
export const PopoverFilterWrapper = React.forwardRef<HTMLDivElement, PopoverFilterWrapperProps>(
  ({ title, children, onApply, onCancel, ...props }, ref) => {
    const { isOpen, onOpenChange, onClose } = useDisclosure();

    return (
      <Popover ref={ref} isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
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
            <Button
              color="primary"
              size="sm"
              variant="flat"
              onPress={() => {
                onApply?.();
                onClose();
              }}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

PopoverFilterWrapper.displayName = 'PopoverFilterWrapper';
