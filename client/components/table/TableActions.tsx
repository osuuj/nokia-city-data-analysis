'use client';

import type { Business } from '@/app/types/business';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface TableActionsProps {
  company: Business;
  onEdit: (company: Business) => void;
  onDelete: (company: Business) => void;
}

export default function TableActions({ company, onEdit, onDelete }: TableActionsProps) {
  return (
    <div className="flex gap-2">
      {/* ✅ View Button */}
      <Button size="sm" variant="light" aria-label={`View details of ${company.company_name}`}>
        <Icon icon="solar:eye-outline" width={16} />
      </Button>

      {/* ✅ Edit Button */}
      <Button
        size="sm"
        variant="light"
        aria-label={`Edit ${company.company_name}`}
        onPress={() => onEdit(company)}
      >
        <Icon icon="solar:pen-outline" width={16} />
      </Button>

      {/* ✅ Delete Button */}
      <Button
        size="sm"
        variant="light"
        color="danger"
        aria-label={`Delete ${company.company_name}`}
        onPress={() => onDelete(company)}
      >
        <Icon icon="solar:trash-bin-outline" width={16} />
      </Button>
    </div>
  );
}
