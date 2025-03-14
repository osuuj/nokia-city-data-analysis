'use client';

import clsx from 'clsx';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface OsuujLogoProps {
  large?: boolean;
  className?: string;
}

export default function OsuujLogo({ large = false, className = '' }: OsuujLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 bg-gray-300 animate-pulse" />;
  }

  const logoSrc = resolvedTheme === 'light' ? '/ouuj-black.svg' : '/ouuj-color.svg';

  return (
    <div className={clsx('relative w-14 h-14', className)}>
      <Image src={logoSrc} alt="Osuuj Logo" fill className="object-contain" priority={large} />
    </div>
  );
}
