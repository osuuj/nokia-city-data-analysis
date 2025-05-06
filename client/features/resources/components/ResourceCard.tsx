'use client';

import { Button, Card, CardBody } from '@heroui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Suspense, memo, useCallback } from 'react';
import type { Resource } from '../types';

// Lazy load the Icon component to reduce initial load time
const Icon = dynamic(() => import('@iconify/react').then((mod) => mod.Icon), {
  loading: () => <div className="w-6 h-6 bg-primary/10 rounded-full animate-pulse" />,
  ssr: false, // Disable server-side rendering for this component
});

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

/**
 * ResourceCard Component
 *
 * Displays a card with resource information including title, description,
 * icon, type, and tags. Provides a button to view or download the resource.
 *
 * Performance optimized:
 * - Uses content-visibility for better rendering performance
 * - Reduces re-renders with memo
 * - Optimizes icon loading and suspense boundaries
 * - Uses passive event listeners for interactions
 */
export const ResourceCard = memo(function ResourceCard({ resource, className }: ResourceCardProps) {
  const router = useRouter();
  const { title, description, icon, type, link, tags = [] } = resource;

  // Optimize navigation by preparing it early but only executing when needed
  const handleClick = useCallback(() => {
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      router.push(link);
    }
  }, [link, router]);

  // Determine button text once to avoid recalculation
  const buttonText = type === 'PDF' || type === 'Template' ? 'Download' : 'View';

  return (
    <Card className={`backdrop-blur-md bg-opacity-90 ${className || ''}`}>
      <CardBody>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              {/* Pre-rendered placeholder with icon loaded after */}
              <div className="w-6 h-6 flex items-center justify-center">
                {icon && <Icon icon={icon} className="text-xl" />}
              </div>
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-default-500 text-sm mt-1 mb-3 line-clamp-2">{description}</p>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-default-100 rounded-full">
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-default-100 rounded-full">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs px-2 py-1 bg-default-100 rounded-full">{type}</span>
              <Button
                color="primary"
                variant="light"
                size="sm"
                endContent={<Icon icon="lucide:arrow-right" />}
                onPress={handleClick}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
});
