'use client';

import { Button } from '@heroui/react';
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
}) => {
  const isExternal = href.startsWith('http');

  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-800 to-blue-400 text-white shadow-lg focus:outline-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {label}
    </a>
  ) : (
    <Link href={href}>
      <Button
        type="button"
        className={clsx(
          'bg-gradient-to-tr from-blue-800 to-blue-400 text-white shadow-lg focus:outline-none',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        radius="full"
        disabled={disabled}
        aria-label={label}
      >
        {label}
      </Button>
    </Link>
  );
};
