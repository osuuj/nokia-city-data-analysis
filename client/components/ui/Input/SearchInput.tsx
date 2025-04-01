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
      className="w-1/6 min-w-[150px]"
      classNames={{
        input: 'text-xs md:text-sm',
      }}
      size="sm"
      placeholder="Search company ..."
      startContent={<SearchIcon width={16} />}
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
