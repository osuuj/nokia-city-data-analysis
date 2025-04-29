'use client';

import { Button, Chip, Select, SelectItem, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';

const MAX_SELECTED_INDUSTRIES = 5;

interface IndustrySelectionProps {
  availableIndustries: Array<{ name: string; total: number }>;
  selectedIndustries: string[];
  onIndustryChange: (industries: string[]) => void;
  onIndustryRemove: (industry: string) => void;
  onClearAll: () => void;
  showMaxWarning: boolean;
}

export const IndustrySelection: React.FC<IndustrySelectionProps> = ({
  availableIndustries,
  selectedIndustries,
  onIndustryChange,
  onIndustryRemove,
  onClearAll,
  showMaxWarning,
}) => {
  // Handle industry selection change from Select dropdown
  const handleIndustrySelectionChange = (keys: unknown) => {
    if (!(keys instanceof Set)) return;
    const currentSelectionKeys = keys as Set<React.Key>;

    const namesToStore: string[] = [];
    for (const key of currentSelectionKeys) {
      if (typeof key === 'string') namesToStore.push(key);
    }

    if (namesToStore.length <= MAX_SELECTED_INDUSTRIES) {
      onIndustryChange(namesToStore);
    } else {
      // Just show warning
      setTimeout(() => {
        // No-op, just for warning display timing
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
      <Tooltip
        content={`Select up to ${MAX_SELECTED_INDUSTRIES} industries to display.`}
        placement="bottom"
      >
        <div className="w-full sm:w-auto">
          <Select
            label="Select Industries"
            placeholder="Defaults to Top 5"
            selectionMode="multiple"
            className="w-full sm:max-w-xs sm:min-w-[250px]"
            selectedKeys={selectedIndustries}
            onSelectionChange={handleIndustrySelectionChange}
          >
            {availableIndustries.map((industry) => (
              <SelectItem key={industry.name}>{`${industry.name} (${industry.total})`}</SelectItem>
            ))}
          </Select>
        </div>
      </Tooltip>
      {selectedIndustries.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-1 w-full">
          {selectedIndustries.map((name) => (
            <Chip
              key={name}
              onClose={() => onIndustryRemove(name)}
              variant="flat"
              color="primary"
              size="sm"
            >
              {name}
            </Chip>
          ))}
          <Button
            isIconOnly
            size="sm"
            variant="light"
            aria-label="Clear selected industries"
            onPress={onClearAll}
            className="ml-auto"
          >
            <Icon icon="lucide:x" width={16} />
          </Button>
        </div>
      )}
      {showMaxWarning && (
        <p className="text-tiny text-danger">Max {MAX_SELECTED_INDUSTRIES} industries allowed.</p>
      )}
    </div>
  );
};
