// client/components/analytics/BarChartCard.tsx
'use client';

import type { CardProps } from '@heroui/react';
import {
  Button,
  Card,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ButtonRadioItem } from './ButtonRadioItem';
import type { BarChartProps } from './types';
import { formatWeekday } from './utils';

/**
 * Card component rendering a bar chart with filters and menu.
 */
export const BarChartCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'children'> & BarChartProps
>(({ className, title, categories, color, chartData, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn('h-[300px] border border-transparent dark:border-default-100', className)}
      {...props}
    >
      <div className="flex flex-col gap-y-4 p-4">
        <dt>
          <h3 className="text-small font-medium text-default-500">{title}</h3>
        </dt>
        <dd className="flex w-full justify-end gap-4 text-tiny text-default-500">
          {categories.map((category, index) => (
            <div key={category} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))` }}
              />
              <span className="capitalize">{category}</span>
            </div>
          ))}
        </dd>
      </div>

      <ResponsiveContainer
        className="[&_.recharts-surface]:outline-none"
        height="100%"
        width="100%"
      >
        <BarChart data={chartData} margin={{ top: 20, right: 14, left: -8, bottom: 5 }}>
          <XAxis dataKey="weekday" strokeOpacity={0.25} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip
            content={({ label, payload }) => (
              <div className="flex h-auto min-w-[120px] items-center gap-x-2 rounded-medium bg-background p-2 text-tiny shadow-small">
                <div className="flex w-full flex-col gap-y-1">
                  <span className="font-medium text-foreground">{formatWeekday(label)}</span>
                  {payload?.map((p, index) => {
                    const name = p.name;
                    const value = p.value;
                    const category = categories.find((c) => c.toLowerCase() === name) ?? name;

                    return (
                      <div key={`${index}-${name}`} className="flex w-full items-center gap-x-2">
                        <div
                          className="h-2 w-2 flex-none rounded-full"
                          style={{
                            backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))`,
                          }}
                        />
                        <div className="flex w-full items-center justify-between gap-x-2 pr-1 text-xs text-default-700">
                          <span className="text-default-500">{category}</span>
                          <span className="font-mono font-medium text-default-700">{value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            cursor={false}
          />
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category.toLowerCase()}
              fill={`hsl(var(--heroui-${color}-${(index + 1) * 200}))`}
              barSize={24}
              stackId="bars"
              radius={index === categories.length - 1 ? [4, 4, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <Divider className="mx-auto w-full max-w-[calc(100%-2rem)] bg-default-100" />

      <RadioGroup aria-label="Time Range" className="flex gap-x-2 p-4" defaultValue="7">
        <ButtonRadioItem value="7">7 days</ButtonRadioItem>
        <ButtonRadioItem value="14">14 days</ButtonRadioItem>
        <ButtonRadioItem value="30">30 days</ButtonRadioItem>
      </RadioGroup>

      <Dropdown classNames={{ content: 'min-w-[120px]' }} placement="bottom-end">
        <DropdownTrigger>
          <Button
            isIconOnly
            className="absolute right-2 top-2 w-auto rounded-full"
            size="sm"
            variant="light"
          >
            <Icon height={16} icon="solar:menu-dots-bold" width={16} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="flat" itemClasses={{ title: 'text-tiny' }}>
          <DropdownItem key="view-details">View Details</DropdownItem>
          <DropdownItem key="export-data">Export Data</DropdownItem>
          <DropdownItem key="set-alert">Set Alert</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Card>
  );
});

BarChartCard.displayName = 'BarChartCard';
