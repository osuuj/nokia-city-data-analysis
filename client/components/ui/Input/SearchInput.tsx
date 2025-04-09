'use client';

import type { SearchInputProps } from '@/types/table';
import { Input } from '@heroui/react';
import { SearchIcon } from '@heroui/shared-icons';

/**
 * SearchInput
 * A small input used to filter table content by keyword.
 */
export function SearchInput({ searchTerm, onSearch }: SearchInputProps) {
  return (
    <Input
      className="w-full xs:w-auto min-w-0 xs:min-w-[150px] flex-grow xs:flex-grow-0"
      classNames={{
        base: 'max-w-full xs:max-w-[300px]',
        input: 'text-xs md:text-sm truncate',
        inputWrapper: 'h-8 md:h-9',
      }}
      size="sm"
      placeholder="Search company..."
      startContent={<SearchIcon width={16} className="text-default-400 flex-shrink-0" />}
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
