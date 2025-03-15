'use client';

import { Badge } from '@heroui/react';

type StatusType = 'active' | 'inactive' | 'pending';

const statusColors: Record<StatusType, 'success' | 'danger' | 'warning'> = {
  active: 'success',
  inactive: 'danger',
  pending: 'warning',
};

export default function StatusIndicator({ status }: { status: string }) {
  const safeStatus = (status as StatusType) in statusColors ? (status as StatusType) : 'pending';

  return <Badge color={statusColors[safeStatus]}>{status}</Badge>;
}
