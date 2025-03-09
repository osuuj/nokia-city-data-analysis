'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function Logo() {
  const { theme } = useTheme();

  const logoSrc = theme === 'light' ? '/ouuj_black.svg' : '/ouuj_color.svg';

  return (
    <Image
      src={logoSrc}
      alt="Ouuj Logo"
      width={60}
      height={60}
      priority // Ensures fast loading
    />
  );
}
