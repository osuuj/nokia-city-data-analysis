'use client';

import type { RadioProps } from '@heroui/react';
import { VisuallyHidden, cn, useRadio, useRadioGroupContext } from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useMemo } from 'react';

const RatingRadioItem = React.forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const {
    Component,
    isSelected: isSelfSelected,
    isFocusVisible,
    getBaseProps,
    getInputProps,
  } = useRadio(props);

  const groupContext = useRadioGroupContext();

  const isSelected = useMemo(
    () => isSelfSelected || Number(groupContext.groupState.selectedValue) >= Number(props.value),
    [isSelfSelected, groupContext.groupState.selectedValue, props.value],
  );

  const starWidth = useMemo(() => {
    return { sm: 16, md: 24, lg: 32 }[props.size || groupContext.size || 'md'];
  }, [props.size, groupContext.size]);

  return (
    <Component
      {...getBaseProps()}
      ref={ref}
      className={cn(getBaseProps().className, {
        'cursor-default': groupContext.groupState.isReadOnly,
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Icon
        className={cn(isSelected ? 'text-primary' : 'text-default-200')}
        icon="solar:star-bold"
        width={starWidth}
      />
    </Component>
  );
});

RatingRadioItem.displayName = 'RatingRadioItem';

export default RatingRadioItem;
