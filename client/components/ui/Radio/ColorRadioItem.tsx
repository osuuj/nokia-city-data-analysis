'use client';

import type { ColorRadioItemProps } from '@/types';
import { Tooltip, VisuallyHidden, cn, useRadio } from '@heroui/react';
import React from 'react';

/**
 * ColorRadioItem
 * A circular color swatch used for color-based selection in forms.
 */
export const ColorRadioItem = React.forwardRef<HTMLInputElement, ColorRadioItemProps>(
  ({ color, tooltip, ...props }, ref) => {
    const { Component, isSelected, isFocusVisible, getBaseProps, getInputProps } = useRadio(props);

    return (
      <Tooltip content={tooltip} delay={1000} isDisabled={!tooltip} offset={0} placement="top">
        <Component {...getBaseProps()} ref={ref}>
          <VisuallyHidden>
            <input {...getInputProps()} />
          </VisuallyHidden>
          <span
            className={cn(
              'pointer-events-none h-8 w-8 rounded-full border border-black border-opacity-10 transition-transform group-data-[pressed=true]:scale-90',
              {
                'ring-2 ring-offset-2 ring-offset-content1': isSelected,
              },
            )}
            style={{
              backgroundColor: color,
              // @ts-ignore
              '--tw-ring-color':
                isSelected || isFocusVisible ? 'hsl(var(--heroui-primary))' : 'transparent',
            }}
          />
        </Component>
      </Tooltip>
    );
  },
);

ColorRadioItem.displayName = 'ColorRadioItem';
