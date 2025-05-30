'use client';

import {
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
  type ListboxProps,
  ListboxSection,
  type ListboxSectionProps,
  type Selection,
  Tooltip,
  cn,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';

export enum SidebarItemType {
  Nest = 'nest',
}

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string;
  type?: SidebarItemType.Nest;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  items?: SidebarItem[];
  className?: string;
};

export type SidebarProps = Omit<ListboxProps<SidebarItem>, 'children'> & {
  items: SidebarItem[];
  isCompact?: boolean;
  hideEndContent?: boolean;
  iconClassName?: string;
  sectionClasses?: ListboxSectionProps['classNames'];
  classNames?: ListboxProps['classNames'];
  defaultSelectedKey: string;
  onSelect?: (key: string) => void;
};

/**
 * Sidebar
 * A responsive and dynamic sidebar component with support for nested items and compact mode.
 */
export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      isCompact,
      defaultSelectedKey,
      onSelect,
      hideEndContent,
      sectionClasses: sectionClassesProp = {},
      itemClasses: itemClassesProp = {},
      iconClassName,
      classNames,
      className,
      ...props
    },
    ref,
  ) => {
    const [selected, setSelected] = useState<React.Key>(defaultSelectedKey);
    const router = useRouter();
    const pathname = usePathname();

    const sectionClasses = {
      ...sectionClassesProp,
      base: cn(sectionClassesProp?.base, 'w-full', {
        'p-0 max-w-[44px]': isCompact,
      }),
      group: cn(sectionClassesProp?.group, {
        'flex flex-col gap-1': isCompact,
      }),
      heading: cn(sectionClassesProp?.heading, {
        hidden: isCompact,
      }),
    };

    const itemClasses = {
      ...itemClassesProp,
      base: cn(itemClassesProp?.base, {
        'w-11 h-11 gap-0 p-0': isCompact,
      }),
    };

    const handleItemClick = useCallback(
      (href: string) => {
        if (href) {
          router.push(href);
        }
      },
      [router],
    );

    const renderItem = useCallback(
      (item: SidebarItem): JSX.Element => {
        const isNestType =
          item.items && item.items.length > 0 && item.type === SidebarItemType.Nest;

        if (isNestType) {
          return renderNestItem(item);
        }

        const isActive = item.href === pathname;

        return (
          <ListboxItem
            {...item}
            key={item.key}
            className={cn(item.className, {
              'bg-default-100': isActive,
            })}
            onPress={() => item.href && handleItemClick(item.href)}
            endContent={isCompact || hideEndContent ? null : (item.endContent ?? null)}
            startContent={
              isCompact ? null : item.icon ? (
                <Icon
                  className={cn(
                    'text-default-500 group-data-[selected=true]:text-foreground',
                    iconClassName,
                    { 'text-foreground': isActive },
                  )}
                  icon={item.icon}
                  width={24}
                />
              ) : (
                (item.startContent ?? null)
              )
            }
            textValue={item.title}
            title={isCompact ? null : item.title}
          >
            {isCompact && (
              <Tooltip content={item.title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {item.icon ? (
                    <Icon
                      className={cn(
                        'text-default-500 group-data-[selected=true]:text-foreground',
                        iconClassName,
                        { 'text-foreground': isActive },
                      )}
                      icon={item.icon}
                      width={24}
                    />
                  ) : (
                    (item.startContent ?? null)
                  )}
                </div>
              </Tooltip>
            )}
          </ListboxItem>
        );
      },
      [isCompact, hideEndContent, iconClassName, pathname, handleItemClick],
    );

    const renderNestItem = useCallback(
      (item: SidebarItem): JSX.Element => {
        const isNestType =
          item.items && item.items.length > 0 && item.type === SidebarItemType.Nest;
        const safeItem = isNestType ? { ...item, href: undefined } : item;

        return (
          <ListboxItem
            {...safeItem}
            key={safeItem.key}
            classNames={{
              base: cn({
                'h-auto p-0': !isCompact && isNestType,
                'inline-block w-11': isCompact && isNestType,
              }),
            }}
            endContent={
              isCompact || isNestType || hideEndContent ? null : (safeItem.endContent ?? null)
            }
            startContent={
              isCompact || isNestType ? null : safeItem.icon ? (
                <Icon
                  className={cn(
                    'text-default-500 group-data-[selected=true]:text-foreground',
                    iconClassName,
                  )}
                  icon={safeItem.icon}
                  width={24}
                />
              ) : (
                (safeItem.startContent ?? null)
              )
            }
            title={isCompact || isNestType ? null : safeItem.title}
          >
            {isCompact ? (
              <Tooltip content={safeItem.title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {safeItem.icon ? (
                    <Icon
                      className={cn(
                        'text-default-500 group-data-[selected=true]:text-foreground',
                        iconClassName,
                      )}
                      icon={safeItem.icon}
                      width={24}
                    />
                  ) : (
                    (safeItem.startContent ?? null)
                  )}
                </div>
              </Tooltip>
            ) : null}

            {!isCompact && isNestType && (
              <Accordion className="p-0">
                <AccordionItem
                  key={safeItem.key}
                  aria-label={safeItem.title}
                  classNames={{
                    heading: 'pr-3',
                    trigger: 'p-0',
                    content: 'py-0 pl-4',
                  }}
                  title={
                    safeItem.icon ? (
                      <div className="flex h-11 items-center gap-2 px-2 py-1.5">
                        <Icon
                          className={cn(
                            'text-default-500 group-data-[selected=true]:text-foreground',
                            iconClassName,
                          )}
                          icon={safeItem.icon}
                          width={24}
                        />
                        <span className="text-small font-medium text-default-500 group-data-[selected=true]:text-foreground">
                          {safeItem.title}
                        </span>
                      </div>
                    ) : (
                      (safeItem.startContent ?? null)
                    )
                  }
                >
                  {safeItem.items?.length ? (
                    <Listbox
                      className="mt-0.5"
                      classNames={{
                        list: cn('border-l border-default-200 pl-4'),
                      }}
                      items={safeItem.items}
                      variant="flat"
                    >
                      {safeItem.items.map((child) => renderItem(child))}
                    </Listbox>
                  ) : (
                    renderItem(safeItem)
                  )}
                </AccordionItem>
              </Accordion>
            )}
          </ListboxItem>
        );
      },
      [isCompact, hideEndContent, iconClassName, renderItem],
    );

    return (
      <Listbox
        key={isCompact ? 'compact' : 'default'}
        ref={ref}
        hideSelectedIcon
        as="nav"
        aria-label="Sidebar Navigation"
        className={cn('list-none', className)}
        classNames={{
          ...classNames,
          list: cn('items-center', classNames?.list),
        }}
        color="default"
        itemClasses={{
          ...itemClasses,
          base: cn(
            'px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100',
            itemClasses?.base,
          ),
          title: cn(
            'text-small font-medium text-default-500 group-data-[selected=true]:text-foreground',
            itemClasses?.title,
          ),
        }}
        items={items}
        selectedKeys={[selected] as unknown as Selection}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];
          setSelected(key as React.Key);
          onSelect?.(key as string);
        }}
        {...props}
      >
        {(item) =>
          item.items?.length && item.type === SidebarItemType.Nest ? (
            renderNestItem(item)
          ) : item.items?.length ? (
            <ListboxSection
              key={item.key}
              classNames={sectionClasses}
              showDivider={isCompact}
              title={item.title}
            >
              {item.items.map((child) => renderItem(child))}
            </ListboxSection>
          ) : (
            renderItem(item)
          )
        }
      </Listbox>
    );
  },
);

Sidebar.displayName = 'Sidebar';
