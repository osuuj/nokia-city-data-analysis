'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * About page component with tabs for Juuso and Kassu.
 * Highlights the active tab based on current pathname.
 */
export default function AboutPage() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Juuso', href: '/about/juuso' },
    { name: 'Kassu', href: '/about/kassu' },
  ];

  return (
    <div className="flex flex-col h-full w-full p-6 rounded-medium border-small border-divider">
      <h1 className="text-2xl font-bold mb-4">About Us</h1>
      <div className="flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`px-4 py-2 rounded ${
              pathname === tab.href ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>

      <div className="flex-1">
        {/* The actual dynamic content (Juuso/Kassu) will render here via route segments */}
      </div>
    </div>
  );
}
