'use client';

import { cn } from '@/shared/utils/cn';
import { Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

export interface FilterTagProps {
  label: string;
  icon?: string;
  color?: string;
  onRemove: () => void;
}

export function FilterTag({ label, icon, color = 'text-primary-500', onRemove }: FilterTagProps) {
  return (
    <Chip
      size="sm"
      radius="sm"
      variant="flat"
      className={cn(
        'bg-primary-50 text-primary-700 border-primary-200 focus:outline-none focus:ring-0 text-[10px] xs:text-xs',
        'transition-colors duration-200 hover:bg-primary-100',
      )}
      startContent={
        icon ? (
          <Icon
            icon={icon}
            className={cn('text-primary-500 shrink-0', color)}
            width={12}
            aria-hidden="true"
          />
        ) : null
      }
      onClose={onRemove}
      aria-label={`Filter: ${label}. Click to remove.`}
    >
      <span className="truncate">{label}</span>
    </Chip>
  );
}
