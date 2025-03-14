'use client';

import { HeroUIProvider } from '@heroui/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: object;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="data-theme" defaultTheme="dark" {...themeProps}>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
