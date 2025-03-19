import type { SearchInputProps } from '@/components/table/tableConfig';
import { Input } from '@heroui/react';
import { SearchIcon } from '@heroui/shared-icons';

export function SearchInput({ searchTerm, onSearch }: SearchInputProps) {
  return (
    <Input
      className="w-1/6 min-w-[200px]"
      size="sm"
      placeholder="Search company ..."
      startContent={<SearchIcon width={16} />}
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
