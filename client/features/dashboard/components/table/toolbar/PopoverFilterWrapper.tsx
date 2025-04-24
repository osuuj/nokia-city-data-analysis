'use client';

import { AccessibleIconify } from '@/components/ui/Icon/AccessibleIconify';
import type { PopoverFilterWrapperProps } from '@/types';
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@heroui/react';
import React, { useEffect } from 'react';

// Define icon configuration type
type IconConfig = {
  name: string;
  width?: number;
  color?: string;
};

/**
 * PopoverFilterWrapper
 * A reusable popover component for filters with Apply/Cancel logic, scroll-safe and responsive.
 */
export const PopoverFilterWrapper = React.forwardRef<HTMLDivElement, PopoverFilterWrapperProps>(
  (
    {
      title = 'Filter',
      children,
      onApply,
      onCancel,
      icon = 'lucide:filter',
      maxWidth = '350px',
      ...props
    },
    ref,
  ) => {
    const { isOpen, onOpenChange, onClose } = useDisclosure();

    // Close popover on window resize
    useEffect(() => {
      const handleResize = () => {
        if (isOpen) {
          onClose();
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, onClose]);

    // Parse icon configuration
    const iconConfig: IconConfig = typeof icon === 'string' ? { name: icon, width: 16 } : icon;

    return (
      <Popover
        ref={ref}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        {...props}
        placement="bottom-start"
        classNames={{
          base: 'focus:outline-none focus:ring-0',
          trigger: 'focus:outline-none focus:ring-0',
          content: 'focus:outline-none focus:ring-0',
        }}
      >
        <PopoverTrigger>
          <Button
            className="bg-default-100 text-default-800 min-w-0 px-2 sm:px-3 focus:outline-none focus:ring-0 hover:bg-default-200 active:bg-default-300 active:outline-none active:ring-0"
            size="sm"
            startContent={
              <AccessibleIconify
                icon={iconConfig.name}
                width={iconConfig.width || 16}
                className={`${iconConfig.color || 'text-default-400'}`}
                ariaLabel={title}
              />
            }
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-controls={`${title.toLowerCase()}-filter-content`}
          >
            <span className="hidden xs:inline-block text-[10px] xs:text-xs sm:text-sm">
              {title}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 focus:outline-none focus:ring-0"
          style={{ maxWidth }}
          id={`${title.toLowerCase()}-filter-content`}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} filter options`}
          aria-hidden={false}
        >
          <div className="p-2 xs:p-3 max-h-[80vh] overflow-auto w-full">
            <h3 className="mb-2 xs:mb-3 text-xs xs:text-sm sm:text-base font-medium">{title}</h3>
            <div className="w-full">{children}</div>
          </div>

          <Divider className="bg-default-100" />
          <div className="flex w-full justify-end gap-1 xs:gap-2 px-2 xs:px-3 py-1.5 xs:py-2">
            <Button
              size="sm"
              variant="flat"
              className="text-[10px] xs:text-xs sm:text-sm focus:outline-none focus:ring-0 h-6 xs:h-7 sm:h-8"
              onPress={() => {
                onCancel?.();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              color="primary"
              className="text-[10px] xs:text-xs sm:text-sm focus:outline-none focus:ring-0 h-6 xs:h-7 sm:h-8"
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
