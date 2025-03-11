import { Accordion, AccordionItem, Listbox, ListboxItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';

type FilterDropdownProps = {
  filters: { key: string; title: string; icon: string }[];
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({ filters }) => {
  return (
    <Accordion>
      <AccordionItem
        title={
          <div className="flex items-center gap-2">
            <Icon icon="solar:filter-bold" width={24} />
            <span>Filters</span>
          </div>
        }
      >
        <Listbox>
          {filters.map((filter) => (
            <ListboxItem key={filter.key}>
              <div className="flex items-center gap-2">
                <Icon icon={filter.icon} width={24} />
                <span>{filter.title}</span>
              </div>
            </ListboxItem>
          ))}
        </Listbox>
      </AccordionItem>
    </Accordion>
  );
};

export default FilterDropdown;
