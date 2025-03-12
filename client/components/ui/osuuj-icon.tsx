'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Logo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder while the theme is being determined
    return <div style={{ width: '60px', height: '60px' }} />;
  }

  const logoSrc = theme === 'light' ? '/ouuj_black.svg' : '/ouuj_color.svg';

  return (
    <Image
      src={logoSrc}
      alt="Logo"
      width={60}
      height={60}
      style={{ width: '60px', height: '60px' }}
      priority // Ensures fast loading
    />
  );
}
