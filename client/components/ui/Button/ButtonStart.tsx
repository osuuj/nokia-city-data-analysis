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
  onClick?: () => void;
}

/**
 * ButtonStart Component
 *
 * A versatile button that supports both internal (Next.js) and external links.
 *
 * @example
 * <ButtonStart label="Start Exploring" href="/home" />
 */
export const ButtonStart: FC<ButtonStartProps> = ({
  label = 'Start Exploring',
  href = '/home',
  className = '',
  disabled = false,
  onClick,
}) => {
  const isExternal = href.startsWith('http');

  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'group relative h-9 overflow-hidden bg-transparent text-small font-normal inline-flex items-center justify-center rounded-full',
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
    >
      {label}
      <Icon
        className="flex-none outline-none transition-transform group-hover:translate-x-0.5 [&>path]:stroke-[2] ml-2"
        icon="solar:arrow-right-linear"
        width={16}
      />
    </a>
  ) : (
    <Link href={href}>
      <Button
        type="button"
        className={clsx(
          'group relative h-9 overflow-hidden bg-transparent text-small font-normal',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        radius="full"
        disabled={disabled}
        aria-label={label}
        onClick={onClick}
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
