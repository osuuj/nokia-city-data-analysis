'use client';

import { useNotificationStore } from '@/shared/context/notifications/store';
import type { CardProps } from '@heroui/react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  ScrollShadow,
  Tab,
  Tabs,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useMemo } from 'react';
import { NotificationItem } from './notification-item';

enum NotificationTabs {
  All = 'all',
  System = 'system',
  Archive = 'archive',
}

export const NotificationsCard = (props: CardProps) => {
  const [activeTab, setActiveTab] = React.useState<NotificationTabs>(NotificationTabs.All);
  const { notifications, markAllAsRead, archiveAll } = useNotificationStore();

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case NotificationTabs.System:
        return notifications.filter(
          (n) =>
            !n.isArchived && (n.type === 'warning' || n.type === 'error' || n.type === 'success'),
        );
      case NotificationTabs.Archive:
        return notifications.filter((n) => n.isArchived);
      default:
        return notifications.filter((n) => !n.isArchived);
    }
  }, [activeTab, notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead && !n.isArchived).length,
    [notifications],
  );

  const systemCount = useMemo(
    () =>
      notifications.filter(
        (n) =>
          !n.isArchived &&
          (n.type === 'warning' || n.type === 'error' || n.type === 'success') &&
          !n.isRead,
      ).length,
    [notifications],
  );

  const handleArchiveAll = () => {
    // Archive all notifications in the current filtered view
    const ids = filteredNotifications.map((n) => n.id);
    archiveAll(ids);
  };

  return (
    <Card className="w-full max-w-[420px]" {...props}>
      <CardHeader className="flex flex-col px-0 pb-0">
        <div className="flex w-full items-center justify-between px-5 py-2">
          <div className="inline-flex items-center gap-1">
            <h4 className="inline-block align-middle text-large font-medium">Notifications</h4>
            <Chip size="sm" variant="flat" color={unreadCount > 0 ? 'warning' : 'default'}>
              {unreadCount}
            </Chip>
          </div>
          <Button
            className="h-8 px-3"
            color="primary"
            radius="full"
            variant="light"
            onPress={markAllAsRead}
            isDisabled={activeTab === NotificationTabs.Archive}
          >
            Mark all as read
          </Button>
        </div>
        <Tabs
          aria-label="Notifications"
          classNames={{
            base: 'w-full',
            tabList: 'gap-6 px-6 py-0 w-full relative rounded-none border-b border-divider',
            cursor: 'w-full',
            tab: 'max-w-fit px-2 h-12',
          }}
          color="primary"
          selectedKey={activeTab}
          variant="underlined"
          onSelectionChange={(selected) => setActiveTab(selected as NotificationTabs)}
        >
          <Tab
            key="all"
            title={
              <div className="flex items-center space-x-2">
                <span>All</span>
                <Chip size="sm" variant="flat" color={unreadCount > 0 ? 'warning' : 'default'}>
                  {notifications.filter((n) => !n.isArchived).length}
                </Chip>
              </div>
            }
          />
          <Tab
            key="system"
            title={
              <div className="flex items-center space-x-2">
                <span>System</span>
                <Chip size="sm" variant="flat" color={systemCount > 0 ? 'warning' : 'default'}>
                  {systemCount}
                </Chip>
              </div>
            }
          />
          <Tab
            key="archive"
            title={
              <div className="flex items-center space-x-2">
                <span>Archive</span>
                <Chip size="sm" variant="flat">
                  {notifications.filter((n) => n.isArchived).length}
                </Chip>
              </div>
            }
          />
        </Tabs>
      </CardHeader>
      <CardBody className="w-full gap-0 p-0">
        <ScrollShadow className="h-[400px] w-full">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                onClick={() =>
                  !notification.isRead &&
                  useNotificationStore.getState().markAsRead(notification.id)
                }
              />
            ))
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <Icon className="text-default-400" icon="solar:bell-off-linear" width={40} />
              <p className="text-small text-default-400">No notifications yet.</p>
            </div>
          )}
        </ScrollShadow>
      </CardBody>
      <CardFooter className="justify-end gap-2 px-4">
        {activeTab !== NotificationTabs.Archive && filteredNotifications.length > 0 && (
          <Button variant="flat" color="primary" size="sm" onPress={handleArchiveAll}>
            Archive All
          </Button>
        )}
        {activeTab === NotificationTabs.Archive && filteredNotifications.length > 0 && (
          <Button
            variant="flat"
            color="danger"
            size="sm"
            onPress={() => useNotificationStore.getState().clearArchived()}
          >
            Clear Archive
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NotificationsCard;
