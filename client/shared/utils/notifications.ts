import { type NotificationType, useNotificationStore } from '../context/notifications/store';

interface SystemNotification {
  description: string;
  type?: NotificationType;
  name?: string;
}

export const addSystemNotification = (notification: SystemNotification) => {
  const store = useNotificationStore.getState();
  store.addNotification({
    description: notification.description,
    type: notification.type || 'default',
    name: notification.name || 'System Alert',
  });
};

export const notifySystemError = (description: string) => {
  addSystemNotification({
    description,
    type: 'error',
    name: 'System Error',
  });
};

export const notifySystemWarning = (description: string) => {
  addSystemNotification({
    description,
    type: 'warning',
    name: 'System Warning',
  });
};

export const notifySystemSuccess = (description: string) => {
  addSystemNotification({
    description,
    type: 'success',
    name: 'System Update',
  });
};

export const notifyMaintenance = (description: string) => {
  addSystemNotification({
    description,
    type: 'warning',
    name: 'Maintenance',
  });
};
