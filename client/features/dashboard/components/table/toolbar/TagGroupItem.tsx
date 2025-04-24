'use client';

import type { TagGroupItemProps } from '@/types';
import { Chip, VisuallyHidden, cn, useCheckbox } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';

/**
 * TagGroupItem
 * A custom-styled tag component used inside a checkbox group for filter selections.
 */
export const TagGroupItem = React.forwardRef<HTMLLabelElement, TagGroupItemProps>(
  ({ icon, size = 'md', ...props }, ref) => {
    const { children, isSelected, getBaseProps, getLabelProps, getInputProps } = useCheckbox(props);

    return (
      <label {...getBaseProps()} ref={ref} className="cursor-pointer">
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <Chip
          className={cn(
            'transition-colors w-full justify-start',
            isSelected ? 'bg-primary text-white' : 'bg-default-200 text-default-600',
          )}
          radius="sm"
          size={size}
          startContent={
            icon ? (
              <Icon
                className={cn(isSelected ? 'text-white' : 'text-default-400')}
                icon={icon}
                width={16}
              />
            ) : undefined
          }
          variant="flat"
        >
          {children}
        </Chip>
      </label>
    );
  },
);

TagGroupItem.displayName = 'TagGroupItem';
