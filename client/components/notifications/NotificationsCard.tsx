'use client';

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
import React from 'react';

import { NotificationItem } from './NotificationItem';

type Notification = {
  id: string;
  isRead?: boolean;
  avatar: string;
  description: string;
  name: string;
  time: string;
  type?: 'default' | 'request' | 'file';
};

enum NotificationTabs {
  All = 'all',
  Unread = 'unread',
  Archive = 'archive',
}

const notifications: Record<NotificationTabs, Notification[]> = {
  all: [
    /* ...same as before... */
  ],
  unread: [
    /* ...same as before... */
  ],
  archive: [],
};

/**
 * NotificationsCard
 * A tabbed card component to show grouped notifications (all, unread, archive).
 */
export const NotificationsCard = (props: CardProps) => {
  const [activeTab, setActiveTab] = React.useState<NotificationTabs>(NotificationTabs.All);
  const activeNotifications = notifications[activeTab];

  return (
    <Card className="w-full max-w-[420px]" {...props}>
      <CardHeader className="flex flex-col px-0 pb-0">
        <div className="flex w-full items-center justify-between px-5 py-2">
          <div className="inline-flex items-center gap-1">
            <h4 className="inline-block align-middle text-large font-medium">Notifications</h4>
            <Chip size="sm" variant="flat">
              12
            </Chip>
          </div>
          <Button className="h-8 px-3" color="primary" radius="full" variant="light">
            Mark all as read
          </Button>
        </div>
        <Tabs
          aria-label="Notifications"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as NotificationTabs)}
          color="primary"
          variant="underlined"
          classNames={{
            base: 'w-full',
            tabList: 'gap-6 px-6 py-0 w-full relative rounded-none border-b border-divider',
            cursor: 'w-full',
            tab: 'max-w-fit px-2 h-12',
          }}
        >
          <Tab key="all" title={<TabLabel label="All" count={9} />} />
          <Tab key="unread" title={<TabLabel label="Unread" count={3} />} />
          <Tab key="archive" title="Archive" />
        </Tabs>
      </CardHeader>

      <CardBody className="w-full gap-0 p-0">
        <ScrollShadow className="h-[500px] w-full">
          {activeNotifications.length > 0 ? (
            activeNotifications.map((notification) => (
              <NotificationItem key={notification.id} {...notification} />
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
        <Button variant={activeTab === NotificationTabs.Archive ? 'flat' : 'light'}>
          Settings
        </Button>
        {activeTab !== NotificationTabs.Archive && <Button variant="flat">Archive All</Button>}
      </CardFooter>
    </Card>
  );
};

const TabLabel = ({ label, count }: { label: string; count: number }) => (
  <div className="flex items-center space-x-2">
    <span>{label}</span>
    <Chip size="sm" variant="flat">
      {count}
    </Chip>
  </div>
);
