'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { NotificationItem, type NotificationPosition } from '../types';
import { Notification } from './Notification';

// Position styles
const positionStyles: Record<NotificationPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

/**
 * NotificationContainer component that displays notifications
 *
 * @example
 * ```tsx
 * <NotificationContainer />
 * ```
 */
export function NotificationContainer() {
  const { notifications, position } = useNotification();

  // Get position style
  const positionStyle = positionStyles[position];

  // Determine if notifications should be stacked vertically or horizontally
  const isVertical = position.includes('top') || position.includes('bottom');

  return (
    <div
      className={`fixed z-50 ${positionStyle} flex ${isVertical ? 'flex-col' : 'flex-row'} gap-2`}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, scale: 0.8, y: isVertical ? -20 : 0, x: isVertical ? 0 : -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: isVertical ? -20 : 0, x: isVertical ? 0 : -20 }}
            transition={{ duration: 0.2 }}
          >
            <Notification notification={notification} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
