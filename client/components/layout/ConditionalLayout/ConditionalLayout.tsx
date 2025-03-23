'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Navbar';
import { usePathname } from 'next/navigation';

/**
 * ConditionalLayout
 * A layout wrapper that hides Header/Footer on specific routes (e.g., `/home`).
 *
 * @param children - React children to be wrapped in the layout
 */
export const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isHomePage = pathname.startsWith('/home');

  return (
    <>
      {!isHomePage && <Header />}
      {children}
      {!isHomePage && <Footer />}
    </>
  );
};
