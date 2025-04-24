'use client';

import { Button, Card, CardBody, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import type { Resource } from '../types';

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const router = useRouter();
  const { title, description, icon, type, link, tags } = resource;

  const handleClick = () => {
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      router.push(link);
    }
  };

  return (
    <Card className={`backdrop-blur-md bg-opacity-90 ${className || ''}`}>
      <CardBody>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon icon={icon} className="text-xl" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-default-500 text-sm mt-1 mb-3">{description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags?.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-default-100 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs px-2 py-1 bg-default-100 rounded-full">{type}</span>
              <Button
                color="primary"
                variant="light"
                size="sm"
                endContent={<Icon icon="lucide:arrow-right" />}
                onPress={handleClick}
              >
                {type === 'PDF' || type === 'Template' ? 'Download' : 'View'}
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
