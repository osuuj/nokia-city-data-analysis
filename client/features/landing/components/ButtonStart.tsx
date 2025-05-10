'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

/**
 * Props for the ButtonStart component.
 */
export interface ButtonStartProps {
  /** Text to display on the button */
  label?: string;
  href?: string;
  className?: string;
  disabled?: boolean;
  onPress?: () => void;
}

/**
 * ButtonStart Component
 *
 * A versatile button that supports both internal (Next.js) and external links.
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
}) => {
  const isExternal = href.startsWith('http');

  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'group relative h-9 overflow-hidden bg-transparent text-small font-normal inline-flex items-center justify-center rounded-full',
        'transition-all duration-300 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'hover:scale-105 active:scale-95',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      style={{
        border: 'solid 2px transparent',
        backgroundImage:
          'linear-gradient(hsl(var(--heroui-background)), hsl(var(--heroui-background))), linear-gradient(to right, #F871A0, #9353D3)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
      aria-disabled={disabled}
    >
      {label}
      <Icon
        className="flex-none outline-none transition-transform duration-300 group-hover:translate-x-1 [&>path]:stroke-[2] ml-2"
        icon="solar:arrow-right-linear"
        width={16}
        aria-hidden="true"
      />
    </a>
  ) : (
    <Link href={href}>
      <Button
        type="button"
        className={clsx(
          'group relative h-9 overflow-hidden bg-transparent text-small font-normal',
          'transition-all duration-300 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'hover:scale-105 active:scale-95',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        radius="full"
        disabled={disabled}
        aria-label={label}
        onPress={onPress}
        style={{
          border: 'solid 2px transparent',
          backgroundImage:
            'linear-gradient(hsl(var(--heroui-background)), hsl(var(--heroui-background))), linear-gradient(to right, #F871A0, #9353D3)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        {label}
      </Button>
    </Link>
  );
};
