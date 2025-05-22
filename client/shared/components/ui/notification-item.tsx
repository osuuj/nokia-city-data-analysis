'use client';

import { Badge, cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';

export type NotificationType = 'default' | 'warning' | 'error' | 'success';

export type NotificationItem = {
  id: string;
  isRead?: boolean;
  isArchived?: boolean;
  avatar?: string;
  description: string;
  name: string;
  time: string;
  type?: NotificationType;
};

export type NotificationItemProps = React.HTMLAttributes<HTMLDivElement> & NotificationItem;

export const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
  (
    { children, avatar, name, description, type, time, isRead, isArchived, className, ...domProps },
    ref,
  ) => {
    const getTypeStyles = (type: NotificationType | undefined) => {
      switch (type) {
        case 'warning':
          return 'bg-warning-50 dark:bg-warning-900/20';
        case 'error':
          return 'bg-danger-50 dark:bg-danger-900/20';
        case 'success':
          return 'bg-success-50 dark:bg-success-900/20';
        default:
          return '';
      }
    };

    const getTypeIcon = (type: NotificationType | undefined) => {
      switch (type) {
        case 'warning':
          return 'solar:danger-triangle-bold';
        case 'error':
          return 'solar:danger-circle-bold';
        case 'success':
          return 'solar:check-circle-bold';
        default:
          return 'solar:bell-bold';
      }
    };

    const getTypeColor = (type: NotificationType | undefined) => {
      switch (type) {
        case 'warning':
          return 'warning';
        case 'error':
          return 'danger';
        case 'success':
          return 'success';
        default:
          return 'primary';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-3 border-b border-divider px-6 py-4',
          {
            [getTypeStyles(type)]: !isRead,
          },
          className,
        )}
        {...domProps}
      >
        <div className="relative flex-none">
          <Badge
            color={getTypeColor(type)}
            content=""
            isInvisible={isRead}
            placement="bottom-right"
            shape="circle"
          >
            <div className="w-10 h-10 rounded-full bg-default-100 dark:bg-default-50 flex items-center justify-center">
              <Icon icon={getTypeIcon(type)} className={`text-${getTypeColor(type)}`} width={24} />
            </div>
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-small text-foreground">
            <strong className="font-medium">{name}</strong> {description || children}
          </p>
          <time className="text-tiny text-default-400">{time}</time>
        </div>
      </div>
    );
  },
);

NotificationItem.displayName = 'NotificationItem';
