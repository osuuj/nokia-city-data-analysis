'use client';

import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  NotificationContextValue,
  NotificationItem,
  NotificationOptions,
  NotificationPosition,
  NotificationState,
} from '../types';

// Default context value
const defaultContextValue: NotificationContextValue = {
  notifications: [],
  position: 'top-right',
  maxNotifications: 5,
  show: () => '',
  hide: () => {},
  hideAll: () => {},
  updatePosition: () => {},
  updateMaxNotifications: () => {},
};

// Create context
const NotificationContext = createContext<NotificationContextValue>(defaultContextValue);

// Provider props
interface NotificationProviderProps {
  children: React.ReactNode;
  defaultPosition?: NotificationPosition;
  defaultMaxNotifications?: number;
}

/**
 * NotificationProvider component
 *
 * @example
 * ```tsx
 * <NotificationProvider defaultPosition="top-right" defaultMaxNotifications={5}>
 *   <App />
 * </NotificationProvider>
 * ```
 */
export function NotificationProvider({
  children,
  defaultPosition = 'top-right',
  defaultMaxNotifications = 5,
}: NotificationProviderProps) {
  // State
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    position: defaultPosition,
    maxNotifications: defaultMaxNotifications,
  });

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  // Set mounted state
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Show notification
  const show = useCallback((options: NotificationOptions) => {
    const id = options.id || uuidv4();

    if (!isMounted.current) return id;

    setState((prevState) => {
      // Create new notification
      const newNotification: NotificationItem = {
        ...options,
        id,
        createdAt: new Date(),
      };

      // Add to notifications array, respecting maxNotifications
      const updatedNotifications = [...prevState.notifications, newNotification].slice(
        -prevState.maxNotifications,
      );

      return {
        ...prevState,
        notifications: updatedNotifications,
      };
    });

    // Auto-hide if duration is set
    if (options.duration !== 0) {
      const duration = options.duration || 5000;
      setTimeout(() => {
        if (isMounted.current) {
          hide(id);
        }
      }, duration);
    }

    return id;
  }, []);

  // Hide notification
  const hide = useCallback((id: string) => {
    if (!isMounted.current) return;

    setState((prevState) => {
      const notification = prevState.notifications.find((n) => n.id === id);

      // Call onClose if provided
      if (notification?.onClose) {
        notification.onClose();
      }

      return {
        ...prevState,
        notifications: prevState.notifications.filter((n) => n.id !== id),
      };
    });
  }, []);

  // Hide all notifications
  const hideAll = useCallback(() => {
    if (!isMounted.current) return;

    setState((prevState) => ({
      ...prevState,
      notifications: [],
    }));
  }, []);

  // Update position
  const updatePosition = useCallback((position: NotificationPosition) => {
    if (!isMounted.current) return;

    setState((prevState) => ({
      ...prevState,
      position,
    }));
  }, []);

  // Update max notifications
  const updateMaxNotifications = useCallback((max: number) => {
    if (!isMounted.current) return;

    setState((prevState) => ({
      ...prevState,
      maxNotifications: max,
      // Trim notifications if needed
      notifications: prevState.notifications.slice(-max),
    }));
  }, []);

  // Context value
  const contextValue: NotificationContextValue = {
    ...state,
    show,
    hide,
    hideAll,
    updatePosition,
    updateMaxNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
}

/**
 * Hook to use the notification context
 *
 * @example
 * ```tsx
 * const { show, hide } = useNotification();
 *
 * // Show a notification
 * show({
 *   title: 'Success',
 *   message: 'Operation completed successfully',
 *   type: 'success'
 * });
 *
 * // Hide a notification
 * hide('notification-id');
 * ```
 */
export function useNotification() {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
}
