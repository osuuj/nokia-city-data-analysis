'use client';

import { Icon } from '@iconify/react';

export default function EmptyState({ message = 'No data available' }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-500">
      <Icon icon="solar:document-broken-outline" width={48} />
      <p className="mt-2">{message}</p>
    </div>
  );
}
