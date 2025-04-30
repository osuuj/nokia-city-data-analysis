'use client';

import type { SearchInputProps } from '@/features/dashboard/types';
import { Input } from '@heroui/react';
import { useCallback } from 'react';

/**
 * CustomSearchIcon
 * A search icon without conflicting accessibility attributes
 */
const CustomSearchIcon = ({ width = 16, className = '' }) => (
  <svg
    fill="none"
    height={width}
    viewBox="0 0 24 24"
    width={width}
    className={className}
    role="img"
    aria-label="Search"
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

/**
 * SearchInput
 * A small input used to filter table content by keyword.
 */
export function SearchInput({ searchTerm, onSearch }: SearchInputProps) {
  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Focus is already on the input, so this prevents further propagation
  }, []);

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value);
    },
    [onSearch],
  );

  // Handle key down to prevent default behaviors
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      e.stopPropagation(); // Stop event propagation
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-auto min-w-[200px] max-w-[300px]">
      <Input
        className="w-full"
        classNames={{
          base: 'max-w-full',
          input: 'text-xs md:text-sm truncate',
          inputWrapper: 'h-8 md:h-9',
        }}
        size="sm"
        placeholder="Search company name..."
        startContent={<CustomSearchIcon width={16} className="text-default-400 flex-shrink-0" />}
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label="Search for companies"
      />
    </form>
  );
}
