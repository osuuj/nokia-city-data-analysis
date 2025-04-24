'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Navbar/Header';
import { usePathname } from 'next/navigation';

/**
 * ConditionalLayout
 * A layout wrapper that hides Header/Footer on specific routes (e.g., `/dashboard`).
 *
 * @param children - React children to be wrapped in the layout
 */
export const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith('/dashboard');

  // Check if current page should have black background
  const isBlackBgPage =
    pathname.startsWith('/resources') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact');

  return (
    <>
      {!isDashboardPage && <Header />}
      {children}
      {!isDashboardPage && <Footer />}
    </>
  );
};
