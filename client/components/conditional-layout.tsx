'use client';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/navbar';
import { usePathname } from 'next/navigation';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname.startsWith('/home'); // ✅ Check if we are in `/home`

  return (
    <>
      {!isHomePage && <Header />} {/* ✅ Hide Header in `/home` */}
      {children}
      {!isHomePage && <Footer />} {/* ✅ Hide Footer in `/home` */}
    </>
  );
}
