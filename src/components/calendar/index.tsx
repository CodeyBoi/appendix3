import React from 'react';
import dayjs from 'dayjs';
import CalendarControl from './control';
import { api } from 'trpc/server';
import { cn } from 'utils/class-names';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);

export type CalendarItem = {
  title: string;
  start: Date;
  end: Date;
};

type CalendarProps = {
  items: CalendarItem[];
  start: Date;
};

const hours = Array.from({ length: 24 }, (_, i) => ({
  label: `${i}:00`,
  value: i,
}));

const Calendar = async ({ items, start }: CalendarProps) => {
  const isAdmin = (await api.corps.getSelf.query())?.role?.name === 'admin';

  const firstDay = dayjs(start);
  const lastDay = firstDay.add(1, 'week');

  const weekItems = items.filter(
    (item) =>
      item.start.getTime() <= lastDay.toDate().getTime() &&
      item.start.getTime() >= firstDay.toDate().getTime(),
  );
  return (
    <div className='flex max-w-3xl flex-col gap-2 rounded border p-2 shadow-sm dark:border-neutral-800'>
      <CalendarControl isAdmin={isAdmin} />
      <div className='grid grid-cols-8 divide-x divide-y divide-solid'>
        <div className='pr-1 text-right'>{firstDay.format('MMM')}</div>
        <div className='text-center'>Mån</div>
        <div className='text-center'>Tis</div>
        <div className='text-center'>Ons</div>
        <div className='text-center'>Tor</div>
        <div className='text-center'>Fre</div>
        <div className='text-center text-red-600'>Lör</div>
        <div className='text-center text-red-600'>Sön</div>
        <div className='pr-1 text-right'>{`v. ${firstDay.week()}`}</div>
        {Array.from({ length: 7 }, (_, i) => {
          const date = firstDay.add(i, 'day');
          return (
            <div
              key={date.toISOString()}
              className={cn('text-center', i >= 5 && 'text-red-600')}
            >
              {date.format('D')}
            </div>
          );
        })}
        {hours.map((hour) => (
          <>
            <div className='p-1 text-right text-xs font-light text-gray-500'>
              {hour.label}
            </div>
            {Array.from({ length: 7 }, (_, i) => {
              const currentHour = firstDay
                .add(i, 'day')
                .add(hour.value, 'hour');
              const item = weekItems.find(
                (item) =>
                  item.start.getHours() >= hour.value &&
                  item.end.getHours() <= hour.value + 1,
              );
              const hasEvent = item !== undefined;
              return (
                <div
                  key={currentHour.toISOString()}
                  className={cn(hasEvent && 'border-red-200 bg-red-200')}
                />
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
