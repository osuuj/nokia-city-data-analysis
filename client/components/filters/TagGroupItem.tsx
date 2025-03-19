'use client';

import type { CheckboxProps } from '@heroui/react';
import { Chip, VisuallyHidden, cn, useCheckbox } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';

export type TagGroupItemProps = Omit<CheckboxProps, 'icon'> & {
  icon?: string;
};

const TagGroupItem = React.forwardRef<HTMLLabelElement, TagGroupItemProps>(
  ({ icon, size = 'md', ...props }, ref) => {
    const { children, isSelected, getBaseProps, getLabelProps, getInputProps } = useCheckbox(props);

    return (
      <label {...getBaseProps()} ref={ref} className="cursor-pointer">
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <Chip
          className={cn(
            'transition-colors',
            isSelected ? 'bg-primary text-white' : 'bg-default-200 text-default-600',
          )} // ✅ Use className instead of classNames
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

export default TagGroupItem;
