'use client';
import { useFilteredBusinesses } from '@/features/dashboard/hooks/data/useFilteredBusinesses';
import type { CompanyProperties } from '@/features/dashboard/types';
import type { SearchInputProps } from '@/features/dashboard/types';
import { Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

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
 * A completely isolated input for company search.
 */
export function SearchInput({ searchTerm, onSearch }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Track input value changes
  const valueChangedRef = useRef(false);

  // Sync with external searchTerm prop, but only if it wasn't changed by this component
  useEffect(() => {
    if (!valueChangedRef.current && searchTerm !== localSearchTerm) {
      setLocalSearchTerm(searchTerm);
    }
    valueChangedRef.current = false;
  }, [searchTerm, localSearchTerm]);

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      // Always prevent default form submission
      e.preventDefault();

      // Focus the input to keep the user on this control
      inputRef.current?.focus();

      // Always apply search when submitted via form
      onSearch(localSearchTerm);
    },
    [localSearchTerm, onSearch],
  );

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      valueChangedRef.current = true;
      setLocalSearchTerm(e.target.value);

      // Apply search on each keystroke for immediate feedback
      onSearch(e.target.value);
    },
    [onSearch],
  );

  // Submit search on blur
  const handleBlur = useCallback(() => {
    // Always apply search on blur
    onSearch(localSearchTerm);
  }, [localSearchTerm, onSearch]);

  // Handle keydown events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Only handle Enter key
      if (e.key === 'Enter') {
        e.preventDefault();

        // Apply search when Enter is pressed
        onSearch(localSearchTerm);

        // Explicitly return false to prevent default behavior
        return false;
      }
    },
    [localSearchTerm, onSearch],
  );

  return (
    <div className="w-auto min-w-[200px] max-w-[300px]">
      <form ref={formRef} onSubmit={handleSubmit} className="w-full">
        <Input
          ref={inputRef}
          className="w-full"
          classNames={{
            base: 'max-w-full',
            input: 'text-xs md:text-sm truncate',
            inputWrapper: 'h-8 md:h-9',
          }}
          size="sm"
          placeholder="Search company name..."
          startContent={<Icon icon="lucide:search" width={14} className="text-default-400" />}
          value={localSearchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          aria-label="Search for companies"
        />
      </form>
    </div>
  );
}
