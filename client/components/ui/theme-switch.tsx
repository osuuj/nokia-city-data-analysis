'use client';

import { Button } from '@heroui/react';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { type FC, useEffect, useState } from 'react';

import { MoonFilledIcon, SunFilledIcon } from '@/components/ui/icons';

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return null;
  }

  return (
    <Button
      isIconOnly
      radius="full"
      variant="light"
      onPress={toggleTheme}
      className={clsx('cursor-pointer transition-opacity hover:opacity-80', className)}
    >
      <VisuallyHidden>
        <input
          type="checkbox"
          id="theme-switch"
          name="theme-switch"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        />
      </VisuallyHidden>
      {theme === 'light' ? <MoonFilledIcon size={22} /> : <SunFilledIcon size={22} />}
    </Button>
  );
};
