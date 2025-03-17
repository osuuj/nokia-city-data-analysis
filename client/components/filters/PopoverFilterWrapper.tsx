'use client';

import type { PopoverProps } from '@heroui/react';

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

export type PopoverFilterWrapperProps = Omit<PopoverProps, 'children'> & {
  title?: string;
  children: React.ReactNode;
};

const PopoverFilterWrapper = React.forwardRef<HTMLDivElement, PopoverFilterWrapperProps>(
  ({ title, children, ...props }, ref) => {
    const { isOpen, onClose, onOpenChange } = useDisclosure();

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
        <PopoverContent className="flex max-w-xs flex-col items-start gap-2 px-4 pt-4">
          <span className="mb-2 text-medium font-medium text-default-600">{title}</span>
          <div className="w-full px-2">{children}</div>
          <Divider className="mt-3 bg-default-100" />
          <div className="flex w-full justify-end gap-2 py-2">
            <Button size="sm" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" size="sm" variant="flat" onPress={onClose}>
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
