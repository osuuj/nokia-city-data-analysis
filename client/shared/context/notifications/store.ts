import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type NotificationType = 'default' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  isRead: boolean;
  isArchived: boolean;
  description: string;
  name: string;
  time: string;
  type: NotificationType;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, 'id' | 'time' | 'isRead' | 'isArchived'>,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  archiveAll: (ids: string[]) => void;
  deleteNotification: (id: string) => void;
  clearArchived: () => void;
  resetNotifications: () => void;
}

// Keep archived notifications for 7 days
const ARCHIVE_RETENTION_DAYS = 7;

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    persist(
      (set, get) => ({
        notifications: [],

        addNotification: (notification) => {
          // Clean up old archived notifications before adding new ones
          const now = new Date();
          const cleanedNotifications = get().notifications.filter((n) => {
            if (!n.isArchived) return true;
            const notificationDate = new Date(n.time);
            const daysDiff = (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24);
            return daysDiff <= ARCHIVE_RETENTION_DAYS;
          });

          set((state) => ({
            notifications: [
              {
                ...notification,
                id: Date.now().toString(),
                time: new Date().toISOString(),
                isRead: false,
                isArchived: false,
              },
              ...cleanedNotifications,
            ],
          }));
        },

        markAsRead: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true } : n,
            ),
          })),

        markAllAsRead: () =>
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          })),

        archiveNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, isArchived: true, isRead: true } : n,
            ),
          })),

        archiveAll: (ids) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              ids.includes(n.id) ? { ...n, isArchived: true, isRead: true } : n,
            ),
          })),

        deleteNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        clearArchived: () =>
          set((state) => ({
            notifications: state.notifications.filter((n) => !n.isArchived),
          })),

        resetNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'notifications-storage',
        // Only persist non-archived notifications
        partialize: (state) => ({
          ...state,
          notifications: state.notifications.filter(
            (n) =>
              !n.isArchived ||
              (new Date().getTime() - new Date(n.time).getTime()) / (1000 * 60 * 60 * 24) <=
                ARCHIVE_RETENTION_DAYS,
          ),
        }),
      },
    ),
  ),
);
