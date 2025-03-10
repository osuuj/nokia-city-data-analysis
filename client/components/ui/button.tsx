'use client';

import { Button } from '@heroui/react';
import Link from 'next/link';

export default function ButtonStart() {
  return (
    <Link href="/home">
      <Button
        className="bg-gradient-to-tr from-blue-800 to-blue-400 text-white shadow-lg focus:outline-none"
        radius="full"
      >
        Start Exploring
      </Button>
    </Link>
  );
}
