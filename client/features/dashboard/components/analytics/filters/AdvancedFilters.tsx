'use client';

import {
  Button,
  Checkbox,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Slider,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';
import { useState } from 'react';

export interface FilterOption {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number | boolean | Date;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, string | number | boolean | Date>;
}

export interface AdvancedFiltersProps {
  filterOptions: FilterOption[];
  onFilterChange: (filters: Record<string, string | number | boolean | Date>) => void;
  onSavePreset?: (preset: Omit<FilterPreset, 'id'>) => void;
  onLoadPreset?: (presetId: string) => void;
  savedPresets?: FilterPreset[];
  className?: string;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filterOptions,
  onFilterChange,
  onSavePreset,
  onLoadPreset,
  savedPresets = [],
  className = '',
}) => {
  const [activeFilters, setActiveFilters] = useState<
    Record<string, string | number | boolean | Date>
  >(() => {
    // Initialize with default values
    const defaults: Record<string, string | number | boolean | Date> = {};
    for (const option of filterOptions) {
      if (option.defaultValue !== undefined) {
        defaults[option.id] = option.defaultValue;
      }
    }
    return defaults;
  });

  const [newPresetName, setNewPresetName] = useState('');
  const [isPresetMenuOpen, setIsPresetMenuOpen] = useState(false);
  const [isSavePresetOpen, setIsSavePresetOpen] = useState(false);

  // Handle filter value changes
  const handleFilterChange = (id: string, value: string | number | boolean | Date) => {
    const updatedFilters = { ...activeFilters, [id]: value };
    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Handle saving a new preset
  const handleSavePreset = () => {
    if (newPresetName.trim() && onSavePreset) {
      onSavePreset({
        name: newPresetName.trim(),
        filters: activeFilters,
      });
      setNewPresetName('');
      setIsSavePresetOpen(false);
    }
  };

  // Handle loading a preset
  const handleLoadPreset = (presetId: string) => {
    if (onLoadPreset) {
      onLoadPreset(presetId);
      setIsPresetMenuOpen(false);
    }
  };

  // Render filter input based on type
  const renderFilterInput = (option: FilterOption) => {
    switch (option.type) {
      case 'text':
        return (
          <Input
            id={option.id}
            value={String(activeFilters[option.id] || '')}
            onChange={(e) => handleFilterChange(option.id, e.target.value)}
            placeholder={`Filter by ${option.name.toLowerCase()}`}
            className="w-full"
          />
        );

      case 'number':
        return (
          <Input
            id={option.id}
            type="number"
            value={String(activeFilters[option.id] || '')}
            onChange={(e) =>
              handleFilterChange(option.id, e.target.value ? Number(e.target.value) : '')
            }
            placeholder={`Filter by ${option.name.toLowerCase()}`}
            min={option.min}
            max={option.max}
            step={option.step}
            className="w-full"
          />
        );

      case 'select':
        return (
          <Select
            id={option.id}
            value={String(activeFilters[option.id] || '')}
            onChange={(value) => handleFilterChange(option.id, value)}
            placeholder={`Select ${option.name.toLowerCase()}`}
            className="w-full"
          >
            {option.options?.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </Select>
        );

      case 'date':
        return (
          <Input
            id={option.id}
            type="date"
            value={String(activeFilters[option.id] || '')}
            onChange={(e) => handleFilterChange(option.id, e.target.value)}
            className="w-full"
          />
        );

      case 'boolean':
        return (
          <Checkbox
            id={option.id}
            isSelected={Boolean(activeFilters[option.id])}
            onValueChange={(value) => handleFilterChange(option.id, value)}
          >
            {option.name}
          </Checkbox>
        );

      default:
        return null;
    }
  };

  // Count active filters (excluding empty values)
  const activeFilterCount = Object.values(activeFilters).filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  }).length;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Advanced Filters</h3>
        <div className="flex items-center gap-2">
          {savedPresets.length > 0 && (
            <Dropdown isOpen={isPresetMenuOpen} onOpenChange={setIsPresetMenuOpen}>
              <DropdownTrigger>
                <Button size="sm" variant="flat">
                  Load Preset
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Filter presets">
                {savedPresets.map((preset) => (
                  <DropdownItem key={preset.id} onClick={() => handleLoadPreset(preset.id)}>
                    {preset.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}

          {onSavePreset && (
            <Popover isOpen={isSavePresetOpen} onOpenChange={setIsSavePresetOpen}>
              <PopoverTrigger>
                <Button size="sm" variant="flat">
                  Save Preset
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-4 flex flex-col gap-3">
                  <Input
                    placeholder="Preset name"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                  />
                  <Button
                    color="primary"
                    onClick={handleSavePreset}
                    isDisabled={!newPresetName.trim()}
                  >
                    Save
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([id, value]) => {
            // Skip empty values
            if (Array.isArray(value) && value.length === 0) return null;
            if (value === null || value === undefined) return null;
            if (typeof value === 'string' && value.trim() === '') return null;

            const option = filterOptions.find((opt) => opt.id === id);
            if (!option) return null;

            let displayValue = String(value);
            if (Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (option.type === 'select') {
              const selectedOption = option.options?.find((opt) => opt === value);
              if (selectedOption) {
                displayValue = selectedOption;
              }
            }

            return (
              <Chip
                key={id}
                onClose={() => handleFilterChange(id, option.type === 'select' ? '' : '')}
                variant="flat"
                size="sm"
              >
                {option.name}: {displayValue}
              </Chip>
            );
          })}
          <Button
            size="sm"
            variant="light"
            onClick={() => {
              const clearedFilters: Record<string, string | number | boolean | Date> = {};
              for (const option of filterOptions) {
                clearedFilters[option.id] = option.type === 'select' ? '' : '';
              }
              setActiveFilters(clearedFilters);
              onFilterChange(clearedFilters);
            }}
          >
            Clear All
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterOptions.map((option) => (
          <div key={option.id} className="flex flex-col gap-1">
            <label htmlFor={option.id} className="text-sm font-medium">
              {option.name}
            </label>
            {renderFilterInput(option)}
          </div>
        ))}
      </div>
    </div>
  );
};
