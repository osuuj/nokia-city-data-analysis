'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

interface UseCaseBoxProps {
  title: string;
  description: string;
  icon: string;
  className?: string;
}

/**
 * UseCaseBox component
 *
 * A reusable component for displaying use cases in documentation pages
 */
export function UseCaseBox({ title, description, icon, className = '' }: UseCaseBoxProps) {
  return (
    <Card className={`border border-default-200 dark:border-default-800 ${className}`}>
      <CardBody className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon icon={icon} className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-default-600 text-sm">{description}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
