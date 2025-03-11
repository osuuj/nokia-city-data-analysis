'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AboutPage() {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="flex flex-col h-full w-full p-6 rounded-medium border-small border-divider">
      <h1 className="text-2xl font-bold mb-4">About Us</h1>
      <div className="flex space-x-4 mb-4">
        <Link
          href="/about/juuso"
          className={`px-4 py-2 rounded ${pathname === '/about/juuso' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Juuso
        </Link>
        <Link
          href="/about/kassu"
          className={`px-4 py-2 rounded ${pathname === '/about/kassu' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Kassu
        </Link>
      </div>
      <div className="flex-1">{/* This is where the child pages will be rendered */}</div>
    </div>
  );
}
