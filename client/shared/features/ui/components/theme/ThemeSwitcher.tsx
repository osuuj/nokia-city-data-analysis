'use client';

import type { FC } from 'react';

import { ThemeSwitch } from './ThemeSwitch';

/**
 * ThemeSwitcher Component
 *
 * A wrapper component that provides the theme switching functionality.
 * This component can be extended with additional features like animations or tooltips.
 *
 * @example
 * <ThemeSwitcher />
 */
export const ThemeSwitcher: FC = () => {
  return <ThemeSwitch />;
};
