'use client';

import { cn } from '@/shared/utils/cn';
import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import React from 'react';
import { AnalyticsSkeleton } from './loading';

export interface BaseCardProps {
  /** Title of the card */
  title: string;
  /** Additional header content to be rendered next to the title */
  headerContent?: React.ReactNode;
  /** Main content of the card */
  children: React.ReactNode;
  /** Whether the card is in a loading state */
  isLoading?: boolean;
  /** Error object if there's an error */
  error?: Error | null;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional class names for the card */
  className?: string;
  /** Additional class names for the header */
  headerClassName?: string;
  /** Additional class names for the body */
  bodyClassName?: string;
  /** Whether to show the divider between header and body */
  showDivider?: boolean;
  /** The type of analytics card */
  analyticsType?: 'distribution' | 'comparison' | 'trends';
}

/**
 * Custom comparison function for BaseCard props
 * Only re-renders when important props change
 */
const arePropsEqual = (prevProps: BaseCardProps, nextProps: BaseCardProps): boolean => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.error === nextProps.error &&
    prevProps.emptyMessage === nextProps.emptyMessage &&
    prevProps.className === nextProps.className &&
    prevProps.headerClassName === nextProps.headerClassName &&
    prevProps.bodyClassName === nextProps.bodyClassName &&
    prevProps.showDivider === nextProps.showDivider &&
    prevProps.analyticsType === nextProps.analyticsType &&
    prevProps.headerContent === nextProps.headerContent &&
    prevProps.loadingComponent === nextProps.loadingComponent &&
    prevProps.errorComponent === nextProps.errorComponent &&
    prevProps.children === nextProps.children
  );
};

/**
 * BaseCard component that provides consistent styling and behavior for dashboard cards
 *
 * @example
 * ```tsx
 * <BaseCard
 *   title="My Card"
 *   isLoading={isLoading}
 *   error={error}
 *   headerContent={<Button>Action</Button>}
 * >
 *   <MyContent />
 * </BaseCard>
 * ```
 */
export const BaseCard = React.memo<BaseCardProps>(
  ({
    title,
    headerContent,
    children,
    isLoading = false,
    error = null,
    loadingComponent,
    errorComponent,
    emptyMessage = 'No data available.',
    className = '',
    headerClassName = '',
    bodyClassName = '',
    showDivider = true,
    analyticsType,
  }) => {
    const defaultCardClass = 'border border-default-200';
    const defaultHeaderClass =
      'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-3 sm:px-6';
    const defaultBodyClass =
      'px-2 sm:px-6 py-2 sm:py-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center';

    const renderContent = () => {
      if (isLoading) {
        if (loadingComponent) {
          return loadingComponent;
        }
        if (analyticsType) {
          return <AnalyticsSkeleton type={analyticsType} />;
        }
        return (
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-4 bg-default-200 rounded w-3/4" />
            <div className="h-4 bg-default-200 rounded w-1/2" />
            <div className="h-4 bg-default-200 rounded w-2/3" />
          </div>
        );
      }

      if (error) {
        return (
          errorComponent || (
            <p className="text-center text-danger">{error.message || 'An error occurred.'}</p>
          )
        );
      }

      if (React.Children.count(children) === 0) {
        return <p className="text-center text-default-500">{emptyMessage}</p>;
      }

      return children;
    };

    return (
      <Card className={cn(defaultCardClass, className)}>
        <CardHeader className={cn(defaultHeaderClass, headerClassName)}>
          <h2 className="text-lg font-bold">{title}</h2>
          {headerContent}
        </CardHeader>
        {showDivider && <Divider className="my-1 sm:my-2" />}
        <CardBody className={cn(defaultBodyClass, bodyClassName)}>{renderContent()}</CardBody>
      </Card>
    );
  },
  arePropsEqual,
);

BaseCard.displayName = 'BaseCard';
