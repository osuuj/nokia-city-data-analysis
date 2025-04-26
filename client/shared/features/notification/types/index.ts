/**
 * Notification types
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * Notification position
 */
export type NotificationPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';

/**
 * Notification options
 */
export interface NotificationOptions {
  id?: string;
  title?: string;
  message: string;
  type?: NotificationType;
  duration?: number;
  position?: NotificationPosition;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

/**
 * Notification item
 */
export interface NotificationItem extends NotificationOptions {
  id: string;
  createdAt: Date;
}

/**
 * Notification context state
 */
export interface NotificationState {
  notifications: NotificationItem[];
  position: NotificationPosition;
  maxNotifications: number;
}

/**
 * Notification context value
 */
export interface NotificationContextValue extends NotificationState {
  show: (options: NotificationOptions) => string;
  hide: (id: string) => void;
  hideAll: () => void;
  updatePosition: (position: NotificationPosition) => void;
  updateMaxNotifications: (max: number) => void;
}
