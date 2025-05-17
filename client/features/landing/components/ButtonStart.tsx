'use client';

import type { ButtonStartProps } from '@/features/landing/types';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

/**
 * ButtonStart Component
 *
 * A versatile button that supports both internal (Next.js) and external links.
 * Uses a gradient border with consistent styling across all variants.
 *
 * @example
 * <ButtonStart label="Start Exploring" href="/dashboard" />
 */
export const ButtonStart: FC<ButtonStartProps> = ({
  label = 'Start Exploring',
  href = '/dashboard',
  className = '',
  disabled = false,
  onPress,
  'aria-label': ariaLabel,
}) => {
  const isExternal = href?.startsWith('http');

  // Common button styles
  const commonStyles = clsx(
    'group relative h-9 overflow-hidden bg-transparent text-small font-normal inline-flex items-center justify-center rounded-full',
    'transition-all duration-300 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    'hover:scale-105 active:scale-95',
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  );

  // Gradient border style
  const gradientStyle = {
    border: 'solid 2px transparent',
    backgroundImage:
      'linear-gradient(hsl(var(--heroui-background)), hsl(var(--heroui-background))), linear-gradient(to right, #F871A0, #9353D3)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  };

  // Arrow icon
  const arrowIcon = (
    <Icon
      className="flex-none outline-none transition-transform duration-300 group-hover:translate-x-1 [&>path]:stroke-[2] ml-2"
      icon="solar:arrow-right-linear"
      width={16}
      aria-hidden="true"
    />
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={commonStyles}
        style={gradientStyle}
        aria-disabled={disabled}
        aria-label={ariaLabel || label}
      >
        {label}
        {arrowIcon}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel || label}>
      <Button
        type="button"
        className={commonStyles}
        radius="full"
        disabled={disabled}
        onPress={onPress}
        style={gradientStyle}
      >
        <span className="flex items-center">
          {label}
          {arrowIcon}
        </span>
      </Button>
    </Link>
  );
};
