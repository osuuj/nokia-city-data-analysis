'use client';

import { cn } from '@/shared/utils/cn';
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface IconConfig {
  name: string;
  width?: number;
  color?: string;
}

export interface PopoverFilterWrapperProps {
  title?: string;
  children: React.ReactNode;
  onApply?: () => void;
  onCancel?: () => void;
  icon?: string | IconConfig;
  maxWidth?: string;
  className?: string;
}

export const PopoverFilterWrapper = React.forwardRef<HTMLDivElement, PopoverFilterWrapperProps>(
  (
    {
      title = 'Filter',
      children,
      onApply,
      onCancel,
      icon = 'lucide:filter',
      maxWidth = '350px',
      className,
      ...props
    },
    ref,
  ) => {
    const { isOpen, onOpenChange, onClose } = useDisclosure();
    const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);

    // Prevent body scrolling when popover is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    // Close popover on window resize to prevent positioning issues
    useEffect(() => {
      const handleResize = () => {
        if (isOpen) {
          onClose();
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, onClose]);

    // Set up focus trap when popover opens
    useEffect(() => {
      if (isOpen && contentRef.current) {
        // Find all focusable elements
        const focusable = contentRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        setFocusableElements(Array.from(focusable) as HTMLElement[]);

        // Focus the first element
        if (focusable.length > 0) {
          (focusable[0] as HTMLElement).focus();
        }
      }
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'Tab' && isOpen) {
          // Implement focus trap
          const firstFocusable = focusableElements[0];
          const lastFocusable = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable.focus();
            }
          }
        }
      },
      [isOpen, onClose, focusableElements],
    );

    // Parse icon configuration
    const iconConfig: IconConfig = typeof icon === 'string' ? { name: icon, width: 16 } : icon;

    return (
      <Popover
        ref={ref}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        {...props}
        placement="bottom"
        offset={6}
        shouldBlockScroll={true}
        shouldFlip={true}
        classNames={{
          base: 'focus:outline-none focus:ring-0 z-50',
          trigger: 'focus:outline-none focus:ring-0',
          content: 'focus:outline-none focus:ring-0 max-h-[80vh]',
        }}
        onKeyDown={handleKeyDown}
      >
        <PopoverTrigger>
          <Button
            className={cn(
              'bg-default-100 text-default-800 min-w-0 px-2 sm:px-3',
              'hover:bg-default-200 active:bg-default-300',
              'transition-colors duration-200',
              className,
            )}
            size="sm"
            startContent={
              <Icon
                icon={iconConfig.name}
                width={iconConfig.width || 16}
                className={iconConfig.color || 'text-default-400'}
                aria-hidden="true"
              />
            }
            aria-expanded={isOpen}
            aria-haspopup="dialog"
          >
            <span className="hidden xs:inline-block text-xs">{title}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 shadow-lg border border-default-200"
          style={{ maxWidth, width: '100%' }}
        >
          <div className="p-2 xs:p-3 max-h-[50vh] overflow-y-auto w-full" ref={contentRef}>
            <h3 className="mb-2 text-sm font-medium">{title}</h3>
            <div className="w-full">{children}</div>
          </div>

          <Divider className="bg-default-100" />
          <div className="flex w-full justify-end gap-2 p-2">
            <Button
              size="sm"
              variant="flat"
              className="text-xs focus:outline-none focus:ring-0"
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
              className="text-xs focus:outline-none focus:ring-0"
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

// Add display name
PopoverFilterWrapper.displayName = 'PopoverFilterWrapper';
