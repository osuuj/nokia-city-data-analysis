'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';
import { useNotification } from '../context/NotificationContext';
import type { NotificationItem, NotificationType } from '../types';

// Type styles
const typeStyles: Record<NotificationType, { bg: string; text: string; icon: string }> = {
  info: { bg: 'bg-info-50', text: 'text-info-600', icon: 'lucide:info' },
  success: { bg: 'bg-success-50', text: 'text-success-600', icon: 'lucide:check-circle' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-600', icon: 'lucide:alert-triangle' },
  error: { bg: 'bg-danger-50', text: 'text-danger-600', icon: 'lucide:alert-circle' },
};

/**
 * Notification component that displays a single notification
 *
 * @example
 * ```tsx
 * <Notification notification={notificationItem} />
 * ```
 */
export function Notification({ notification }: { notification: NotificationItem }) {
  const { hide } = useNotification();
  const { id, title, message, type = 'info', action } = notification;

  // Get type style
  const style = typeStyles[type];

  return (
    <div
      className={`${style.bg} ${style.text} p-4 rounded-lg shadow-md max-w-md w-full flex items-start gap-3`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Icon icon={style.icon} width={20} height={20} />
      </div>

      <div className="flex-grow">
        {title && <h3 className="font-medium mb-1">{title}</h3>}
        <p className="text-sm">{message}</p>

        {action && (
          <div className="mt-2">
            <Button
              size="sm"
              variant="light"
              color={type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'primary'}
              onClick={() => {
                action.onClick();
                hide(id);
              }}
            >
              {action.label}
            </Button>
          </div>
        )}
      </div>

      <button
        type="button"
        className="flex-shrink-0 text-default-400 hover:text-default-600"
        onClick={() => hide(id)}
        aria-label="Close notification"
      >
        <Icon icon="lucide:x" width={16} height={16} />
      </button>
    </div>
  );
}
